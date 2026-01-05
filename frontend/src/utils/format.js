/**
 * Format language name for display
 * JAVASCRIPT -> Javascript, CPP -> C++, PYTHON -> Python
 */
export function formatLanguage(language) {
    if (!language) return "-";

    const languageMap = {
        'JAVASCRIPT': 'Javascript',
        'javascript': 'Javascript',
        'JS': 'Javascript',
        'js': 'Javascript',
        'CPP': 'C++',
        'cpp': 'C++',
        'C++': 'C++',
        'c++': 'C++',
        'PYTHON': 'Python',
        'python': 'Python',
        'PY': 'Python',
        'py': 'Python'
    };

    return languageMap[language] || language;
}

/**
 * Format memory value for display
 * Returns formatted string like "1536 KB" or "-" if no value
 */
export function formatMemory(memoryKb) {
    if (memoryKb == null || memoryKb === 0) return "-";
    return `${memoryKb} KB`;
}

/**
 * Format status for display
 * WRONG_ANSWER -> Wrong Answer, RUNTIME_ERROR -> Runtime Error, etc.
 */
export function formatStatus(status) {
    if (!status) return "-";

    // Convert to string and handle common status codes
    const statusStr = String(status).toUpperCase();

    const statusMap = {
        'ACCEPTED': 'ACCEPTED',
        'WRONG_ANSWER': 'WRONG ANSWER',
        'RUNTIME_ERROR': 'RUNTIME ERROR',
        'COMPILE_ERROR': 'COMPILE ERROR',
        'COMPILATION_ERROR': 'COMPILE ERROR',
        'TIME_LIMIT_EXCEEDED': 'TIME LIMIT EXCEEDED',
        'MEMORY_LIMIT_EXCEEDED': 'MEMORY LIMIT EXCEEDED',
        'PENDING': 'PENDING',
        'NO_DATA': 'NO DATA'
    };

    if (statusMap[statusStr]) {
        return statusMap[statusStr];
    }

    // Fallback: replace underscores with spaces and capitalize each word
    return statusStr
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get CSS class for status badge based on submission status
 * Returns consistent class names for styling across all pages
 */
export function getStatusClass(status) {
    if (!status) return 'pending';

    const statusStr = String(status).toUpperCase();

    switch (statusStr) {
        case 'ACCEPTED':
            return 'accepted';
        case 'WRONG_ANSWER':
            return 'wrong';
        case 'RUNTIME_ERROR':
            return 'runtime-error';
        case 'COMPILE_ERROR':
        case 'COMPILATION_ERROR':
            return 'compile-error';
        case 'TIME_LIMIT_EXCEEDED':
            return 'time-limit';
        case 'MEMORY_LIMIT_EXCEEDED':
            return 'memory-limit';
        case 'PENDING':
        default:
            return 'pending';
    }
}
