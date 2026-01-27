import { ValidationError } from '../validators/types';

export const enrichError = (error: ValidationError, language: string): ValidationError => {
    let explanation = "We found a syntax error here.";
    let fixSuggestion = "Check the syntax around this line.";

    const msg = error.message.toLowerCase();
    const lang = language.toLowerCase();

    // ---------------------------------------------------------
    // PYTHON
    // ---------------------------------------------------------
    if (lang === 'python' || lang === 'py') {
        if (msg.includes('invalid syntax')) {
            explanation = "This line breaks Python's syntax rules. Common causes are missing colons, mismatched parentheses, or incorrect keywords.";
            fixSuggestion = "Did you forget a colon ':' at the end of a def, if, or for line?";
        }
        else if (msg.includes('indentationerror')) {
            explanation = "Python relies on strict indentation (spaces or tabs) to define blocks of code.";
            fixSuggestion = "Make sure all lines in the block start with the same number of spaces.";
        }
        else if (msg.includes('eol while scanning string literal')) {
            explanation = "You started a text string with a quote but didn't close it before the line ended.";
            fixSuggestion = "Add a closing quote (' or \") at the end of the string.";
        }
        else if (msg.includes('unexpected eof while parsing')) {
            explanation = " The file ended unexpectedly. You might have left a parenthesis or bracket open.";
            fixSuggestion = "Check your parentheses '()' and brackets '[]' or '{}'.";
        }
    }

    // ---------------------------------------------------------
    // JAVASCRIPT
    // ---------------------------------------------------------
    else if (lang === 'javascript' || lang === 'js') {
        if (msg.includes('unexpected token')) {
            if (msg.includes(';')) {
                explanation = "There is a semicolon where it shouldn't be, or you have a syntax error just before it.";
                fixSuggestion = "Remove the extra semicolon or check the code immediately preceding it.";
            } else if (msg.includes('}')) {
                explanation = "You might have an extra closing brace '}' or you closed a block too early.";
                fixSuggestion = "Check your braces '{}' logic.";
            } else {
                explanation = "The code contains a character or word that JavaScript didn't expect here.";
                fixSuggestion = "Check for missing parentheses, commas, or typos in keywords.";
            }
        }
        else if (msg.includes('unexpected end of input')) {
            explanation = "The file ended too soon. This usually means you forgot a closing brace or parenthesis.";
            fixSuggestion = "Add '}' or ')' to close your blocks.";
        }
    }

    // ---------------------------------------------------------
    // HTML
    // ---------------------------------------------------------
    else if (lang === 'html') {
        if (msg.includes('unclosed tag')) {
            explanation = "You opened a tag but never closed it.";
            fixSuggestion = `Find where you opened the tag and add a closing tag (e.g., </div>).`;
        }
        else if (msg.includes('expected') && msg.includes('found')) {
            explanation = "Your tags are crossed. You tried to close a tag that wasn't the most recent one opened.";
            fixSuggestion = "Ensure your tags are nested correctly: <b><i>...</i></b>";
        }
        else if (msg.includes('unexpected closing tag')) {
            explanation = "You are closing a tag that wasn't open.";
            fixSuggestion = "Remove the extra closing tag.";
        }
    }

    // ---------------------------------------------------------
    // CSS
    // ---------------------------------------------------------
    else if (lang === 'css') {
        if (msg.includes('colon is expected')) {
            explanation = "CSS properties must be followed by a colon.";
            fixSuggestion = "Add ':' between the property name and value (e.g., color: red;).";
        }
        else if (msg.includes('semicolon is expected') || msg.includes('} is expected')) {
            explanation = "CSS rules usually need to end with a semicolon, or the block needs to be closed.";
            fixSuggestion = "Add ';' at the end of the line or '}' to close the block.";
        }
    }

    return {
        ...error,
        explanation,
        fixSuggestion
    };
};
