export interface ValidationError {
    line: number;
    column: number;
    message: string;
    type: string;
    explanation?: string;
    fixSuggestion?: string;
    severity?: 'error' | 'warning';
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings?: ValidationError[];
    score?: number;
}
