import React from "react";
import "./start.css";
import heroMan from "../../assets/hero-women.png";
export default function LogIn() {
  return (
    <div className="page">
      <div className="hero-card">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">UniCode</div>

          <nav className="nav-links">
            <a href="#practice">Practice</a>
            <a href="#about">About Us</a>
            <a href="#login">LogIn</a>
          </nav>

          <button className="btn btn-primary small">Sign Up</button>
        </header>

        {/* CIRCLE DECOR TOP RIGHT */}
        <div className="circle circle-top" />

        {/* MAIN CONTENT */}
        <main className="hero-content">
          {/* LEFT SIDE – TEXT */}
          <section className="hero-left">
            <h1 className="hero-title">
              <span>Building</span>
              <br />
              <span className="accent">Tomorrow,</span>{" "}
              <span>One</span>
              <br />
              <span>Line At A Time</span>
            </h1>

            <p className="hero-sub">
              UniCode Will Give You An Unforgettable
              <br />
              Experience
            </p>

            <div className="hero-cta-row">
              <button className="btn btn-primary btn-large">
                Create Account
              </button>
            </div>

            <div className="hero-secondary-row">
              <button className="chip">Test</button>
              <button className="chip">Courses</button>
            </div>
          </section>

          {/* RIGHT SIDE – IMAGE */}
          <section className="hero-right">
            <img
              src={heroMan}
              alt="Man holding laptop"
              className="hero-image"
            />
          </section>
        </main>

        {/* CIRCLE DECOR BOTTOM RIGHT */}
        <div className="circle circle-bottom" />
      </div>
    </div>
  );
}
