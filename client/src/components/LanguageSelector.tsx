import React, { useState } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';

interface LanguageSelectorProps {
    language: string;
    setLanguage: (lang: string) => void;
    code: string;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage, code }) => {
    const [detecting, setDetecting] = useState(false);

    const handleAutoDetect = async () => {
        if (!code.trim()) return;
        setDetecting(true);
        try {
            const res = await axios.post('http://localhost:3000/detect', { code });
            if (res.data.language) {
                setLanguage(res.data.language);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setDetecting(false);
        }
    };

    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={handleAutoDetect}
                className={cn("text-xs px-2 py-1 rounded bg-blue-900 text-blue-200 hover:bg-blue-800 transition-colors", detecting && "opacity-50")}
                disabled={detecting}
            >
                {detecting ? 'Detecting...' : '✨ Auto Detect'}
            </button>

            <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-300">Language:</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
