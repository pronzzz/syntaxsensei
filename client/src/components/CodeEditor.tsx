import React, { useEffect, useRef } from 'react';
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react';

interface ValidationError {
    line: number;
    column: number;
    message: string;
    type: string;
    explanation?: string;
    fixSuggestion?: string;
}

interface CodeEditorProps {
    language: string;
    code: string;
    onChange: (value: string | undefined) => void;
    errors: ValidationError[];
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange, errors }) => {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    useEffect(() => {
        if (!monacoRef.current || !editorRef.current) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        const markers = errors.map((err) => ({
            startLineNumber: err.line,
            startColumn: err.column,
            endLineNumber: err.line,
            // Simple approach: highlight until end of line or specific range if we had it. 
            // Since we only get line/col, let's just highlight a few chars or the rest of the line?
            // Monaco wants endColumn. 
            endColumn: model.getLineMaxColumn(err.line),
            message: err.message,
            severity: monacoRef.current.MarkerSeverity.Error,
        }));

        monacoRef.current.editor.setModelMarkers(model, 'owner', markers);

    }, [errors]);

    return (
        <div className="h-full w-full border border-gray-700 rounded-md overflow-hidden shadow-lg">
            <Editor
                height="100%"
                language={language}
                value={code}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
