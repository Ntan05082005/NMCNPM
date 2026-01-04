import React, { createContext, useContext, useState, useCallback } from 'react';

// Context to share problem/code information with AI Chatbot
const AIContext = createContext(null);

export function AIContextProvider({ children }) {
    const [problemContext, setProblemContext] = useState(null);

    // Set context with problem details
    const setContext = useCallback((context) => {
        setProblemContext(context);
    }, []);

    // Clear context
    const clearContext = useCallback(() => {
        setProblemContext(null);
    }, []);

    return (
        <AIContext.Provider value={{ problemContext, setContext, clearContext }}>
            {children}
        </AIContext.Provider>
    );
}

// Hook to use AI context
export function useAIContext() {
    const context = useContext(AIContext);
    if (!context) {
        // Return default values if not wrapped in provider
        return {
            problemContext: null,
            setContext: () => { },
            clearContext: () => { }
        };
    }
    return context;
}

export default AIContext;
