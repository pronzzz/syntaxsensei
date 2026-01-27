import * as csstree from 'css-tree';
import { ValidationResult } from './types';

export const validateCss = (code: string): ValidationResult => {
    try {
        csstree.parse(code, {
            filename: 'style.css',
            positions: true,
            onParseError: (error) => {
                throw error;
            }
        });
        return { isValid: true, errors: [] };
    } catch (e: any) {
        // css-tree throws syntax errors with line/column
        return {
            isValid: false,
            errors: [{
                line: e.line || 0,
                column: e.column || 0,
                message: e.message,
                type: 'SyntaxError'
            }]
        };
    }
};
