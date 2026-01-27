import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LanguageSelector } from './LanguageSelector';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';

// Default snippets
const SNIPPETS: Record<string, string> = {
    javascript: `// Write your JavaScript code here\nconst result = [1, 2, 3].map(x => x * 2);\nconsole.log(result);`,
    python: `# Write your Python code here\ndef greet(name):\n    return f"Hello, {name}"\n\nprint(greet("World"))`,
    html: `<!-- Write your HTML here -->\n<div>\n    <h1>Hello World</h1>\n</div>`,
    css: `/* Write your CSS here */\nbody {\n    background-color: #333;\n    color: white;\n}`
};

interface ValidationError {
    line: number;
    column: number;
    message: string;
    type: string;
    explanation?: string;
    fixSuggestion?: string;
}

export const Layout: React.FC = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(SNIPPETS['javascript']);
    const [isValid, setIsValid] = useState(true);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [warnings, setWarnings] = useState<ValidationError[]>([]);
    const [score, setScore] = useState(100);
    const [isChecking, setIsChecking] = useState(false);

    // Update code snippet when language changes
    useEffect(() => {
        setCode(SNIPPETS[language] || '');
        setErrors([]);
        setWarnings([]);
        setScore(100);
        setIsValid(true);
    }, [language]);

    useEffect(() => {
        const validate = async () => {
            if (!code.trim()) return;

            setIsChecking(true);
            try {
                // Pointing to the backend we built in Phase 1
                const response = await axios.post('http://localhost:3000/validate', {
                    language,
                    code
                });

                const { isValid: valid, errors: errs, warnings: warns, score: s } = response.data;
                setIsValid(valid);
                setErrors(errs || []);
                setWarnings(warns || []);
                setScore(s !== undefined ? s : 100);
            } catch (error) {
                console.error("Validation failed", error);
                // Could set a generic error
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(validate, 500); // Debounce 500ms
        return () => clearTimeout(timeoutId);
    }, [code, language]);

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        SyntaxSensei
                    </span>
                </div>
                <LanguageSelector language={language} setLanguage={setLanguage} code={code} />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Editor Pane */}
                <div className="w-2/3 p-4">
                    <CodeEditor
                        language={language}
                        code={code}
                        onChange={(val) => setCode(val || '')}
                        errors={errors}
                    />
                </div>

                {/* Output Pane */}
                <div className="w-1/3 bg-gray-900 border-l border-gray-800">
                    <OutputPanel
                        isValid={isValid}
                        errors={errors}
                        warnings={warnings}
                        score={score}
                        isChecking={isChecking}
                        code={code}
                    />
                </div>
            </main>
        </div>
    );
};
