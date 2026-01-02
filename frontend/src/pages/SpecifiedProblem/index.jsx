import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProblems } from "../../API/api-problemdetail.js";
import "./specified-problem.css";

import {
  FiGrid,
  FiFileText,
  FiSend,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function SpecifiedProblem() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("");

  // lọc theo độ khó (Sort By = filter difficulty)
  const [difficultyFilter, setDifficultyFilter] = useState("ALL"); // ALL | EASY | MEDIUM | HARD
  const [sortOpen, setSortOpen] = useState(false);

  const categoryConfig = {
    dsa: { tag: "algorithm-data-structure", title: "Algorithm & Data Structure Problems" },
    implementation: { tag: "implementation", title: "Implementation / Simulation Problems" },
    debugging: { tag: "debugging", title: "Debugging Questions" },
    "system-design": { tag: "system-design", title: "System Design Questions" },
    oop: { tag: "oop", title: "Object-Oriented Programming (OOP) & Design Patterns" },
    sql: { tag: "database", title: "Database / SQL Coding Questions" },
  };

  const currentCategory =
    categoryConfig[categoryId] || {
      tag: "algorithm-data-structure",
      title: "Algorithm & Data Structure Problems",
    };

  useEffect(() => {
    setLoading(true);
    setDifficultyFilter("ALL"); // đổi category thì reset filter cho đỡ “kẹt”
    setSearchTerm(""); // ✅ reset search khi đổi category

    getAllProblems({
      page: 0,
      size: 100,
      tags: [currentCategory.tag],
    })
      .then((res) => {
        setProblems(res.data.content || []);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách bài tập:", err);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleProblemClick = (slug) => {
    navigate(`/problem/${slug}`);
  };

  const normalized = useMemo(() => {
    return problems.map((p) => ({
      ...p,
      difficultyNorm: (p.difficulty || "UNKNOWN").toUpperCase(),
    }));
  }, [problems]);

  // ✅ filtered = difficultyFilter + searchTerm
  const filteredProblems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return normalized.filter((p) => {
      // 1) lọc theo difficulty (Sort By)
      if (difficultyFilter !== "ALL" && p.difficultyNorm !== difficultyFilter) return false;

      // 2) lọc theo search (title / slug / difficulty)
      if (!q) return true;

      const title = (p.title || "").toLowerCase();
      const slug = (p.slug || "").toLowerCase();
      const diff = (p.difficultyNorm || "").toLowerCase(); // easy/medium/hard

      return title.includes(q) || slug.includes(q) || diff.includes(q);
    });
  }, [normalized, difficultyFilter, searchTerm]);

  const difficultyLabel = (d) => {
    const up = (d || "").toUpperCase();
    if (up === "EASY") return "Easy";
    if (up === "MEDIUM") return "Medium";
    if (up === "HARD") return "Hard";
    return "Unknown";
  };

  const sortLabel =
    difficultyFilter === "ALL" ? "All difficulties" : `Difficulty: ${difficultyLabel(difficultyFilter)}`;

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
              <div className="nav-item" onClick={() => navigate("/dashboard")}>
                <FiGrid className="nav-icon" /> Dashboard
              </div>
              <div className="nav-item active">
                <FiFileText className="nav-icon" /> Problems
              </div>
              <div className="nav-item" onClick={() => navigate("/profile/submissions")}>
                <FiSend className="nav-icon" /> Submissions
              </div>
              <div className="nav-item" onClick={() => navigate("/profile")}>
                <FiUser className="nav-icon" /> Profile
              </div>
            </nav>
          </div>
          <div className="sidebar-bottom">
            <div className="nav-item" onClick={() => navigate("/settings")}>
              <FiSettings className="nav-icon" /> Settings
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <FiLogOut className="nav-icon" /> Log Out
            </div>
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
                {/* ✅ SEARCH INPUT */}
                <input
                  type="text"
                  placeholder="Search by title / slug / difficulty (easy, medium...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="user-controls">
                <div className="notification-icon">
                  <FiBell /> <span className="dot"></span>
                </div>
                <div className="user-avatar">
                  <FaUserCircle />
                </div>
                <FiChevronDown style={{ color: "#64748b" }} />
              </div>
            </div>
          </header>

          {/* PAGE TITLE + SORT */}
          <div className="page-header">
            <h2 className="page-title">{currentCategory.title}</h2>

            {/* Sort By (lọc difficulty) */}
            <div className="sort-wrapper">
              <button
                className="sort-btn"
                onClick={() => setSortOpen((v) => !v)}
                type="button"
              >
                Sort By: {sortLabel} <FiChevronDown />
              </button>

              {sortOpen && (
                <div className="sort-dropdown">
                  {[
                    { key: "ALL", label: "All difficulties" },
                    { key: "EASY", label: "Easy" },
                    { key: "MEDIUM", label: "Medium" },
                    { key: "HARD", label: "Hard" },
                  ].map((opt) => (
                    <div
                      key={opt.key}
                      className={`sort-item ${difficultyFilter === opt.key ? "active" : ""}`}
                      onClick={() => {
                        setDifficultyFilter(opt.key);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SINGLE LIST CONTAINER */}
          <div className="problem-single-container">
            {loading ? (
              <div style={{ padding: "20px", color: "#64748b" }}>Loading problems...</div>
            ) : (
              <>
                <div className="problem-single-header">
                  <div className="ph-title">Problem</div>
                  <div className="ph-diff"></div>
                </div>

                <ul className="problem-single-list">
                  {filteredProblems.length > 0 ? (
                    filteredProblems.map((prob) => (
                      <li
                        key={prob.id}
                        className="problem-row"
                        onClick={() => handleProblemClick(prob.slug)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="pr-title">{prob.title}</div>
                        <div className="pr-diff">
                          <span className={`difficulty-badge diff-${prob.difficultyNorm.toLowerCase()}`}>
                            {difficultyLabel(prob.difficultyNorm)}
                          </span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="problem-row empty" style={{ color: "#999", cursor: "default" }}>
                      No problems found
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
