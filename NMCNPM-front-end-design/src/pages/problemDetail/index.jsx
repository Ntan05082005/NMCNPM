// src/pages/ProblemDetail/ProblemDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mockApi } from "../../API/api-problemdetail.js";
import "./problem-detail.css"; 
import { FiSearch, FiBell, FiChevronDown, FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    setLoading(true);
    setError("");

  
    mockApi
      .get(`/problem/${id}`)              
      .then((res) => {
        setProblem(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được dữ liệu bài tập.");
      })
      .finally(() => setLoading(false));
  }, [id]);


  if (loading) {
    return (
      <div className="problem-layout">
        <main className="problem-main">
          <div style={{ padding: "40px" }}>Loading...</div>
        </main>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="problem-layout">
        <main className="problem-main">
          <div style={{ padding: "40px" }}>
            <h2>{error || "Problem not found"}</h2>
            <Link to="/problems">← Back to Problems</Link>
          </div>
        </main>
      </div>
    );
  }

  const constraintLines = (problem.constraints || "").split("\n").filter(Boolean);

  return (
    <div className="problem-detail-page">
      <div className="dashboard-container">
      {/* ========== SIDEBAR ĐƠN GIẢN ========= */}
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

      {/* ========== MAIN ========= */}
      <main className="problem-main">
        {/* HEADER */}
        <header className="problem-header">
          <div className="problem-title-block">
            <h1 className="problem-title">{problem.title}</h1>

            <div className="chip-row">
              <span className="chip chip-medium">{problem.difficulty}</span>
              <span className="chip chip-unsolved">{problem.status}</span>
            </div>

            <div className="problem-meta">
              <span>Acceptance Rate: {problem.acceptance}</span>
              <span>•</span>
              <span>Total Attempts: {problem.attempts}</span>
              <span>•</span>
              <span>Solved by: {problem.solvedBy} users</span>
            </div>
          </div>

          <div className="header-right">
            <div className="search-box small">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search problems" />
            </div>

            <div className="user-controls">
              <div className="notification-icon">
                <FiBell /> <span className="dot"></span>
              </div>
              <div className="user-avatar"> <FaUserCircle /> </div>
              <FiChevronDown style={{ color: '#64748b' }} />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="problem-content">
          {problem.learningObjectives && (
            <section className="section-card">
              <h2 className="section-title green">Learning Objectives</h2>
              <ul className="objectives-list">
                {Array.isArray(problem.learningObjectives) ? (
                  problem.learningObjectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))
                ) : (
                  <li>{problem.learningObjectives}</li>
                )}
              </ul>
            </section>
          )}

          {/* Problem summary + examples */}
          <section className="section-card">
            <h2 className="section-title">Problem Summary</h2>
            <p className="summary-text">{problem.summary}</p>

            <div className="examples-grid">
              {/* Example 1 */}
              {problem.example1Input && (
                <div className="example-card">
                  <div className="example-header">EXAMPLE 1</div>
                  <div className="example-body">
                    <div className="example-row">
                      <span className="example-label">Input:</span>
                      <span className="example-value">
                        {problem.example1Input}
                      </span>
                    </div>
                    <div className="example-row">
                      <span className="example-label">Output:</span>
                      <span className="example-value">
                        {problem.example1Output}
                      </span>
                    </div>
                    <div className="example-explanation">
                      {problem.example1Explanation}
                    </div>
                  </div>
                </div>
              )}

              {/* Example 2 */}
              {problem.example2Input && (
                <div className="example-card">
                  <div className="example-header">EXAMPLE 2</div>
                  <div className="example-body">
                    <div className="example-row">
                      <span className="example-label">Input:</span>
                      <span className="example-value">
                        {problem.example2Input}
                      </span>
                    </div>
                    <div className="example-row">
                      <span className="example-label">Output:</span>
                      <span className="example-value">
                        {problem.example2Output}
                      </span>
                    </div>
                    <div className="example-explanation">
                      {problem.example2Explanation}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Constraints */}
            <div className="constraints">
              <h3>Constraints</h3>
              <ul>
                {constraintLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        {/* CODE NOW BUTTON */}
        <div className="code-now-wrapper">
          <button className="code-now-btn">CODE NOW</button>
        </div>
      </main>
      </div>
    </div>
  );
}


export { ProblemDetail };
export default ProblemDetail;
