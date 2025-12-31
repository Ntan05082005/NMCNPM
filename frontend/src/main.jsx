import "./index.css";
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUserProfile } from './API/api-user'; // Đảm bảo đường dẫn đúng

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

const ThemeEffects = () => {
  const snowFlakes = Array.from({ length: 18 }, (_, i) => i + 1);
  const [fireworks, setFireworks] = useState([]);

  useEffect(() => {
    const spawnFireworkBatch = () => {
      if (!document.body.classList.contains('theme-newyear')) {
        setFireworks([]);
        return;
      }

      const count = Math.floor(Math.random() * 3) + 2;
      const newBatch = [];

      for (let i = 0; i < count; i++) {
        const id = Date.now() + i + Math.random();
        const types = ['gold', 'cyan', 'red'];
        const type = types[Math.floor(Math.random() * types.length)];

        let left = Math.random() * 90 + 5;
        let top = Math.random() * 80 + 10;

        // Safe zone logic
        if (left > 25 && left < 75 && top > 30 && top < 70) {
           if (Math.random() > 0.5) top = Math.random() * 25;
           else top = 75 + Math.random() * 20;
        }

        // --- UPDATE MỚI: RANDOM THỜI GIAN (2s đến 3.5s) ---
        const duration = 5 + Math.random() * 2;

        newBatch.push({
          id,
          type,
          style: {
            left: `${left}%`,
            top: `${top}%`,
            transform: `scale(${1.6 + Math.random() * 1.9})`,
            animationDelay: `${Math.random() * 0.2}s`,
            // Truyền biến CSS custom vào để style hứng
            '--fw-duration': `${duration}s`
          }
        });
      }

      setFireworks(prev => [...prev, ...newBatch]);

      newBatch.forEach(fw => {
        setTimeout(() => {
          setFireworks(prev => prev.filter(item => item.id !== fw.id));
        }, 6000);
      });
    };

    const interval = setInterval(spawnFireworkBatch, 2000); // 1s bắn 1 đợt
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="christmas-snow-container">
        {snowFlakes.map((i) => (
          <div key={`snow-${i}`} className={`christmas-snow snow-${i}`}>❄</div>
        ))}
      </div>
      <div className="newyear-fireworks-container">
        {fireworks.map((fw) => (
          <div key={fw.id} className={`firework firework-${fw.type}`} style={fw.style}></div>
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
      } catch (e) { console.log("Default theme"); }
    };
    initTheme();
  }, []);

  return (
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
        <Route path="/profile/submissions" element={<SubmissionHistory />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div style={{ padding: 20 }}>No route matched</div>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);