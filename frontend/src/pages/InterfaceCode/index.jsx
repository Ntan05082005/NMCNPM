import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // THÊM useNavigate
import { getProblemDetail, runCode, submitCode } from "../../API/api-InterfaceCode.js";
import './InterfaceCode.css';

// --- HÀM TIỆN ÍCH ---
const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// --- COMPONENT EDITOR (Giữ nguyên không đổi) ---
const CodeEditor = ({ defaultCode, submissionStatus, currentCode, onCodeChange, selectedLanguage, onLanguageChange }) => {
    const codeToDisplay = currentCode !== undefined ? currentCode : (defaultCode?.code || "");
    const lines = codeToDisplay.split('\n');
    const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1).join('\n');
    const availableLanguages = ["C++", "Python", "JavaScript"];
    const textareaRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(null);

    useEffect(() => {
        if (textareaRef.current && cursorPosition !== null) {
            textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
            setCursorPosition(null);
        }
    }, [codeToDisplay, cursorPosition]);

    const handleKeyDown = (e) => {
        const { value, selectionStart, selectionEnd } = textareaRef.current;
        if (e.key === 'Tab') {
            e.preventDefault();
            const tabChar = "    ";
            const newValue = value.substring(0, selectionStart) + tabChar + value.substring(selectionEnd);
            onCodeChange(newValue);
            setCursorPosition(selectionStart + 4);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const linesUpToCursor = value.substring(0, selectionStart).split("\n");
            const currentLine = linesUpToCursor[linesUpToCursor.length - 1];
            const currentIndent = currentLine.match(/^\s*/)[0];
            let extraIndent = "";
            const trimmedLine = currentLine.trim();
            if (trimmedLine.endsWith("{") || trimmedLine.endsWith("(") || trimmedLine.endsWith(":")) {
                extraIndent = "    ";
            }
            const newIndent = currentIndent + extraIndent;
            const newValue = value.substring(0, selectionStart) + "\n" + newIndent + value.substring(selectionEnd);
            onCodeChange(newValue);
            setCursorPosition(selectionStart + 1 + newIndent.length);
        }
    };

    return (
        <div className="code-editor">
            <div className="code-editor-content">
                <pre className="code-line-numbers">{lineNumbers}</pre>
                <textarea
                    ref={textareaRef}
                    className="code-input-area"
                    value={codeToDisplay}
                    onChange={(e) => onCodeChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={lines.length + 5}
                    spellCheck="false"
                />
            </div>
            {submissionStatus && submissionStatus.errorMessage && (
                <div className="error-message">
                    {submissionStatus.errorMessage.split('\n').map((line, index) => (
                        <React.Fragment key={index}>{line}<br /></React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- COMPONENT CHÍNH ---
export default function InterfaceCode() {
    const { slug } = useParams();
    const navigate = useNavigate(); // KHỞI TẠO NAVIGATE

    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCode, setCurrentCode] = useState("");
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [activeConsoleTab, setActiveConsoleTab] = useState('Result');
    const [customInput, setCustomInput] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("C++");
    const [runResult, setRunResult] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);
    const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);

    const loadProblem = async (lang) => {
        setIsLoading(true);
        try {
            const response = await getProblemDetail(slug, lang.toLowerCase());
            const data = response.data;
            setProblem(data);
            setCurrentCode(data.defaultCode.code);
        } catch (error) {
            console.error("Lỗi tải bài tập:", error);
            setProblem(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (slug) loadProblem(selectedLanguage);
    }, [slug, selectedLanguage]);

    useEffect(() => {
        const interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRunCode = async () => {
        if (!problem || isRunning) return;
        setIsRunning(true);
        setRunResult(null);
        setActiveConsoleTab('Result');
        try {
            const requestData = {
                problemId: problem.id,
                language: selectedLanguage.toLowerCase(),
                code: currentCode
            };
            
            // Include custom input if provided
            if (customInput && customInput.trim()) {
                requestData.customInput = customInput.trim();
            }
            
            const response = await runCode(requestData);
            setRunResult(response.data);
        } catch (error) {
            console.error("Run code error:", error);
            setRunResult({
                status: 'ERROR',
                errorMessage: error.response?.data?.message || 'Connection error or not logged in.'
            });
        } finally {
            setIsRunning(false);
        }
    };
    // Trong component InterfaceCode:
    const handleSubmitCode = async () => {
        if (!problem || isSubmitting) return;
        setIsSubmitting(true);
        setSubmissionResult(null);

        try {
            const response = await submitCode({
                problemId: problem.id,
                language: selectedLanguage.toLowerCase(),
                code: currentCode
            });
            
            // Navigate to submission result page with data
            navigate('/submission-result', {
                state: {
                    status: response.data.status,
                    errorMessage: response.data.errorMessage || '',
                    message: response.data.message || '',
                    stderr: response.data.stderr || '',
                    compilerError: response.data.compilerError || '',
                    timeLimit: `${response.data.executionTimeMs || 0} ms`,
                    memoryLimit: response.data.memoryUsedMB ? `${response.data.memoryUsedMB} MB` : 'N/A',
                    testcasesPassed: `${response.data.testCasesPassed || 0} / ${response.data.totalTestCases || 0}`,
                    testResults: response.data.testResults || [],
                    language: selectedLanguage,
                    problemTitle: problem.title,
                    problemSlug: slug,
                    submissionId: response.data.submissionId
                }
            });

        } catch (error) {
            console.error('Error submitting code:', error);
            // Navigate to result page with error
            navigate('/submission-result', {
                state: {
                    status: 'ERROR',
                    errorMessage: error.response?.data?.message || 'Failed to submit code. Please try again.',
                    message: 'Submission failed',
                    timeLimit: '0 ms',
                    memoryLimit: 'N/A',
                    testcasesPassed: '0 / 0',
                    language: selectedLanguage,
                    problemTitle: problem.title,
                    problemSlug: slug
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="loading-state">Đang tải chi tiết bài tập...</div>;
    if (!problem) return <div className="error-state">Không tìm thấy bài tập.</div>;

    return (
        <div className="interface-code-wrapper full-interface-container">
            {/* Main Split Layout */}
            <div className="split-container">
                {/* LEFT PANEL - Problem Description */}
                <div className="left-panel">
                    <div className="problem-header">
                        <div className="problem-title-row">
                            <h1 className="problem-title">{problem.title}</h1>
                        </div>
                        <div className="problem-meta">
                            <span className={`difficulty-badge ${problem.difficulty?.toLowerCase() || 'medium'}`}>
                                {problem.difficulty || 'Medium'}
                            </span>
                            {problem.category && (
                                <span className="category-badge">{problem.category}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="problem-description-scroll">
                        <div className="description-content" dangerouslySetInnerHTML={{ __html: problem.description }} />
                        
                        <div className="examples-section">
                            {problem.examples && problem.examples.map(ex => (
                                <div key={ex.id} className="example-card">
                                    <h4 className="example-title">Example {ex.id}:</h4>
                                    <div className="example-body">
                                        <div className="example-row">
                                            <span className="label">Input:</span>
                                            <code className="value">{ex.input}</code>
                                        </div>
                                        <div className="example-row">
                                            <span className="label">Output:</span>
                                            <code className="value">{ex.output}</code>
                                        </div>
                                        {ex.explanation && (
                                            <div className="example-row">
                                                <span className="label">Explanation:</span>
                                                <span className="explanation-text">{ex.explanation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {problem.constraints && problem.constraints.length > 0 && (
                            <div className="constraint-card">
                                <h4 className="constraint-title">Constraints:</h4>
                                <ul className="constraint-list">
                                    {problem.constraints.map((c, i) => (
                                        <li key={i}><code>{c}</code></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resizer */}
                <div className="panel-resizer"></div>

                {/* RIGHT PANEL - Code Editor + Console */}
                <div className="right-panel">
                    {/* Top Bar with Language and Buttons */}
                    <div className="right-panel-header">
                        <div className="header-left">
                            <select 
                                className="language-select" 
                                value={selectedLanguage} 
                                onChange={(e) => {
                                    setSelectedLanguage(e.target.value);
                                    setSubmissionResult(null);
                                }}
                            >
                                <option value="C++">C++</option>
                                <option value="Python">Python</option>
                                <option value="JavaScript">JavaScript</option>
                            </select>
                        </div>
                        <div className="header-right">
                            <button className="run-button" onClick={handleRunCode} disabled={isRunning}>
                                <span className="btn-icon">▶</span>
                                {isRunning ? 'Running...' : 'Run'}
                            </button>
                            <button className="submit-button" onClick={handleSubmitCode} disabled={isSubmitting}>
                                <span className="btn-icon">↗</span>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>

                    {/* Code Editor Section */}
                    <div className={`code-section ${isConsoleExpanded ? 'minimized' : ''} ${isConsoleMinimized ? 'expanded' : ''}`}>
                        <CodeEditor
                            defaultCode={problem.defaultCode}
                            submissionStatus={submissionResult}
                            currentCode={currentCode}
                            onCodeChange={setCurrentCode}
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={(lang) => {
                                setSelectedLanguage(lang);
                                setSubmissionResult(null);
                            }}
                        />
                    </div>

                    {/* Console/Test Section */}
                    <div className={`console-section ${isConsoleExpanded ? 'expanded' : ''} ${isConsoleMinimized ? 'minimized' : ''}`}>
                        <div className="console-header-bar">
                            <div className="console-tabs">
                                <div className={`console-tab ${activeConsoleTab === 'Result' ? 'active' : ''}`} onClick={() => setActiveConsoleTab('Result')}>
                                    <span className="tab-icon">✓</span> Test Result
                                </div>
                                <div className={`console-tab ${activeConsoleTab === 'Custom' ? 'active' : ''}`} onClick={() => setActiveConsoleTab('Custom')}>
                                    <span className="tab-icon">›_</span> Custom Input
                                </div>
                            </div>
                            <div className="console-controls">
                                <button 
                                    className="console-control-btn" 
                                    onClick={() => {
                                        if (isConsoleMinimized) {
                                            setIsConsoleMinimized(false);
                                        } else {
                                            setIsConsoleExpanded(!isConsoleExpanded);
                                        }
                                    }}
                                    title={isConsoleExpanded ? "Restore" : "Expand"}
                                >
                                    {isConsoleExpanded ? '⊟' : '⊞'}
                                </button>
                                <button 
                                    className="console-control-btn" 
                                    onClick={() => {
                                        if (isConsoleExpanded) {
                                            setIsConsoleExpanded(false);
                                        } else {
                                            setIsConsoleMinimized(!isConsoleMinimized);
                                        }
                                    }}
                                    title={isConsoleMinimized ? "Restore" : "Minimize"}
                                >
                                    {isConsoleMinimized ? '△' : '▽'}
                                </button>
                            </div>
                        </div>
                        <div className="console-content">
                            {activeConsoleTab === 'Result' ? (
                                <div className="console-output-area">
                                    {isRunning ? (
                                        <div className="run-loading">Running code...</div>
                                    ) : runResult ? (
                                        <div className="run-result">
                                            <div className={`run-status ${runResult.status === 'ACCEPTED' || runResult.status === 'EXECUTED' ? 'accepted' : runResult.status === 'WRONG_ANSWER' ? 'wrong' : 'error'}`}>
                                                {runResult.status === 'ACCEPTED' ? '✓ All Sample Test Cases Passed' : 
                                                 runResult.status === 'EXECUTED' ? '✓ Code Executed Successfully' :
                                                 runResult.status === 'WRONG_ANSWER' ? '✗ Wrong Answer' :
                                                 runResult.status === 'COMPILE_ERROR' ? '✗ Compilation Error' :
                                                 runResult.status === 'RUNTIME_ERROR' ? '✗ Runtime Error' :
                                                 runResult.status === 'TIME_LIMIT_EXCEEDED' ? '⏱ Time Limit Exceeded' :
                                                 `Status: ${runResult.status}`}
                                            </div>
                                            {runResult.executionTimeMs !== undefined && (
                                                <div className="run-time">Runtime: {runResult.executionTimeMs} ms</div>
                                            )}
                                            {runResult.testCasesPassed !== undefined && runResult.status !== 'EXECUTED' && (
                                                <div className="run-testcases">
                                                    Test Cases: {runResult.testCasesPassed} / {runResult.totalTestCases} passed
                                                </div>
                                            )}
                                            {runResult.compilerError && (
                                                <div className="run-error">
                                                    <pre>{runResult.compilerError}</pre>
                                                </div>
                                            )}
                                            {runResult.errorMessage && (
                                                <div className="run-error">
                                                    <pre>{runResult.errorMessage}</pre>
                                                </div>
                                            )}
                                            {runResult.testResults && runResult.testResults.length > 0 && (
                                                <div className="run-testcases-detail">
                                                    {runResult.testResults.map((test, idx) => {
                                                        const isCustomInput = test.expectedOutput === "(Custom Input - No Expected Output)";
                                                        return (
                                                            <div key={idx} className={`testcase-item ${test.passed ? 'passed' : 'failed'}`}>
                                                                <div className="testcase-header">
                                                                    {test.passed ? '✓' : '✗'} {isCustomInput ? 'Custom Input' : `Sample Test Case ${idx + 1}`}
                                                                </div>
                                                                <div className="testcase-details">
                                                                    {test.input && (
                                                                        <div className="testcase-row">
                                                                            <span className="label">Input:</span>
                                                                            <pre>{test.input}</pre>
                                                                        </div>
                                                                    )}
                                                                    {!isCustomInput && test.expectedOutput && (
                                                                        <div className="testcase-row">
                                                                            <span className="label">Expected:</span>
                                                                            <pre>{test.expectedOutput}</pre>
                                                                        </div>
                                                                    )}
                                                                    {test.actualOutput && (
                                                                        <div className="testcase-row">
                                                                            <span className="label">{isCustomInput ? 'Output:' : 'Actual:'}</span>
                                                                            <pre>{test.actualOutput}</pre>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="run-placeholder">
                                            Click "Run" to test your code.<br/>
                                            <span style={{fontSize: '0.85em', opacity: 0.7}}>
                                                Uses sample test cases, or your custom input if provided.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <textarea
                                    className="custom-input-textarea"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder={`Enter your custom test input here...\n\nExample for Two Sum:\n2 7 11 15\n9\n\n(First line: array elements space-separated)\n(Second line: target value)\n\nLeave empty to run with sample test cases.`}
                                    spellCheck="false"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
