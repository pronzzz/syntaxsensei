import React from 'react';
import { cn } from '../lib/utils';

interface ValidationError {
    line: number;
    column: number;
    message: string;
    type: string;
    explanation?: string;
    fixSuggestion?: string;
}

interface OutputPanelProps {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    score: number;
    isChecking: boolean;
    code: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ isValid, errors, warnings, score, isChecking, code }) => {
    const handleExport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            score,
            isValid,
            errors,
            warnings,
            code
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'syntax-report.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getScoreColor = (s: number) => {
        if (s >= 90) return 'text-green-400 border-green-500';
        if (s >= 50) return 'text-yellow-400 border-yellow-500';
        return 'text-red-400 border-red-500';
    };

    return (
        <div className="bg-gray-900 border-t border-gray-700 p-4 h-full overflow-auto flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-200">Validation</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        {isChecking && <span className="text-yellow-400 text-sm animate-pulse">Checking...</span>}
                        {!isChecking && (
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold",
                                isValid ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                            )}>
                                {isValid ? "Valid Syntax" : "Errors Found"}
                            </span>
                        )}
                    </div>
                </div>

                {/* Score Circle */}
                <div className={cn("relative w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-xl", getScoreColor(score))}>
                    {score}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
                {/* Errors */}
                {errors.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-red-400 font-bold uppercase text-xs tracking-wider">Errors</h3>
                        {errors.map((error, idx) => (
                            <div key={idx} className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-sm text-red-200">
                                <div className="font-mono text-xs text-red-400 mb-2">
                                    Line {error.line}, Column {error.column}
                                </div>
                                <div className="font-semibold mb-1">{error.message}</div>

                                {(error.explanation || error.fixSuggestion) && (
                                    <div className="mt-3 pt-3 border-t border-red-500/30">
                                        {error.explanation && (
                                            <p className="text-gray-300 mb-1">
                                                <span className="font-bold text-blue-300">💡 Why:</span> {error.explanation}
                                            </p>
                                        )}
                                        {error.fixSuggestion && (
                                            <p className="text-gray-300">
                                                <span className="font-bold text-green-300">🔧 Fix:</span> {error.fixSuggestion}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Warnings */}
                {warnings.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-yellow-400 font-bold uppercase text-xs tracking-wider">Warnings</h3>
                        {warnings.map((warning, idx) => (
                            <div key={idx} className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded text-sm text-yellow-200">
                                <div className="font-mono text-xs text-yellow-400 mb-2">
                                    Line {warning.line}
                                </div>
                                <div className="font-semibold">{warning.message}</div>
                                {warning.fixSuggestion && (
                                    <div className="mt-2 text-gray-400 text-xs">
                                        Tip: {warning.fixSuggestion}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {errors.length === 0 && warnings.length === 0 && isValid && !isChecking && (
                    <div className="flex flex-col items-center justify-center text-green-400 mt-10">
                        <span className="text-4xl mb-2">🎉</span>
                        <p>Clean code! No errors or warnings.</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                    onClick={handleExport}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded transition-colors flex items-center justify-center"
                >
                    Download Report 📥
                </button>
            </div>
        </div>
    );
};
