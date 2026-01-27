import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ValidationResult } from './types';

export const validateJava = (code: string): Promise<ValidationResult> => {
    return new Promise((resolve, reject) => {
        // Create a temp directory
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntax-validator-java-'));

        // Java requires the class name to match the file name. 
        // We'll try to extract the class name from code vs using a fixed one.
        // Heuristic: find "public class X"
        const classMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        const filePath = path.join(tempDir, `${className}.java`);

        fs.writeFileSync(filePath, code);

        // Run javac
        const javac = spawn('javac', [filePath], {
            cwd: tempDir
        });

        let errorOutput = '';

        javac.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        javac.on('close', (code) => {
            // Cleanup
            fs.rmSync(tempDir, { recursive: true, force: true });

            if (code === 0) {
                resolve({ isValid: true, errors: [] });
            } else {
                // Parse javac errors
                // Example: Main.java:3: error: ';' expected
                const errors: any[] = [];
                const lines = errorOutput.split('\n');

                for (const line of lines) {
                    // Regex to capture line number and message
                    const match = line.match(/:(\d+):\s+error:\s+(.+)/);
                    if (match) {
                        errors.push({
                            line: parseInt(match[1], 10),
                            column: 1, // javac doesn't always give easy column without -Xlint context lines, sticking to line
                            message: match[2],
                            type: 'SyntaxError'
                        });
                    }
                }

                resolve({
                    isValid: false,
                    errors: errors.length > 0 ? errors : [{
                        line: 0,
                        column: 0,
                        message: errorOutput,
                        type: 'CompilerError'
                    }]
                });
            }
        });
    });
};
