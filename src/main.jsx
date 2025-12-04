import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Start from './pages/Start/index.jsx';
import SignUp from './pages/SignUp/index.jsx';
import LogIn from './pages/Login/index.jsx';
import ProtectedPage from './pages/Protected/index.jsx'; // trang test JWT
import ProblemDetail from './pages/problemDetail/index.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <BrowserRouter>
  //     <Routes>
  //       {/* TRANG CHÍNH */}
  //       <Route path="/" element={<Start />} />

  //       {/* AUTH PAGES */}
  //       <Route path="/signup" element={<SignUp />} />
  //       <Route path="/login" element={<LogIn />} />

  //       {/* TRANG CHỈ TRUY CẬP KHI CÓ JWT */}
  //       <Route path="/protected" element={<ProtectedPage />} />
  //       {/* Fallback route to help debug unmatched paths */}
  //       <Route path="*" element={<div style={{padding:20}}>No route matched — Router is active</div>} />
  //     </Routes>
  //   </BrowserRouter>
  // </StrictMode>
   <BrowserRouter>
    <ProblemDetail />
  </BrowserRouter>
);
