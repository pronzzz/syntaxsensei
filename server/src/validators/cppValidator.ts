import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ValidationResult } from './types';

export const validateCpp = (code: string): Promise<ValidationResult> => {
    return new Promise((resolve, reject) => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntax-validator-cpp-'));
        const filePath = path.join(tempDir, 'temp.cpp');

        fs.writeFileSync(filePath, code);

        // Run clang -fsyntax-only
        const clang = spawn('clang', ['-fsyntax-only', filePath, '-ferror-limit=5'], {
            cwd: tempDir
        });

        let errorOutput = '';

        clang.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        clang.on('close', (code) => {
            // Cleanup
            fs.rmSync(tempDir, { recursive: true, force: true });

            if (code === 0) {
                resolve({ isValid: true, errors: [] });
            } else {
                // Parse clang errors
                // Example: temp.cpp:1:2: error: expected ';' after top level declarator
                const errors: any[] = [];
                const lines = errorOutput.split('\n');

                for (const line of lines) {
                    const match = line.match(/:(\d+):(\d+):\s+error:\s+(.+)/);
                    if (match) {
                        errors.push({
                            line: parseInt(match[1], 10),
                            column: parseInt(match[2], 10),
                            message: match[3],
                            type: 'SyntaxError'
                        });
                    }
                }

                resolve({
                    isValid: false,
                    errors: errors.length > 0 ? errors : [{
                        line: 0,
                        column: 0,
                        message: errorOutput || 'Unknown compiler error',
                        type: 'CompilerError'
                    }]
                });
            }
        });
    });
};
