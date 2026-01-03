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
