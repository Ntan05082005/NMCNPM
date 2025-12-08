import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from "../../API/api-problemdetail.js"; // Import API đã tạo
import "./specified-problem.css"; 

// Import Icons
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";

export default function SpecifiedProblem() {
  const navigate = useNavigate();
  
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- GỌI API KHI COMPONENT MOUNT ---
  useEffect(() => {
    // Fetch list of problems from MockAPI resource '/problem'
    mockApi
      .get('/problem')
      .then((res) => {
        setProblems(res.data);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách bài tập:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  // --- XỬ LÝ CLICK ĐỂ CHUYỂN TRANG ---
  const handleProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  // --- LỌC BÀI TẬP THEO ĐỘ KHÓ ---
  // Lưu ý: Trên MockAPI bạn phải điền field difficulty là "Easy" hoặc "Medium"
  const easyProblems = problems.filter(p => (p.difficulty || '').toLowerCase() === 'easy');
  const mediumProblems = problems.filter(p => (p.difficulty || '').toLowerCase() === 'medium');

  return (
    <div className="specified-problem-page">
      <div className="dashboard-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo">
              <span className="logo-uni">Uni</span>Code
            </div>
            <nav className="nav-menu">
              <div className="nav-item"> <FiGrid className="nav-icon" /> Dashboard </div>
              <div className="nav-item active"> <FiFileText className="nav-icon" /> Problems </div>
              <div className="nav-item"> <FiSend className="nav-icon" /> Submission </div>
              <div className="nav-item"> <FiUser className="nav-icon" /> Profile </div>
            </nav>
          </div>
          <div className="sidebar-bottom">
            <div className="nav-item"> <FiSettings className="nav-icon" /> Settings </div>
            <div className="nav-item" onClick={handleLogout}> <FiLogOut className="nav-icon" /> Log Out </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          
          {/* HEADER */}
          <header className="header">
            <div className="welcome-text">
              <h1>Welcome User!</h1>
              <p>Here are your problems</p>
            </div>
            <div className="header-actions">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input type="text" placeholder="Search" />
              </div>
              <div className="user-controls">
                <div className="notification-icon">
                  <FiBell /> <span className="dot"></span>
                </div>
                <div className="user-avatar"> <FaUserCircle /> </div>
                <FiChevronDown style={{color: '#64748b'}} />
              </div>
            </div>
          </header>

          {/* PAGE TITLE */}
          <div className="page-header">
            <h2 className="page-title">Algorithm & Data Structure Problems</h2>
            <div className="sort-btn"> Sort By <FiChevronDown /> </div>
          </div>

          {/* PROBLEM COLUMNS */}
          <div className="problem-columns-container">
            
            {loading ? (
              <div style={{ padding: '20px', color: '#64748b' }}>Loading problems...</div>
            ) : (
              <>
                {/* CỘT EASY */}
                <div className="problem-column col-easy">
                  <div className="col-header">
                    <h3>Easy</h3>
                    <FiChevronDown className="header-icon" />
                  </div>
                  <ul className="problem-list">
                    {easyProblems.length > 0 ? (
                      easyProblems.map((prob) => (
                        <li 
                          key={prob.id} 
                          className="problem-item"
                          onClick={() => handleProblemClick(prob.id)}
                          style={{ cursor: 'pointer' }} // Thêm biểu tượng bàn tay khi hover
                        >
                          {prob.title}
                        </li>
                      ))
                    ) : (
                      <li className="problem-item" style={{color: '#999'}}>No easy problems found</li>
                    )}
                  </ul>
                </div>

                {/* CỘT MEDIUM */}
                <div className="problem-column col-medium">
                  <div className="col-header">
                    <h3>Medium</h3>
                    <FiChevronDown className="header-icon" />
                  </div>
                  <ul className="problem-list">
                    {mediumProblems.length > 0 ? (
                      mediumProblems.map((prob) => (
                        <li 
                          key={prob.id} 
                          className="problem-item"
                          onClick={() => handleProblemClick(prob.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {prob.title}
                        </li>
                      ))
                    ) : (
                       <li className="problem-item" style={{color: '#999'}}>No medium problems found</li>
                    )}
                  </ul>
                </div>
              </>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}