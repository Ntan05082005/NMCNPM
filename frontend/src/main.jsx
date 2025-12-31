import "./index.css";
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// --- COMPONENT HIỆU ỨNG (Tạo thẻ HTML cho CSS style) ---
const ThemeEffects = () => {
  const snowFlakes = Array.from({ length: 18 }, (_, i) => i + 1);
  const fireworks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <div className="christmas-snow-container">
        {snowFlakes.map((i) => (
          <div key={`snow-${i}`} className={`christmas-snow snow-${i}`}>❄</div>
        ))}
      </div>

      <div className="newyear-fireworks-container">
        {fireworks.map((i) => (
          <div key={`firework-${i}`} className={`firework firework-${i}`}></div>
        ))}
      </div>
    </>
  );
};

// --- APP CHÍNH ---
function App() {
  useEffect(() => {
    const initTheme = async () => {
      try {
        const res = await getUserProfile();
        if (res.data && res.data.themePreference) {
          document.body.className = `theme-${res.data.themePreference}`;
        }
      } catch (e) {
        console.log("Using default theme");
      }
    };
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      {/* Nhúng ThemeEffects vào đây để nó luôn hiển thị trên mọi trang */}
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
        <Route path="/profile/submissions" element={<SubmissionHistory />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div style={{ padding: 20 }}>No route matched — Router is active</div>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);