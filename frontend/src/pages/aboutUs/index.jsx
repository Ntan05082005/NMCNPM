import React from "react";

const FEATURES = [
  { title: "Problem Library", desc: "Browse problems by topic and difficulty", icon: "🧩" },
  { title: "Code Editor", desc: "Write and test code in browser", icon: "💻" },
  { title: "Instant Judging", desc: "Get immediate feedback", icon: "⚡" },
  { title: "Progress Tracking", desc: "Monitor your improvement", icon: "📈" },
];

const TEAM = [
  { name: "Nguyen Tuan An", role: "Project Manager" },
  { name: "Tran Tho", role: "Backend Developer" },
  { name: "Tran Thi Xuan Tai", role: "Frontend Developer" },
  { name: "Do Thi Hoai Thuong", role: "Frontend Developer" },
  { name: "Dinh Ngoc Anh Duong", role: "QA Tester" },
];

const TECH = ["React", "Spring Boot", "PostgreSQL", "Redis", "Docker"];

function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function AboutUsPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "white" }}>
      {/* Navbar */}
      <header style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 60px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        zIndex: 10
      }}>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "#0d47a1", letterSpacing: "-0.5px" }}>
          UniCode
        </div>

        <nav style={{ display: "flex", alignItems: "center", marginLeft: "auto", gap: "50px" }}>
          <a href="/problems" style={{ 
            textDecoration: "none", 
            color: "#666", 
            fontSize: "15px", 
            fontWeight: 500
          }}>
            Practice
          </a>
          <a href="/about" style={{ 
            textDecoration: "none", 
            color: "#0084ff", 
            fontSize: "15px", 
            fontWeight: 600 
          }}>
            About Us
          </a>
          <a href="/login" style={{ 
            textDecoration: "none", 
            color: "#666", 
            fontSize: "15px", 
            fontWeight: 500
          }}>
            Login
          </a>
        </nav>

        <a href="/signup" style={{ textDecoration: "none", marginLeft: "15px" }}>
          <button style={{
            background: "#2b84ff",
            color: "white",
            border: "none",
            padding: "12px 35px",
            borderRadius: "30px",
            fontWeight: 500,
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(43, 132, 255, 0.25)"
          }}>
            Sign Up
          </button>
        </a>
      </header>

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #dae7ff 100%)",
        padding: "80px 60px",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "inline-block",
            background: "white",
            padding: "12px 28px",
            borderRadius: "28px",
            fontSize: "15px",
            fontWeight: 700,
            color: "#0084ff",
            marginBottom: "30px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
          }}>
            🚀 About UniCode
          </div>

          <h1 style={{
            fontSize: "56px",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "#111",
            marginBottom: "20px"
          }}>
            Practice Coding,
            <br />
            <span style={{ color: "#1185ff" }}>Build Skills</span>
          </h1>

          <p style={{ fontSize: "18px", color: "#555", marginBottom: "40px", maxWidth: "700px", margin: "0 auto 40px" }}>
            A programming practice platform to help you improve problem-solving skills
            and prepare for technical interviews.
          </p>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <a href="/problems" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#0084ff",
                color: "white",
                border: "none",
                padding: "18px 40px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,132,255,0.3)"
              }}>
                Start Practicing
              </button>
            </a>
            <a href="/signup" style={{ textDecoration: "none" }}>
              <button style={{
                background: "white",
                color: "#0084ff",
                border: "2px solid #0084ff",
                padding: "18px 40px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Create Account
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* What is UniCode */}
      <section style={{ padding: "80px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#111", marginBottom: "20px" }}>
              What is UniCode?
            </h2>
            <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.7, marginBottom: "30px" }}>
              UniCode is a web-based programming practice system inspired by LeetCode and HackerRank.
              Users can browse problems by topic and difficulty, write code online, submit solutions
              for evaluation, and track their progress.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {["Instant feedback on solutions", "Track your learning progress", "Prepare for interviews"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#e3f2fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0084ff",
                    fontWeight: "bold"
                  }}>✓</div>
                  <span style={{ fontSize: "16px", color: "#333" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "40px"
          }}>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#111", marginBottom: "15px" }}>Our Goal</h3>
            <p style={{ fontSize: "15px", color: "#555", marginBottom: "30px", lineHeight: 1.6 }}>
              Build an interactive learning environment with fast feedback and clear progress
              tracking to help learners improve consistently.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { title: "Fast Feedback", desc: "Quick results without long waiting" },
                { title: "Clear Progress", desc: "Track learning with metrics" },
                { title: "Interview Ready", desc: "Practice common patterns" }
              ].map((item) => (
                <div key={item.title} style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "4px" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "13px", color: "#666" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#f8fafc", padding: "80px 60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#111", marginBottom: "15px" }}>
              Key Features
            </h2>
            <p style={{ fontSize: "16px", color: "#555" }}>Everything you need to practice effectively</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px" }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "15px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111", marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section style={{ padding: "80px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#111", marginBottom: "15px" }}>
            System Architecture
          </h2>
          <p style={{ fontSize: "16px", color: "#555" }}>How UniCode works behind the scenes</p>
        </div>

        <div style={{
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "50px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* Row 1: Client → Backend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
              <div style={{
                flex: 1,
                background: "#e3f2fd",
                border: "2px solid #90caf9",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Web Client</p>
                <p style={{ fontSize: "13px", color: "#666" }}>React UI</p>
              </div>
              <div style={{ fontSize: "28px", color: "#0084ff", fontWeight: "bold" }}>→</div>
              <div style={{
                flex: 1,
                background: "#e3f2fd",
                border: "2px solid #90caf9",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Backend API</p>
                <p style={{ fontSize: "13px", color: "#666" }}>Spring Boot</p>
              </div>
            </div>

            {/* Arrow down from Backend */}
            <div style={{ textAlign: "center", fontSize: "28px", color: "#0084ff", fontWeight: "bold" }}>↓</div>

            {/* Row 2: Database + Queue (parallel) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Database</p>
                <p style={{ fontSize: "13px", color: "#666" }}>PostgreSQL</p>
              </div>
              <div style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Message Queue</p>
                <p style={{ fontSize: "13px", color: "#666" }}>Redis</p>
              </div>
            </div>

            {/* Arrow down from Queue only (right side) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div></div>
              <div style={{ textAlign: "center", fontSize: "28px", color: "#0084ff", fontWeight: "bold" }}>↓</div>
            </div>

            {/* Row 3: Judge Worker (under Queue) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div></div>
              <div style={{
                background: "#e8f5e9",
                border: "2px solid #81c784",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>Judge Worker</p>
                <p style={{ fontSize: "13px", color: "#666" }}>Docker Sandbox</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {[
              { title: "Secure execution", desc: "Isolated containers" },
              { title: "Non-blocking", desc: "Async processing" },
              { title: "Scalable", desc: "Handle multiple users" },
              { title: "Fast results", desc: "Quick feedback" }
            ].map((item) => (
              <div key={item.title} style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "15px"
              }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#111", marginBottom: "4px" }}>
                  ✓ {item.title}
                </p>
                <p style={{ fontSize: "12px", color: "#666" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#f8fafc", padding: "80px 60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#111", marginBottom: "15px" }}>
              Our Team
            </h2>
            <p style={{ fontSize: "16px", color: "#555" }}>Team members behind UniCode</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "30px" }}>
            {TEAM.map((m) => (
              <div key={m.name} style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center"
              }}>
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#0084ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                  margin: "0 auto 15px"
                }}>
                  {getInitials(m.name)}
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#111", marginBottom: "5px" }}>
                  {m.name}
                </p>
                <p style={{ fontSize: "13px", color: "#666" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: "80px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "42px", fontWeight: 900, color: "#111", marginBottom: "15px" }}>
            Technology Stack
          </h2>
          <p style={{ fontSize: "16px", color: "#555" }}>Tools we use to build UniCode</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
          {TECH.map((t) => (
            <span key={t} style={{
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "15px 30px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#333"
            }}>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0084ff", padding: "80px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "42px", fontWeight: 900, color: "white", marginBottom: "15px" }}>
            Ready to start practicing?
          </h2>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.9)", marginBottom: "40px" }}>
            Join UniCode and improve your coding skills today
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <a href="/problems" style={{ textDecoration: "none" }}>
              <button style={{
                background: "white",
                color: "#0084ff",
                border: "none",
                padding: "18px 40px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
              }}>
                Browse Problems
              </button>
            </a>
            <a href="/signup" style={{ textDecoration: "none" }}>
              <button style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "18px 40px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Sign Up Free
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "30px 60px" }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <p style={{ fontSize: "14px", color: "#666" }}>© 2025 UniCode. All rights reserved.</p>
          <p style={{ fontSize: "12px", color: "#999" }}>SE Project - Programming Practice Platform</p>
        </div>
      </footer>
    </div>
  );
}