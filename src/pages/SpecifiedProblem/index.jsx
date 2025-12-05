import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./specified-problem.css"; 

// Import Icons
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { FaUserCircle } from "react-icons/fa";

export default function SpecifiedProblem() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const easyProblems = [
    "Create An Array",
    "Add a list of numbers",
    "Sum of two numbers",
    "Palindrome string",
    "Reverse integer"
  ];

  const mediumProblems = [
    "Count and Say",
    "Combination of Sum",
    "Multiply String",
    "Jump Game",
    "Rotate Image"
  ];

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
                {/* --- ĐÃ THÊM LẠI ICON KÍNH LÚP TẠI ĐÂY --- */}
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
            
            {/* CỘT EASY */}
            <div className="problem-column col-easy">
              <div className="col-header">
                <h3>Easy</h3>
                <FiChevronDown className="header-icon" />
              </div>
              <ul className="problem-list">
                {easyProblems.map((prob, index) => (
                  <li key={index} className="problem-item">{prob}</li>
                ))}
              </ul>
            </div>

            {/* CỘT MEDIUM */}
            <div className="problem-column col-medium">
              <div className="col-header">
                <h3>Medium</h3>
                <FiChevronDown className="header-icon" />
              </div>
              <ul className="problem-list">
                {mediumProblems.map((prob, index) => (
                  <li key={index} className="problem-item">{prob}</li>
                ))}
              </ul>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}