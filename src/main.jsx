import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./pages/Start/start.css";
import LogIn from './pages/Start/index.jsx'

createRoot(document.getElementById('root')).render(
  <LogIn />
)
