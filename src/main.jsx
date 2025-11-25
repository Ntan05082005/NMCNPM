import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import "./pages/Start/start.css";
//import LogIn from './pages/Start/index.jsx'

import SignUp from './pages/SignUp/index.jsx'
createRoot(document.getElementById('root')).render(
  
    <SignUp/>

)
