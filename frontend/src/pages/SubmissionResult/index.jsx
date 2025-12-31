import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmissionResult.css';

const SubmissionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu từ trang trước truyền qua (nếu có), nếu không thì dùng dữ liệu giả định để giống hình ảnh
    const resultData = location.state || {
        status: "Compile Error",
        errorMessage: "Line 5: Char 5: Error: Non-Void Function Does Not Return A Value [-Werror,-Wreturn-Type]\n  5 |   }\n    |   ^\n1 Error Generated.",
        timeLimit: "54 Ms",
        memoryLimit: "12MB",
        testcasesPassed: "0 / 0"
    };

    return (
        <div className="result-page-container">
            {/* Header Logo */}
            <div className="result-header">
                <div className="unicode-logo" onClick={() => navigate('/')}>
                    UniCode
                </div>
            </div>

            <div className="result-content">
                <div className="testcase-status">
                    {resultData.testcasesPassed} Testcases Passed
                </div>

                {/* Khu vực hiển thị Lỗi hoặc Kết quả chính */}
                <div className="main-status-area">
                    <div className={`status-box ${
                        resultData.status === 'ACCEPTED' || resultData.status === 'Accepted' ? 'success-box' : 
                        resultData.status === 'Compile Error' || resultData.status.includes('ERROR') ? 'error-box' : 
                        'warning-box'
                    }`}>
                        <h3 className="status-title">{resultData.status}</h3>
                        <pre className="error-detail">
                            {resultData.errorMessage || resultData.message || 'All test cases passed!'}
                        </pre>
                        <div className="status-footer">
                            <span>Time Limit: {resultData.timeLimit}</span>
                            <span style={{marginLeft: '50px'}}>Memory {resultData.memoryLimit}</span>
                        </div>
                    </div>

                    {/* Điều hướng Next/Prev Test */}
                    <div className="test-navigation">
                        <button className="nav-btn">Previous Test &lt;</button>
                        <button className="nav-btn">&gt; Next Test</button>
                    </div>
                </div>

                {/* Nút View History */}
                <button className="view-history-btn">View History</button>

                {/* Bảng Lịch sử Nộp bài */}
                <div className="history-container">
                    <h2 className="history-title">Submission History</h2>
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Language</th>
                                <th>Runtime</th>
                                <th>Memory</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={
                                    resultData.status === 'ACCEPTED' || resultData.status === 'Accepted' ? 'status-cell-success' : 
                                    'status-cell-error'
                                }>{resultData.status}</td>
                                <td>{resultData.language || 'C++'}</td>
                                <td>{resultData.timeLimit}</td>
                                <td>{resultData.memoryLimit}</td>
                            </tr>
                            {/* Bạn có thể map thêm dữ liệu lịch sử ở đây */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionResult;
