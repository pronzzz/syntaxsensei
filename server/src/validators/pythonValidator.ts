import { spawn } from 'child_process';
import path from 'path';
import { ValidationResult } from './types';

export const validatePython = (code: string): Promise<ValidationResult> => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../scripts/validate_python.py');
        const pythonProcess = spawn('python3', [scriptPath]);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0 && !output) {
                // If process failed and didn't print standard JSON
                return resolve({
                    isValid: false,
                    errors: [{
                        line: 0,
                        column: 0,
                        message: errorOutput || 'Python validation process failed',
                        type: 'ProcessError'
                    }]
                });
            }

            try {
                const result = JSON.parse(output);
                if (result.isValid) {
                    resolve({ isValid: true, errors: [] });
                } else {
                    resolve({
                        isValid: false,
                        errors: [result.error] // The python script returns single error object
                    });
                }
            } catch (e) {
                resolve({
                    isValid: false,
                    errors: [{
                        line: 0,
                        column: 0,
                        message: 'Failed to parse validator output',
                        type: 'InternalError'
                    }]
                });
            }
        });

        pythonProcess.stdin.write(code);
        pythonProcess.stdin.end();
    });
};
