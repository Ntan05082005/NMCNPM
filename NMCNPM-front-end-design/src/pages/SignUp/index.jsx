import React, { useState } from "react";
import "./signup.css";
import heroMan from "../../assets/ảnh-sinh-viên.png";
// Import thêm icon Check hình tròn (FaCheckCircle)
import { FaRegEyeSlash, FaGithub, FaFacebook, FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { registerUser } from "../../API/api-signup.js";
import { Link } from "react-router-dom"; 



export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(null);

  // --- 1. STATE MỚI: Kiểm tra đăng ký thành công chưa ---
  const [isSuccess, setIsSuccess] = useState(false);

   // ⬅ NEW: state cho email & username
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Validate Password Real-time
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);

    if (val.length === 0) {
      setIsValid(null);
      setMessage("");
    } else if (val.length < 8) {
      setIsValid(false);
      setMessage("Weak: Password must be at least 8 characters");
    } else if (!/\d/.test(val)) {
      setIsValid(false);
      setMessage("Medium: Must contain at least one number");
    } else {
      setIsValid(true);
      setMessage("Success: Strong password!");
    }
  };

  // --- 2. HÀM XỬ LÝ KHI NHẤN REGISTER ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang

    if (isValid !== true) {
      alert("Please enter a valid password before registering!");
      return;
    }

    try {
      const payload = { email, username, password };

      const res = await registerUser(payload); // ⬅ GỌI API
      console.log("Register success:", res.data);

      setIsSuccess(true); // Chuyển sang view thành công
    } catch (err) {
      console.error(err);

      // Nếu backend trả message cụ thể
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Register failed! Please try again.");
      }
    }
  };

  return (
    <div className="page signup-page">
      <div className="hero-card">
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

        <div className="circle-deco circle-top-left"></div>
        <div className="circle-deco circle-bottom-center"></div>

        <main className="hero-content">
          <section className="hero-left">
            <h1 className="hero-title">
              <span className="line1" style={{ color: '#0084ff', marginBottom: '-10px' }}>
                Building Tomorrow
              </span>
              <br />
              <span className="line2" style={{ color: '#333', fontSize: '0.9em' }}>
                One Line At A Time
              </span>
            </h1>

            <div className="image-floating-wrapper">
              <div className="floating-chip chip-test">Test</div>
              <img
                src={heroMan}
                alt="Man holding laptop"
                className="hero-image-left"
              />
              <div className="floating-chip chip-courses">Courses</div>
            </div>
          </section>

          <section className="signup-card-container">
            <div className="signup-card">
              <div className="form-logo">
                <span>Uni</span>Code
              </div>

              {/* --- 3. ĐIỀU KIỆN HIỂN THỊ: FORM hay SUCCESS --- */}
              {isSuccess ? (
                // --- GIAO DIỆN KHI THÀNH CÔNG ---
                <div className="success-view">
                  <FaCheckCircle className="icon-success" />
                  <h3 className="success-title">Registration Successful!</h3>
                  <p className="success-desc">Welcome to the UniCode community.</p>
                  <button className="btn btn-primary small">
                    <Link to="/" style={{ color: "white" }}>Back to Home</Link>
                  </button>

                </div>
              ) : (
                // --- GIAO DIỆN FORM ĐĂNG KÝ (CŨ) ---
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input required type="email" placeholder="Email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <input required type="text" placeholder="Username" className="form-input"value={username} onChange={(e) => setUsername(e.target.value)}  />
                    </div>

                    <div className="form-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`form-input ${isValid === false ? 'input-error' : isValid === true ? 'input-success' : ''}`}
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                        <FaRegEyeSlash />
                      </span>

                      {message && (
                        <div className={`validation-message ${isValid ? 'msg-success' : 'msg-error'}`}>
                          {message}
                        </div>
                      )}
                    </div>

                    <button className="btn btn-primary btn-register">
                      Register
                    </button>
                  </form>

                  <div className="form-footer">
                    Have an Account ? <Link to="/login" className="link-blue">Log In</Link>
                  </div>

                  <div className="social-separator">Or you can Signup with</div>

                  <div className="social-icons">
                    <button className="social-btn"><FcGoogle /></button>
                    <button className="social-btn"><FaGithub style={{ color: '#333' }} /></button>
                    <button className="social-btn"><FaFacebook style={{ color: '#1877f2' }} /></button>
                  </div>

                  <p className="legal-text">
                    This site is protected by reCAPTCHA and the Google <a href="#privacy">Privacy Policy</a> and <a href="#terms">Terms of Service</a> apply.
                  </p>
                </>
              )}
              {/* --- HẾT PHẦN ĐIỀU KIỆN --- */}

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}