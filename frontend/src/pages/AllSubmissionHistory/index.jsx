import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubmissionHistory.css";

/**
 * MOCK API:
 * - Nếu bạn call /user-stats  => trả mảng: [ {...}, {...} ]
 * - Nếu bạn call /user-stats/3 => trả object: { ... }
 *
 * ✅ Khuyên dùng (dễ nhất):
 * - Dùng /user-stats (list) và filter theo userId trong FE
 */
const MOCK_API_LIST_URL = "https://6947b877ca6715d122fae528.mockapi.io/submission"; // <-- đổi link của bạn

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

export default function SubmissionHistory({ userId }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(MOCK_API_LIST_URL);
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

        const data = JSON.parse(text);

        // ✅ data có thể là object hoặc array
        let picked = null;

        if (Array.isArray(data)) {
          // nếu userId có => find đúng user
          if (userId != null) {
            picked =
              data.find((x) => String(x.userId) === String(userId)) ||
              data.find((x) => String(x.id) === String(userId));
          }
          // nếu vẫn chưa có => lấy phần tử đầu (để khỏi Missing userId)
          if (!picked) picked = data[0] || null;
        } else {
          // object
          picked = data;
        }

        if (!picked) throw new Error("No mock data found (user-stats is empty).");

        if (!ignore) setStats(picked);
      } catch (e) {
        if (!ignore) setErr(`Không tải được dữ liệu MockAPI. ${e.message}`);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => (ignore = true);
  }, [userId]);

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
    return {
      username: stats.username,
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

  if (loading) return <div className="sh-container">Loading...</div>;
  if (err) return <div className="sh-container sh-error">{err}</div>;

  return (
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
          <div className="sh-card">
            <div className="sh-card-label">Total submissions</div>
            <div className="sh-card-value">{summary.totalSubmissions}</div>
          </div>
          <div className="sh-card">
            <div className="sh-card-label">Acceptance rate</div>
            <div className="sh-card-value">{Number(summary.acceptanceRate).toFixed(1)}%</div>
          </div>
          <div className="sh-card">
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
                  <td>{s.difficulty || "-"}</td>
                  <td>
                    <span className={statusBadgeClass(s.status)}>{normalizeStatus(s.status)}</span>
                  </td>
                  <td>{s.language || "-"}</td>
                  <td>{s.executionTimeMs ?? "-"}</td>
                  <td>{s.memoryUsedKb ? `${s.memoryUsedKb} KB` : "-"}</td>
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
  );
}
