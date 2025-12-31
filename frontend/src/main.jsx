import "./index.css";
import { StrictMode, useEffect } from 'react'; // 1. Thêm useEffect
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Import API để lấy thông tin user
import { getUserProfile } from './API/api-user';

// Pages
import Start from './pages/Start/index.jsx';
import SignUp from './pages/SignUp/index.jsx';
import LogIn from './pages/Login/index.jsx';
import ProtectedPage from './pages/Protected/index.jsx';
import ProblemDetail from './pages/problemDetail/index.jsx';
import ListExercise from './pages/ListExercise/index.jsx';
import SpecifiedProblem from './pages/SpecifiedProblem/index.jsx';
import AboutUs from './pages/aboutUs/index.jsx';
import InterfaceCode from './pages/InterfaceCode/index.jsx';
import SubmissionHistory from './pages/AllSubmissionHistory/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Profile from './pages/Profile/index.jsx';
import Settings from './pages/Settings/index.jsx';

// 3. Tạo component App để chứa logic khởi tạo Theme
function App() {

  // Effect này chạy 1 lần khi App khởi động
  useEffect(() => {
    const initTheme = async () => {
      try {
        // Gọi API lấy profile để biết user thích theme gì
        const res = await getUserProfile();
        // Nếu có themePreference lưu trong DB, áp dụng ngay vào body
        if (res.data && res.data.themePreference) {
          document.body.className = `theme-${res.data.themePreference}`;
        }
      } catch (e) {
        // Nếu lỗi (ví dụ chưa đăng nhập), giữ nguyên theme mặc định (light)
        console.log("User not logged in or theme load failed, using default.");
      }
    };
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* TRANG CHÍNH */}
        <Route path="/" element={<Start />} />

        {/* AUTH PAGES */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* TRANG CHỈ TRUY CẬP KHI CÓ JWT */}
        <Route path="/protected" element={<ProtectedPage />} />

        {/* EXERCISE/PROBLEMS PAGES */}
        <Route path="/problems" element={<ListExercise />} />
        <Route path="/category/:categoryId" element={<SpecifiedProblem />} />
        <Route path="/problem/:slug" element={<ProblemDetail />} />
        <Route path="/interface-code/:slug" element={<InterfaceCode />} />
        <Route path="/profile/submissions" element={<SubmissionHistory />} />

        <Route path="/about" element={<AboutUs />} />

        {/* PROFILE & SETTINGS (Đã thêm ở Bước 5) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Fallback route */}
        <Route path="*" element={<div style={{ padding: 20 }}>No route matched — Router is active</div>} />
      </Routes>
    </BrowserRouter>
  );
}

// 4. Render component App thay vì render trực tiếp Router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);