export const detectLanguage = (code: string): string => {
    // Basic heuristics
    if (code.includes('public class') || code.includes('System.out.println')) {
        return 'java';
    }
    if (code.includes('#include') || code.includes('using namespace std') || code.includes('std::')) {
        return 'cpp';
    }
    if (code.trim().startsWith('<!DOCTYPE html>') || code.includes('<html>') || code.includes('</div>')) {
        return 'html';
    }
    if (code.includes('def ') && code.includes(':') && !code.includes('function')) {
        return 'python';
    }
    if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
        // Could be JSON or JS object. JSON keys are quoted.
        if (/"\w+":/.test(code)) {
            return 'json';
        }
    }
    if (code.includes('body {') || code.includes('px;') || code.includes('@media')) {
        return 'css';
    }

    // Default to JavaScript
    return 'javascript';
};
