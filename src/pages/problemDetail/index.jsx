// src/pages/ProblemDetail/ProblemDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockApi } from "../../API/api-problemdetail.js";
import "./problem-detail.css"; 

function ProblemDetail() {
  const id = 2  ;         
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="problem-layout">
      {/* ========== SIDEBAR ĐƠN GIẢN ========= */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">Uni</span>
          <span className="logo-text">Code</span>
        </div>

        <nav className="sidebar-menu">
          <Link to="/" className="menu-item active">
            <span className="menu-icon">🏠</span>
            <span className="menu-label">Dashboard</span>
          </Link>
          <Link to="/problems" className="menu-item">
            <span className="menu-icon">📑</span>
            <span className="menu-label">Problems</span>
          </Link>
          <button className="menu-item">
            <span className="menu-icon">📤</span>
            <span className="menu-label">Submission</span>
          </button>
          <button className="menu-item">
            <span className="menu-icon">👤</span>
            <span className="menu-label">Profile</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item">
            <span className="menu-icon">⚙️</span>
            <span className="menu-label">Settings</span>
          </button>
          <button className="menu-item">
            <span className="menu-icon">🔒</span>
            <span className="menu-label">Log Out</span>
          </button>
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

          <div className="problem-header-right">
            <button className="circle-btn bell">🔔</button>
            <button className="circle-btn avatar" />
            <button className="triangle-btn">▼</button>
          </div>
        </header>

        {/* CONTENT */}
        <section className="problem-content">
          {/* Learning Objectives – tạm fix cứng, sau này muốn thì thêm field trong MockAPI */}
          <section className="section-card">
            <h2 className="section-title green">Learning Objectives</h2>
            <ul className="objectives-list">
              <li>Implementing classical algorithms.</li>
              <li>Understanding problem-solving patterns.</li>
              <li>Improving code quality and readability.</li>
            </ul>
          </section>

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
  );
}


export { ProblemDetail };
export default ProblemDetail;
