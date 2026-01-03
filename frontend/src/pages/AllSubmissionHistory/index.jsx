import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SubmissionHistory.css";
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { getUserSubmissions } from "../../API/api-submission";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "WRONG_ANSWER", label: "Wrong Answer" },
  { key: "RUNTIME_ERROR", label: "Runtime Error" },
  { key: "COMPILE_ERROR", label: "Compile Error" },
  { key: "TIME_LIMIT_EXCEEDED", label: "TLE" },
];

function normalizeStatus(s) {
  return String(s || "").trim().replaceAll(" ", "_").toUpperCase();
}

function statusBadgeClass(status) {
  const st = normalizeStatus(status);
  if (st === "ACCEPTED") return "badge badge-accepted";
  if (st === "WRONG_ANSWER") return "badge badge-wa";
  if (st === "RUNTIME_ERROR") return "badge badge-re";
  if (st === "COMPILE_ERROR") return "badge badge-ce";
  if (st === "TIME_LIMIT_EXCEEDED") return "badge badge-tle";
  return "badge";
}

function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

// Helper function to process submissions into stats
function processSubmissions(submissions, userId) {
  const acceptedSubmissions = [];
  const wrongAnswerSubmissions = [];
  const runtimeErrorSubmissions = [];
  const compilationErrorSubmissions = [];
  const timeLimitExceededSubmissions = [];
  
  const solvedProblems = new Set();
  
  submissions.forEach(sub => {
    const status = normalizeStatus(sub.status);
    
    // Map submission to display format
    const mappedSub = {
      id: sub.id,
      problemTitle: sub.problem?.title || "Unknown Problem",
      problemId: sub.problem?.id,
      problemSlug: sub.problem?.slug || "",
      difficulty: sub.problem?.difficulty || "-",
      status: sub.status,
      language: sub.language,
      executionTimeMs: sub.executionTimeMs,
      memoryUsedKb: sub.memoryUsedKb || null,
      submittedAt: sub.submittedAt || sub.createdAt
    };
    
    // Categorize by status
    if (status === "ACCEPTED") {
      acceptedSubmissions.push(mappedSub);
      solvedProblems.add(sub.problem?.id);
    } else if (status === "WRONG_ANSWER") {
      wrongAnswerSubmissions.push(mappedSub);
    } else if (status === "RUNTIME_ERROR") {
      runtimeErrorSubmissions.push(mappedSub);
    } else if (status === "COMPILATION_ERROR" || status === "COMPILE_ERROR") {
      compilationErrorSubmissions.push(mappedSub);
    } else if (status === "TIME_LIMIT_EXCEEDED") {
      timeLimitExceededSubmissions.push(mappedSub);
    }
  });
  
  const totalSubmissions = submissions.length;
  const acceptedCount = acceptedSubmissions.length;
  const acceptanceRate = totalSubmissions > 0 ? (acceptedCount / totalSubmissions * 100).toFixed(1) : 0;
  
  return {
    userId,
    username: localStorage.getItem("username") || "Guest",
    totalSubmissions,
    acceptanceRate,
    totalProblemsSolved: solvedProblems.size,
    totalProblemsAttempted: new Set(submissions.map(s => s.problem?.id).filter(Boolean)).size,
    acceptedCount: acceptedSubmissions.length,
    wrongAnswerCount: wrongAnswerSubmissions.length,
    runtimeErrorCount: runtimeErrorSubmissions.length,
    compilationErrorCount: compilationErrorSubmissions.length,
    timeLimitExceededCount: timeLimitExceededSubmissions.length,
    acceptedSubmissions,
    wrongAnswerSubmissions,
    runtimeErrorSubmissions,
    compilationErrorSubmissions,
    timeLimitExceededSubmissions
  };
}

