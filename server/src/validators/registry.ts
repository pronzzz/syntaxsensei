import { ValidationResult } from './types';
import { validateJavascript } from './javascriptValidator';
import { validatePython } from './pythonValidator';
import { validateHtml } from './htmlValidator';
import { validateCss } from './cssValidator';
import { validateJson } from './jsonValidator';
import { validateJava } from './javaValidator';
import { validateCpp } from './cppValidator';

type ValidatorFn = (code: string) => ValidationResult | Promise<ValidationResult>;

const validators: Record<string, ValidatorFn> = {
    'javascript': validateJavascript,
    'js': validateJavascript,
    'python': validatePython,
    'py': validatePython,
    'html': validateHtml,
    'css': validateCss,
    'json': validateJson,
    'java': validateJava,
    'c++': validateCpp,
    'cpp': validateCpp,
};

export const getValidator = (language: string): ValidatorFn | null => {
    return validators[language.toLowerCase()] || null;
};
