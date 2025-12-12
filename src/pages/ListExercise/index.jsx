import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./list-exercise.css"; 

// Import Icons
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { FaUserCircle, FaLightbulb, FaCogs, FaDatabase } from "react-icons/fa"; // Dùng FaDatabase cho SQL đẹp hơn
import { TbBinaryTree } from "react-icons/tb";
import { VscDebugAlt } from "react-icons/vsc";

export default function ListExercise() {
  const navigate = useNavigate();

  // Dữ liệu các thẻ bài tập
  const problems = [
    {
      id: 'dsa',
      renderIcon: () => (
        <div className="icon-group-vertical icon-dsa">
          <TbBinaryTree size={75} strokeWidth={1.5} />
          <span className="logo-text-dsa">DSA</span>
        </div>
      ),
      title: 'Algorithm & Data Structure Problems',
      desc: 'Focus on logic, efficiency, time/space complexity'
    },
    {
      id: 'implementation',
      renderIcon: () => (
        <div className="icon-group-horizontal icon-impl">
           <FaLightbulb size={50} style={{marginRight: -10, zIndex: 1}} />
           <FaCogs size={40} style={{marginTop: 30}} />
        </div>
      ),
      title: 'Implementation / Simulation Problems',
      desc: 'Test your ability to translate requirements into code exactly as specified.'
    },
    {
      id: 'debugging',
      renderIcon: () => (
        <div className="icon-single icon-debug">
          <VscDebugAlt size={80} /> 
        </div>
      ),
      title: 'Debugging Questions',
      desc: "You're given broken code and must fix it."
    },
    {
      id: 'system-design',
      // --- CẬP NHẬT: Vẽ lại icon System Design bằng CSS để giống hình ---
      renderIcon: () => (
        <div className="icon-system-custom">
          <span className="brace">{'{'}</span>
          <div className="code-lines">
             {/* Các dòng kẻ màu mô phỏng code */}
             <div className="line line-orange w-60"></div>
             <div className="line line-black w-80"></div>
             <div className="line line-green w-50"></div>
             <div className="line line-blue w-70"></div>
             <div className="line line-black w-40"></div>
             <div className="line line-orange w-60"></div>
             <div className="line line-green w-50"></div>
          </div>
          <span className="brace">{'}'}</span>
        </div>
      ),
      title: 'System Design Questions',
      desc: 'For advanced practice: design scalable systems.'
    },
    {
      id: 'oop',
      renderIcon: () => (
        <div className="icon-banner icon-oop">
           <div className="oop-banner">
             <span>OOP</span>
             <span className="oop-sub">OBJECT<br/>ORIENTED<br/>PROGRAMMING</span>
           </div>
        </div>
      ),
      title: 'Object-Oriented Programming (OOP) & Design Patterns',
      desc: 'Create classes, relationships, abstractions, following good design.'
    },
    {
      id: 'sql',
      // --- CẬP NHẬT: Icon SQL hình trụ + Chữ SQL ---
      renderIcon: () => (
        <div className="icon-sql-custom">
          <FaDatabase size={55} className="db-icon" />
          <span className="db-text">SQL</span>
        </div>
      ),
      title: 'Database / SQL Coding Questions',
      desc: 'Write SQL queries or optimize them.'
    },
  ];

  const handleCardClick = (id) => {
    navigate(`/list/${id}`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="list-exercise-page">
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

          <div className="filter-section">
            <div className="filter-title">
              <span className="paperclip-icon">📎</span> All Tests
            </div>
            <div className="sort-btn"> Sort By <FiChevronDown /> </div>
          </div>

          <div className="problems-grid">
            {problems.map((item) => (
              <div key={item.id} className="problem-card" onClick={() => handleCardClick(item.id)}>
                <div className="card-visual-area">
                  {item.renderIcon()}
                </div>
                <div className="card-content-area">
                  <h3>{item.title}</h3>
                  <p className="card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}