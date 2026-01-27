import * as acorn from 'acorn';
import { ValidationResult } from './types';

export const validateJavascript = (code: string): ValidationResult => {
    try {
        acorn.parse(code, { ecmaVersion: 2020 });
        return { isValid: true, errors: [] };
    } catch (e: any) {
        if (e instanceof SyntaxError) {
            // Acorn adds loc { line, column } to the error object, but typings might not show it explicitly without cast
            const err = e as any;
            return {
                isValid: false,
                errors: [{
                    line: err.loc?.line || 0,
                    column: err.loc?.column || 0,
                    message: err.message,
                    type: 'SyntaxError'
                }]
            };
        }
        return {
            isValid: false,
            errors: [{
                line: 0,
                column: 0,
                message: e.message || 'Unknown error',
                type: 'GeneralError'
            }]
        };
    }
};
