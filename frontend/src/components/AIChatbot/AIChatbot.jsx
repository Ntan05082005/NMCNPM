import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { RiRobot2Fill } from 'react-icons/ri';
import { sendChatMessage } from '../../API/api-ai';
import { useAIContext } from './AIContext';
import './AIChatbot.css';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hi! 👋 I'm **UniCode Assistant**, your AI coding helper. I can help you with:\n\n• Understanding coding problems\n• Explaining algorithms & data structures\n• Debugging your code\n• Giving hints and optimizations\n\nHow can I help you today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Get current problem context
    const { problemContext } = useAIContext();

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Notify user when context changes
    useEffect(() => {
        if (problemContext && isOpen) {
            // Show a subtle notification that context is available
            const hasContextMessage = messages.some(m => m.isContextNotification);
            if (!hasContextMessage) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `📝 I can see you're working on **"${problemContext.title}"** (${problemContext.difficulty}). Feel free to ask me anything about this problem!`,
                    isContextNotification: true
                }]);
            }
        }
    }, [problemContext, isOpen]);

    const buildContextString = () => {
        if (!problemContext) return null;

        let context = `Current Problem: ${problemContext.title}\n`;
        context += `Difficulty: ${problemContext.difficulty}\n`;

        if (problemContext.description) {
            context += `\nProblem Description:\n${problemContext.description}\n`;
        }

        if (problemContext.code) {
            context += `\nUser's Current Code (${problemContext.language}):\n\`\`\`${problemContext.language}\n${problemContext.code}\n\`\`\`\n`;
        }

        if (problemContext.examples && problemContext.examples.length > 0) {
            context += `\nExamples:\n`;
            problemContext.examples.forEach((ex, i) => {
                context += `Example ${i + 1}: Input: ${ex.input}, Output: ${ex.output}\n`;
            });
        }

        return context;
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Build context string from current problem
            const context = buildContextString();

            const response = await sendChatMessage(userMessage, context);

            if (response.data.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.reply
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Sorry, I encountered an error: ${response.data.error}`,
                    isError: true
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: error.response?.status === 401
                    ? 'Please log in to use the AI assistant.'
                    : 'Sorry, I couldn\'t connect to the AI service. Please try again.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Simple markdown-like formatting for code blocks
    const formatMessage = (content) => {
        if (!content) return '';

        // Handle bold text **text**
        const processBold = (text) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        // Split by code blocks
        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                // Extract language and code
                const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
                if (match) {
                    const [, lang, code] = match;
                    return (
                        <div key={index} className="chat-code-block">
                            {lang && <div className="code-lang">{lang}</div>}
                            <pre><code>{code.trim()}</code></pre>
                        </div>
                    );
                }
            }

            // Format inline code and bold
            const inlineFormatted = part.split(/(`[^`]+`)/g).map((segment, i) => {
                if (segment.startsWith('`') && segment.endsWith('`')) {
                    return <code key={i} className="inline-code">{segment.slice(1, -1)}</code>;
                }
                return <span key={i}>{processBold(segment)}</span>;
            });

            return <span key={index}>{inlineFormatted}</span>;
        });
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                className={`ai-chat-toggle ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                title="UniCode Assistant"
            >
                <RiRobot2Fill className="toggle-icon" />
                {problemContext && <span className="context-dot" title="Context available"></span>}
            </button>

            {/* Chat Window */}
            <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="ai-chat-header">
                    <div className="header-title">
                        <RiRobot2Fill className="header-icon" />
                        <span>UniCode Assistant</span>
                    </div>
                    <div className="header-actions">
                        {problemContext && (
                            <div className="context-badge" title={`Context: ${problemContext.title}`}>
                                📝 {problemContext.title.length > 12 ? problemContext.title.substring(0, 12) + '...' : problemContext.title}
                            </div>
                        )}
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <FiX />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="ai-chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.role} ${msg.isError ? 'error' : ''} ${msg.isContextNotification ? 'context-notification' : ''}`}
                        >
                            <div className="message-content">
                                {formatMessage(msg.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message assistant loading">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="ai-chat-input">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={problemContext ? `Ask about "${problemContext.title}"...` : "Ask me about coding..."}
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <FiSend />
                    </button>
                </div>
            </div>
        </>
    );
}
