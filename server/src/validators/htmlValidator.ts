import * as htmlparser2 from 'htmlparser2';
import { ValidationResult, ValidationError } from './types';

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export const validateHtml = (code: string): ValidationResult => {
    const errors: ValidationError[] = [];

    // Helper to get line/column from index
    // Optimization: Pre-calculate line offsets? For now, split on demand is okay for MVP.
    const getPos = (index: number) => {
        const parsed = code.substring(0, index);
        const lines = parsed.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        return { line, column };
    };

    const parser = new htmlparser2.Parser({
        onopentag(name) {
            // We don't need to do much on open, just track if we want deep nesting rules?
            // Rely on onclosetag regarding implicit closes.
        },
        onclosetag(name) {
            // Check if this tag is being closed implicitly or explicitly
            // parser.startIndex and parser.endIndex correspond to the tag causing the event
            const { startIndex, endIndex } = parser;

            // Should verify if startIndex is valid (it might be -1 or such? No, usually valid)
            if (startIndex < 0) return;

            const snippet = code.substring(startIndex, endIndex + 1);

            // Case 1: Void element -> Always valid to close (either by self-close or implicit)
            // But wait, <br></br> is valid in XHTML but weird in HTML.
            // If snippet is </br>, that's an explicit close.
            // If snippet is <br>, that's implicit.
            // If snippet is <br/>, that's self-close.
            // We generally allow all for Void elements.
            if (VOID_ELEMENTS.has(name.toLowerCase())) {
                return;
            }

            // Case 2: Non-Void element. MUST be explicitly closed.
            // Valid forms:
            // - </name...>
            // - <name ... />

            const lowerSnippet = snippet.toLowerCase();
            const lowerName = name.toLowerCase();

            // Self-closing check
            // Note: snippet might include attributes: <div class="x" />
            // Check if snippet starts with <name and ends with />
            if (lowerSnippet.startsWith(`<${lowerName}`) && lowerSnippet.endsWith('/>')) {
                return;
            }

            // Explicit close check
            // Check if snippet starts with </name
            if (lowerSnippet.startsWith(`</${lowerName}`)) {
                return;
            }

            // If we are here, it's an IMPLICIT close or a mismatch
            // e.g. snippet is `</div>` but name is `span`
            // or snippet is empty (EOF)

            const pos = getPos(startIndex);
            let msg = `Unclosed tag <${name}>`;

            // Enhance message: check if snippet is actually closing something else
            if (snippet.startsWith('</')) {
                // We found a closing tag for something else, implying `name` was left open
                msg = `Expected </${name}> but found ${snippet.split('>')[0]}>`;
            }

            errors.push({
                line: pos.line,
                column: pos.column,
                message: msg,
                type: 'SyntaxError'
            });
        },
        onerror(error) {
            errors.push({
                line: 0,
                column: 0,
                message: error.message,
                type: 'ParserError'
            });
        }
    }, { xmlMode: true, lowerCaseTags: true });

    parser.write(code);
    parser.end();

    return { isValid: errors.length === 0, errors };
};
