import { ValidationError, ValidationResult } from '../validators/types';
import * as acorn from 'acorn';

export const lintCode = (code: string, language: string): ValidationError[] => {
    const warnings: ValidationError[] = [];
    const lowerCode = code.toLowerCase();
    const lines = code.split('\n');

    // Generic Checks
    lines.forEach((line, idx) => {
        if (line.includes('TODO') || line.includes('FIXME')) {
            warnings.push({
                line: idx + 1,
                column: line.indexOf('TODO') !== -1 ? line.indexOf('TODO') + 1 : line.indexOf('FIXME') + 1,
                message: 'Found a TODO/FIXME comment.',
                type: 'LintWarning',
                severity: 'warning',
                explanation: 'This indicates unfinished work.',
                fixSuggestion: 'Review and complete the task, then remove the comment.'
            });
        }
    });

    // Language Specific Checks
    if (language === 'javascript' || language === 'js') {
        try {
            const ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });

            // Simple recursive walker
            const walk = (node: any) => {
                if (!node) return;

                // Check for console.log
                if (node.type === 'CallExpression' &&
                    node.callee?.type === 'MemberExpression' &&
                    node.callee?.object?.name === 'console' &&
                    node.callee?.property?.name === 'log') {

                    warnings.push({
                        line: node.loc?.start.line || 0,
                        column: node.loc?.start.column || 0,
                        message: 'Avoid distinct console.log statements in production code.',
                        type: 'LintWarning',
                        severity: 'warning',
                        explanation: 'Logging can clutter output and reveal sensitive info.',
                        fixSuggestion: 'Remove or comment out console.log.'
                    });
                }

                // Traverse children
                for (const key in node) {
                    if (node[key] && typeof node[key] === 'object') {
                        if (Array.isArray(node[key])) {
                            node[key].forEach((child: any) => walk(child));
                        } else if (node[key].type) {
                            walk(node[key]);
                        }
                    }
                }
            };

            walk(ast);

        } catch (e) {
            // Code might be syntactically invalid, so AST parsing fails.
            // We ignore this and rely on the validator to report syntax errors.
        }
    }

    if (language === 'python') {
        if (code.includes('print(')) {
            warnings.push({
                line: 0,
                column: 0,
                message: 'Usage of print() detected.',
                type: 'LintWarning',
                severity: 'warning',
                explanation: 'For production apps, use usage logging instead of print.',
                fixSuggestion: 'Use the `logging` module.'
            });
        }
    }

    if (language === 'css') {
        if (code.includes('{}')) {
            warnings.push({
                line: 0,
                column: 0,
                message: 'Empty ruleset detected.',
                type: 'LintWarning',
                severity: 'warning',
                explanation: 'Empty blocks add parsing overhead for no benefit.',
                fixSuggestion: 'Remove the empty block.'
            });
        }
    }

    return warnings;
};

export const calculateScore = (errors: ValidationError[], warnings: ValidationError[]): number => {
    let score = 100;

    // Penalties
    const errorPenalty = 50;
    const warningPenalty = 5;

    // Deduct
    if (errors.length > 0) {
        // If there are errors, score drops significantly.
        // E.g. 1 error = 50. 2 errors = 0.
        score -= (errors.length * errorPenalty);
    }

    score -= (warnings.length * warningPenalty);

    return Math.max(0, score);
};
