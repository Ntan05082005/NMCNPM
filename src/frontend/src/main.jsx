import "./index.css";
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUserProfile } from './API/api-user';

// Import các trang của bạn...
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
import SubmissionResult from './pages/SubmissionResult/index.jsx';
import SubmissionDetail from './pages/SubmissionDetail/index.jsx';
import AdminDashboard from './pages/Admin/index.jsx';
import ProblemEditor from './pages/Admin/ProblemEditor.jsx';
import OAuth2Redirect from './pages/OAuth2Redirect/index.jsx';
import AIChatbot from './components/AIChatbot/AIChatbot.jsx';
import { AIContextProvider } from './components/AIChatbot/AIContext.jsx';

const ThemeEffects = () => {
  const snowFlakes = Array.from({ length: 18 }, (_, i) => i + 1);
  const [fireworks, setFireworks] = useState([]);

  // Tạo mảng 24 tia cho mỗi quả pháo (360 độ / 15 độ = 24 tia)
  const rays = Array.from({ length: 24 });

  useEffect(() => {
    const spawnFireworkBatch = () => {
      // Chỉ chạy khi đúng theme New Year
      if (!document.body.classList.contains('theme-newyear')) {
        setFireworks([]);
        return;
      }

      // Random 1 đến 2 quả mỗi đợt
      const count = Math.floor(Math.random() * 2) + 1;
      const newBatch = [];

      for (let i = 0; i < count; i++) {
        const id = Date.now() + i + Math.random();
        // Loại màu: gold, cyan, red
        const types = ['gold', 'cyan', 'red'];
        const type = types[Math.floor(Math.random() * types.length)];

        // Random vị trí (tránh vùng giữa)
        let left = Math.random() * 90 + 5;
        let top = Math.random() * 80 + 5;

        // Safe zone: Đẩy ra biên nếu rơi vào giữa
        if (left > 20 && left < 80 && top > 20 && top < 80) {
          if (Math.random() > 0.5) top = Math.random() * 15; // Lên đỉnh
          else top = 85 + Math.random() * 10; // Xuống đáy
        }

        newBatch.push({
          id,
          type,
          style: {
            left: `${left}%`,
            top: `${top}%`,
            // Random kích thước từ 0.8 đến 1.3
            transform: `scale(${0.7 + Math.random() * 0.3})`,
          }
        });
      }

      setFireworks(prev => [...prev, ...newBatch]);

      // Xóa sau  giây (đủ thời gian để hiệu ứng tắt hẳn)
      newBatch.forEach(fw => {
        setTimeout(() => {
          setFireworks(prev => prev.filter(item => item.id !== fw.id));
        }, 6000);
      });
    };

    // 3 giây bắn 1 đợt (Thư thả, không dồn dập)
    const interval = setInterval(spawnFireworkBatch, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hiệu ứng Tuyết (Christmas) */}
      <div className="christmas-snow-container">
        {snowFlakes.map((i) => (
          <div key={`snow-${i}`} className={`christmas-snow snow-${i}`}>❄</div>
        ))}
      </div>

      {/* Hiệu ứng Pháo hoa (New Year) */}
      <div className="newyear-fireworks-container">
        {fireworks.map((fw) => (
          // Container chính của 1 quả pháo
          <div key={fw.id} className={`firework firework--${fw.type}`} style={fw.style}>

            {/* 1. Tâm sáng (Flash) - Màu vàng */}
            <div className="flash"></div>

            {/* 2. Các tia sáng (Rays) */}
            <div className="explosion">
              {rays.map((_, index) => (
                // Mỗi tia xoay 1 góc 15 độ
                <div key={index} className="ray" style={{ '--angle': `${index * 15}deg` }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

function App() {
  useEffect(() => {
    const initTheme = async () => {
      try {
        const res = await getUserProfile();
        if (res.data && res.data.themePreference) {
          document.body.className = `theme-${res.data.themePreference}`;
        }
      } catch (e) { console.log("Default theme"); }
    };
    initTheme();
  }, []);

  return (
    <AIContextProvider>
      <BrowserRouter>
        <ThemeEffects />
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/problems" element={<ListExercise />} />
          <Route path="/category/:categoryId" element={<SpecifiedProblem />} />
          <Route path="/problem/:slug" element={<ProblemDetail />} />
          <Route path="/interface-code/:slug" element={<InterfaceCode />} />
          <Route path="/submission-result" element={<SubmissionResult />} />
          <Route path="/submissions/:id" element={<SubmissionDetail />} />
          <Route path="/profile/submissions" element={<SubmissionHistory />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/problems/new" element={<ProblemEditor />} />
          <Route path="/admin/problems/:id/edit" element={<ProblemEditor />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
          <Route path="*" element={<div style={{ padding: 20 }}>No route matched</div>} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </AIContextProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);