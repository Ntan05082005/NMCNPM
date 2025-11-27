import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import "./pages/Start/start.css";
import Start from './pages/Start/index.jsx'

import SignUp from './pages/SignUp/index.jsx'

createRoot(document.getElementById('root')).render(
     <StrictMode>
          <BrowserRouter>
               <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/signup" element={<SignUp />} />
               </Routes>
          </BrowserRouter>
     </StrictMode>
)
