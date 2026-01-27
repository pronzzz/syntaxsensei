import { ValidationResult } from './types';

export const validateJson = (code: string): ValidationResult => {
    try {
        JSON.parse(code);
        return { isValid: true, errors: [] };
    } catch (e: any) {
        // e.message usually looks like "Unexpected token } in JSON at position 10"
        return {
            isValid: false,
            errors: [{
                line: 0, // JSON.parse doesn't provide line numbers natively easily without a helper or custom parser
                column: 0,
                message: e.message,
                type: 'SyntaxError',
                explanation: "JSON syntax is very strict. Quote all keys and use double quotes.",
                fixSuggestion: "Check for trailing commas, single quotes (not allowed), or missing braces."
            }]
        };
    }
};
