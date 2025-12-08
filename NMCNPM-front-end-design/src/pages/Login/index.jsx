import React, { useState } from "react";
import "../SignUp/signup.css"; // dùng chung stylesheet với trang SignUp (fix path)
import heroMan from "../../assets/ảnh-sinh-viên.png";

import { FaRegEyeSlash, FaGithub, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../../API/api-login.js";
import { Link } from "react-router-dom";


export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const payload = { username, password };
      const res = await loginUser(payload);

      const token = res.data.token;
      const name = res.data.username;

      // Lưu token vào localStorage
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("username", name);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/"; // chuyển sang home
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("Incorrect username or password!");
    }
  };

  return (
    <div className="page signup-page">
      <div className="hero-card">
        {/* NAVBAR */}
        <header className="navbar">
          <nav className="nav-links">
              <Link to="/practice">Practice</Link>
              <Link to="/about">About Us</Link>
              <Link to="/login" className="text-blue">LogIn</Link>
              <Link to="/signup">
                  <button className="btn btn-primary small">Sign Up</button>
              </Link>
          </nav>
        </header>

        {/* Decorative Circles */}
        <div className="circle-deco circle-top-left"></div>
        <div className="circle-deco circle-bottom-center"></div>

        {/* MAIN CONTENT */}
        <main className="hero-content">
          {/* LEFT SECTION */}
          <section className="hero-left">
            <h1 className="hero-title">
              <span
                className="line1"
                style={{ color: "#0084ff", marginBottom: "-10px" }}
              >
                Welcome Back
              </span>
              <br />
              <span
                className="line2"
                style={{ color: "#333", fontSize: "0.9em" }}
              >
                Continue Your Coding Journey
              </span>
            </h1>

            <div className="image-floating-wrapper">
              <div className="floating-chip chip-test">Practice</div>
              <img
                src={heroMan}
                alt="Student with laptop"
                className="hero-image-left"
              />
              <div className="floating-chip chip-courses">Explore</div>
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="signup-card-container">
            <div className="signup-card">
              <div className="form-logo">
                <span>Uni</span>Code
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    required
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                    className="password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FaRegEyeSlash />
                  </span>
                </div>

                {message && (
                  <p
                    style={{
                      color: message.includes("successful") ? "green" : "red",
                      marginTop: 5,
                    }}
                  >
                    {message}
                  </p>
                )}

                <button className="btn btn-primary btn-register">
                  Log In
                </button>
              </form>

              <div className="form-footer">
                Don’t have an account ? <Link to="/signup" className="link-blue">Sign Up</Link>
              </div>

              <div className="social-separator">Or log in with</div>

              <div className="social-icons">
                <button className="social-btn">
                  <FcGoogle />
                </button>
                <button className="social-btn">
                  <FaGithub style={{ color: "#333" }} />
                </button>
                <button className="social-btn">
                  <FaFacebook style={{ color: "#1877f2" }} />
                </button>
              </div>

              <p className="legal-text">
                Protected by reCAPTCHA. The Google{" "}
                <a href="#privacy">Privacy Policy</a> and{" "}
                <a href="#terms">Terms of Service</a> apply.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
