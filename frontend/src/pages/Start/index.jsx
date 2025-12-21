import React from "react";
import "./start.css";
import heroMan from "../../assets/hero-women.png";
import { Link } from "react-router-dom";


export default function Start() {
  return (
    <div className="start-page">
      <div className="hero-card">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">UniCode</div>

          <nav className="nav-links">
            <Link 
              to="/problems" 
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: '#666',
                fontSize: '15px',
                fontWeight: '500'
              }}
            >
              Practice
            </Link>
            <Link 
              to="/about" 
              style={{color: '#666'}}
            >
              About Us
            </Link>
            <Link 
              to="/login" 
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: '#0084ff',
                fontSize: '15px',
                fontWeight: '600'
              }}
              onClick={() => console.log('Login link clicked!')}
            >
              Login
            </Link>
          </nav>

          <Link to="/signup" style={{textDecoration: 'none'}}>
            <button className="btn btn-primary small">Sign Up</button>
          </Link>
        </header>

        {/* CIRCLE DECOR TOP RIGHT */}
        <div className="circle circle-top" />

        {/* MAIN CONTENT */}
        <main className="hero-content">
          {/* LEFT SIDE – TEXT */}
          <section className="hero-left">
            <h1 className="hero-title">
              <span className="line1"> Building Tomorrow</span>
               <br />

              <span className="line2"> One Line At A Time
              </span>
            </h1>

            <p className="hero-sub">UniCode Will Give You An Unforgettable Experience</p>

            <div className="hero-actions">
              <div className="hero-cta-row">
                <Link to="/signup" className="btn btn-primary btn-large">
                  Create Account
                </Link>
              </div>

              <div className="hero-secondary-row">
                <button className="chip">Test</button>
                <button className="chip">Courses</button>
              </div>
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
