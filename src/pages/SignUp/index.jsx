import React, { useState } from "react";
import "./start.css";
import heroMan from "../../assets/hero-women.png";
// Import thêm icon Check hình tròn (FaCheckCircle)
import { FaRegEyeSlash, FaGithub, FaFacebook, FaCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState(null);

  // --- 1. STATE MỚI: Kiểm tra đăng ký thành công chưa ---
  const [isSuccess, setIsSuccess] = useState(false);

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
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang

    // Kiểm tra: Nếu mật khẩu hợp lệ (isValid === true) thì mới cho thành công
    // Bạn có thể thêm điều kiện kiểm tra email/username không rỗng ở đây
    if (isValid === true) {
      setIsSuccess(true); // Chuyển trạng thái sang thành công
    } else {
      alert("Please enter a valid password before registering!");
    }
  };

  return (
    <div className="page">
      <div className="hero-card">
        <header className="navbar">
          <nav className="nav-links">
            <a href="#practice">Practice</a>
            <a href="#about">About Us</a>
            <a href="#login" className="text-blue">LogIn</a>
            <button className="btn btn-primary small">Sign Up</button>
          </nav>
        </header>

        <div className="circle-deco circle-top-left"></div>
        <div className="circle-deco circle-bottom-center"></div>

        <main className="hero-content">
          <section className="hero-left">
            <h1 className="hero-title">
              <span className="line1" style={{ color: '#0084ff', marginBottom: '-10px' }}>
                Building Tomorrow,
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
                  <button
                    className="btn btn-primary small"
                    onClick={() => window.location.reload()} // Tải lại trang để reset
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                // --- GIAO DIỆN FORM ĐĂNG KÝ (CŨ) ---
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input required type="email" placeholder="Mail Id" className="form-input" />
                    </div>
                    <div className="form-group">
                      <input required type="text" placeholder="Username" className="form-input" />
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
                    Have an Account ? <a href="#login" className="link-blue">Log In</a>
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