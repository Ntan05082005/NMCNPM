import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmissionResult.css';
import { formatLanguage, formatStatus } from '../../utils/format';

const SubmissionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ trang trước truyền qua (nếu có), nếu không thì dùng dữ liệu mặc định
    const resultData = location.state || {
        status: "NO_DATA",
        errorMessage: "No submission data found. Please submit your code again.",
        timeLimit: "0 ms",
        memoryLimit: "N/A",
        testcasesPassed: "0 / 0",
        language: "N/A",
        problemTitle: "Unknown Problem",
        problemSlug: null
    };

    // Helper function to determine status styling
    const getStatusClass = (status) => {
        const upperStatus = status?.toUpperCase() || '';
        if (upperStatus === 'ACCEPTED') return 'success-box';
        if (upperStatus.includes('ERROR') || upperStatus === 'COMPILE_ERROR') return 'error-box';
        if (upperStatus === 'WRONG_ANSWER') return 'warning-box';
        if (upperStatus === 'TIME_LIMIT_EXCEEDED') return 'warning-box';
        if (upperStatus === 'MEMORY_LIMIT_EXCEEDED') return 'warning-box';
        return 'error-box';
    };

    // Get display message
    const getDisplayMessage = () => {
        if (resultData.status === 'ACCEPTED') {
            return resultData.message || 'All test cases passed! 🎉';
        }

        // Priority: compilerError > stderr > errorMessage > message
        if (resultData.compilerError) {
            return resultData.compilerError;
        }
        if (resultData.stderr && resultData.stderr.trim()) {
            return resultData.stderr;
        }
        return resultData.errorMessage || resultData.message || 'Check your solution and try again.';
    };

    return (
        <div className="result-page-container">
            {/* Header Logo */}
            <div className="result-header">
                <div className="unicode-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
                    UniCode
                </div>
                {resultData.problemTitle && (
                    <h2 style={{ marginLeft: '20px', color: '#333' }}>
                        {resultData.problemTitle}
                    </h2>
                )}
            </div>

            <div className="result-content">
                <div className="testcase-status">
                    {resultData.testcasesPassed} Testcases Passed
                </div>

                {/* Khu vực hiển thị Lỗi hoặc Kết quả chính */}
                <div className="main-status-area">
                    <div className={`status-box ${getStatusClass(resultData.status)}`}>
                        <h3 className="status-title">{formatStatus(resultData.status)}</h3>
                        <pre className="error-detail">
                            {getDisplayMessage()}
                        </pre>
                        <div className="status-footer">
                            <span>Runtime: {resultData.timeLimit}</span>
                            <span style={{ marginLeft: '50px' }}>Memory: {resultData.memoryLimit}</span>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="test-navigation">
                        {resultData.problemSlug && (
                            <button
                                className="nav-btn"
                                onClick={() => navigate(`/interface-code/${resultData.problemSlug}`)}
                            >
                                ← Back to Problem
                            </button>
                        )}
                        <button
                            className="nav-btn"
                            onClick={() => navigate('/profile/submissions', {
                                state: { fromSubmit: true, timestamp: Date.now() }
                            })}
                        >
                            View All Submissions →
                        </button>
                    </div>
                </div>

                {/* Nút hành động */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {resultData.problemSlug && (
                        <button
                            className="view-history-btn"
                            onClick={() => navigate(`/interface-code/${resultData.problemSlug}`)}
                        >
                            Try Again
                        </button>
                    )}
                    <button
                        className="view-history-btn"
                        onClick={() => navigate('/profile/submissions', {
                            state: { fromSubmit: true, timestamp: Date.now() }
                        })}
                    >
                        View Full History
                    </button>
                    <button
                        className="view-history-btn"
                        onClick={() => navigate('/problems')}
                    >
                        Browse Problems
                    </button>
                </div>

                {/* Bảng thông tin submission hiện tại */}
                <div className="history-container">
                    <h2 className="history-title">Current Submission</h2>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Language</th>
                                <th>Runtime</th>
                                <th>Memory (KB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={
                                    resultData.status === 'ACCEPTED' ? 'status-cell-success' :
                                        'status-cell-error'
                                }>{formatStatus(resultData.status)}</td>
                                <td>{formatLanguage(resultData.language)}</td>
                                <td>{resultData.timeLimit}</td>
                                <td>{resultData.memoryLimit}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default SubmissionResult;