export default function SubmissionHistory({ userId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  
  // Track current username to detect user changes
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("username"));
  
  // Track refresh trigger from location state
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // If coming from submission, trigger refresh
    if (location.state?.fromSubmit) {
      setRefreshKey(prev => prev + 1);
    }
  }, [location.state]);

  useEffect(() => {
    let ignore = false;
    
    // Check if user has changed
    const username = localStorage.getItem("username");
    if (username !== currentUser) {
      // User changed, reset everything
      setStats(null);
      setTab("ALL");
      setSearch("");
      setCurrentUser(username);
    }

    async function load() {
      setLoading(true);
      setErr("");

      try {
        // Get user ID from localStorage or props
        const storedUserId = localStorage.getItem("user_id");
        const actualUserId = userId || storedUserId;
        
        if (!actualUserId) {
          throw new Error("User ID not found. Please login again.");
        }

        // Fetch real submissions from backend
        const response = await getUserSubmissions(actualUserId);
        const submissions = response.data || [];
        
        // Process submissions into stats
        const processedStats = processSubmissions(submissions, actualUserId);
        
        if (!ignore) setStats(processedStats);
      } catch (e) {
        console.error("Error loading submission history:", e);
        if (!ignore) {
          setErr(e.message || "Failed to load submission history");
          // Show empty state on error
          const emptyStats = {
            userId: userId || 1,
            username: localStorage.getItem("username") || "Guest",
            totalSubmissions: 0,
            acceptanceRate: 0,
            totalProblemsSolved: 0,
            totalProblemsAttempted: 0,
            acceptedCount: 0,
            wrongAnswerCount: 0,
            runtimeErrorCount: 0,
            compilationErrorCount: 0,
            timeLimitExceededCount: 0,
            acceptedSubmissions: [],
            wrongAnswerSubmissions: [],
            runtimeErrorSubmissions: [],
            compilationErrorSubmissions: [],
            timeLimitExceededSubmissions: []
          };
          setStats(emptyStats);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => (ignore = true);
  }, [userId, currentUser, refreshKey]);

  const allRows = useMemo(() => {
    if (!stats) return [];
    const accepted = stats.acceptedSubmissions || [];
    const wa = stats.wrongAnswerSubmissions || [];
    const re = stats.runtimeErrorSubmissions || [];
    const ce = stats.compilationErrorSubmissions || [];
    const tle = stats.timeLimitExceededSubmissions || [];

    return [...accepted, ...wa, ...re, ...ce, ...tle].sort((a, b) => {
      const ta = new Date(a.submittedAt || 0).getTime();
      const tb = new Date(b.submittedAt || 0).getTime();
      return tb - ta;
    });
  }, [stats]);

  const rowsByTab = useMemo(() => {
    if (!stats) return [];
    switch (tab) {
      case "ACCEPTED":
        return stats.acceptedSubmissions || [];
      case "WRONG_ANSWER":
        return stats.wrongAnswerSubmissions || [];
      case "RUNTIME_ERROR":
        return stats.runtimeErrorSubmissions || [];
      case "COMPILE_ERROR":
        return stats.compilationErrorSubmissions || [];
      case "TIME_LIMIT_EXCEEDED":
        return stats.timeLimitExceededSubmissions || [];
      default:
        return allRows;
    }
  }, [stats, tab, allRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rowsByTab;

    return rowsByTab.filter((s) => {
      const title = (s.problemTitle || "").toLowerCase();
      const slug = (s.problemSlug || "").toLowerCase();
      const lang = (s.language || "").toLowerCase();
      const st = normalizeStatus(s.status).toLowerCase();
      return title.includes(q) || slug.includes(q) || lang.includes(q) || st.includes(q);
    });
  }, [rowsByTab, search]);

  const summary = useMemo(() => {
    if (!stats) return null;
    // Get username from localStorage (current logged in user)
    const currentUsername = localStorage.getItem("username") || stats.username || "Guest";
    return {
      username: currentUsername,
      totalSubmissions: stats.totalSubmissions ?? 0,
      acceptanceRate: stats.acceptanceRate ?? 0,
      solved: stats.totalProblemsSolved ?? 0,
      attempted: stats.totalProblemsAttempted ?? 0,
      acceptedCount: stats.acceptedCount ?? 0,
      wrongAnswerCount: stats.wrongAnswerCount ?? 0,
      runtimeErrorCount: stats.runtimeErrorCount ?? 0,
      compilationErrorCount: stats.compilationErrorCount ?? 0,
      tleCount: stats.timeLimitExceededCount ?? 0,
    };
  }, [stats]);

  const onOpenProblem = (slug, problemId) => {
    if (slug) navigate(`/problems/${slug}`);
    else navigate(`/problems/${problemId}`);
  };

  const onOpenSubmission = (id) => {
    navigate(`/submissions/${id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="sh-container">Loading submission history...</div>;
  
  // Don't show error if we have empty stats - just show the page with empty data
  // if (err && !stats) return <div className="sh-container sh-error">{err}</div>;

  return (
    <div className="sh-page">
      <div className="sh-dashboard-container">
        {/* SIDEBAR */}
        <aside className="sh-sidebar">
          <div className="sh-sidebar-top">
            <div className="sh-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
              <span className="sh-logo-uni">Uni</span>Code
            </div>
            <nav className="sh-nav-menu">
              <div className="sh-nav-item" onClick={() => navigate('/dashboard')}> 
                <FiGrid className="sh-nav-icon" /> Dashboard 
              </div>
              <div className="sh-nav-item" onClick={() => navigate('/problems')}> 
                <FiFileText className="sh-nav-icon" /> Problems 
              </div>
              <div className="sh-nav-item active"> 
                <FiSend className="sh-nav-icon" /> Submissions 
              </div>
              <div className="sh-nav-item" onClick={() => navigate('/profile')}>
                <FiUser className="sh-nav-icon" /> Profile 
              </div>
            </nav>
          </div>
          <div className="sh-sidebar-bottom">
            <div className="sh-nav-item" onClick={() => navigate('/settings')}>
              <FiSettings className="sh-nav-icon" /> Settings 
            </div>
            <div className="sh-nav-item" onClick={handleLogout}> 
              <FiLogOut className="sh-nav-icon" /> Log Out 
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="sh-container">
      <div className="sh-header">
        <div>
          <h2 className="sh-title">Submission History</h2>
          <div className="sh-subtitle">
            User: <b>{summary?.username ?? "-"}</b>
          </div>
        </div>

        <input
          className="sh-search"
          placeholder="Search by problem / slug / status / language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {summary && (
      <div className="sh-cards">
        {/* 🔵 Total submissions */}
        <div className="sh-card card-total">
          <div className="sh-card-label">Total submissions</div>
          <div className="sh-card-value">{summary.totalSubmissions}</div>
        </div>

        {/* 🟢 Acceptance rate */}
        <div className="sh-card card-acceptance">
          <div className="sh-card-label">Acceptance rate</div>
          <div className="sh-card-value">
            {Number(summary.acceptanceRate).toFixed(1)}%
          </div>
        </div>

        {/* 🟣 Solved / Attempted */}
        <div className="sh-card card-progress">
          <div className="sh-card-label">Solved / Attempted</div>
          <div className="sh-card-value">
            {summary.solved} / {summary.attempted}
          </div>
        </div>
      </div>
      )}

      <div className="sh-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`sh-tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {summary && t.key !== "ALL" && (
              <span className="sh-count">
                {t.key === "ACCEPTED" && summary.acceptedCount}
                {t.key === "WRONG_ANSWER" && summary.wrongAnswerCount}
                {t.key === "RUNTIME_ERROR" && summary.runtimeErrorCount}
                {t.key === "COMPILE_ERROR" && summary.compilationErrorCount}
                {t.key === "TIME_LIMIT_EXCEEDED" && summary.tleCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="sh-table-wrap">
        <table className="sh-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Language</th>
              <th>Runtime (ms)</th>
              <th>Memory</th>
              <th>Submitted</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="sh-empty">
                  No submissions found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <button
                      className="sh-link"
                      onClick={() => onOpenProblem(s.problemSlug, s.problemId)}
                      title={s.problemSlug || ""}
                    >
                      {s.problemTitle || `Problem #${s.problemId}`}
                    </button>
                  </td>
                  <td>
                    <span className={`difficulty-badge difficulty-${(s.difficulty || '').toLowerCase()}`}>
                      {s.difficulty || "-"}
                    </span>
                  </td>
                  <td>
                    <span className={statusBadgeClass(s.status)}>{normalizeStatus(s.status)}</span>
                  </td>
                  <td>{s.language || "-"}</td>
                  <td>{s.executionTimeMs != null ? s.executionTimeMs : "-"}</td>
                  <td>{s.memoryUsedKb != null ? `${s.memoryUsedKb} KB` : "-"}</td>
                  <td>{formatDateTime(s.submittedAt)}</td>
                  <td>
                    <button className="sh-btn" onClick={() => onOpenSubmission(s.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
      </div>
    </div>
  );
}
