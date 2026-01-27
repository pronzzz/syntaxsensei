import { Request, Response } from 'express';
import { getValidator } from '../validators/registry';
import { ValidationResult } from '../validators/types';
import { enrichError } from '../services/explanationService';
import { lintCode, calculateScore } from '../services/linterService';

export const validateCode = async (req: Request, res: Response) => {
    const { language, code } = req.body;

    if (!language || typeof code !== 'string') {
        res.status(400).json({ error: 'Missing language or code' });
        return;
    }

    try {
        const validator = getValidator(language);
        if (!validator) {
            res.status(400).json({ error: `Unsupported language: ${language}` });
            return;
        }

        let result = await Promise.resolve(validator(code));

        // Enrich errors with explanations
        if (!result.isValid && result.errors.length > 0) {
            result.errors = result.errors.map(err => ({ ...enrichError(err, language), severity: 'error' }));
        }

        // Run Linter (Warnings)
        const warnings = lintCode(code, language);

        // Calculate Score
        const score = calculateScore(result.errors, warnings);

        // Update result
        result.warnings = warnings;
        result.score = score;

        res.json(result);

    } catch (error: any) {
        console.error('Validation error:', error);
        res.status(500).json({
            isValid: false,
            errors: [{
                line: 0,
                column: 0,
                message: 'Internal server error during validation',
                type: 'ServerError'
            }]
        });
    }
};
