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
            <div className="code-header">
                <select className="language-select" value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
                    {availableLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
                <span className="icon">⚙️</span>
            </div>
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
    const [activeConsoleTab, setActiveConsoleTab] = useState('Custom');
    const [customInput, setCustomInput] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("C++");

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
        if (!problem || isSubmitting) return;
        setIsSubmitting(true);
        setSubmissionResult(null);
        try {
            const response = await runCode({
                problemId: problem.id,
                language: selectedLanguage.toLowerCase(),
                code: currentCode
            });
            setSubmissionResult(response.data);
        } catch (error) {
            alert("Lỗi kết nối hoặc chưa đăng nhập.");
        } finally {
            setIsSubmitting(false);
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
            // Get error details - prefer compilerError for compilation errors, then stderr, then errorMessage
            const errorDetails = response.data.compilerError ||
                response.data.stderr ||
                response.data.errorMessage ||
                "No error details provided.";
            // Thêm `${slug}` vào đường dẫn để khớp với Route "/submission-result/:slug"
            navigate(`/submission-result/${slug}`, {
                state: {
                    status: response.data.status || "Compile Error",
                    errorMessage: errorDetails,
                    timeLimit: response.data.executionTimeMs ? `${response.data.executionTimeMs} ms` : "N/A",
                    memoryLimit: response.data.memoryUsed ? `${response.data.memoryUsed} MB` : "N/A",
                    testcasesPassed: response.data.testCasesPassed ? `${response.data.testCasesPassed} / ${response.data.totalTestCases}` : "0 / 0"
                }
            });

        } catch (error) {
            console.error(error);
            // Cũng phải thêm slug vào đây
            navigate(`/submission-result/${slug}`, {
                state: {
                    status: "Compile Error",
                    errorMessage: "Line 5: Char 5: Error: Non-Void Function Does Not Return A Value [-Werror,-Wreturn-Type]\n  5 |   }\n    |   ^\n1 Error Generated.",
                    timeLimit: "54 Ms",
                    memoryLimit: "12MB",
                    testcasesPassed: "0 / 0"
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="loading-state">Đang tải chi tiết bài tập...</div>;
    if (!problem) return <div className="error-state">Không tìm thấy bài tập.</div>;

    const categoryWords = problem.category ? problem.category.split(' ') : ["Problem"];
    const titleWords = problem.title ? problem.title.split(' ') : ["Title"];

    return (
        <div className="interface-code-wrapper full-interface-container">
            <header className="interface-header">
                <div className="logo-box">UniCode</div>
                <div className="header-right-controls">
                    <div className="timer-controls">
                        <span className="icon">⏱️</span>
                        <span className="timer-display">{formatElapsedTime(timeElapsed)}</span>
                    </div>
                </div>
            </header>

            <div className="problem-container">
                <div className="sidebar">
                    <div style={{ marginTop: '50px' }}>
                        {categoryWords.map((word, index) => (
                            <h2 key={`cat-${index}`} className="sidebar-list-title">{word}</h2>
                        ))}
                        <hr className="sidebar-divider" />
                        {titleWords.map((word, index) => (
                            <h2 key={`title-${index}`} className="sidebar-problem-title">{word}</h2>
                        ))}
                    </div>
                </div>

                <main className="main-content">
                    <div className="problem-description">
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

                    <div className="code-editor-and-console">
                        <div className="code-area">
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
                            <div className="button-container run-button-wrapper">
                                <button className="run-button" onClick={handleRunCode} disabled={isSubmitting}>
                                    {isSubmitting ? 'Running...' : 'Run'}
                                </button>
                            </div>
                        </div>

                        <div className="console-area-wrapper">
                            <div className="console-area">
                                <div className="console-header">Console</div>
                                <div className="console-tabs">
                                    <div className={`console-tab ${activeConsoleTab === 'Sample' ? 'active' : ''}`} onClick={() => setActiveConsoleTab('Sample')}>Sample</div>
                                    <div className={`console-tab ${activeConsoleTab === 'Custom' ? 'active' : ''}`} onClick={() => setActiveConsoleTab('Custom')}>Custom</div>
                                </div>
                                <div className="console-content-display">
                                    {activeConsoleTab === 'Sample' ? (
                                        <div className="console-output-area">
                                            {submissionResult ? "Xem chi tiết kết quả ở trên status." : "Chạy code để xem kết quả mẫu."}
                                        </div>
                                    ) : (
                                        <textarea
                                            className="custom-input-textarea"
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Nhập input test case (VD: 5 10...)"
                                            spellCheck="false"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="button-container submit-button-wrapper">
                        {/* NÚT SUBMIT ĐÃ ĐƯỢC GẮN HÀM XỬ LÝ CHUYỂN TRANG */}
                        <button className="submit-button" onClick={handleSubmitCode} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
