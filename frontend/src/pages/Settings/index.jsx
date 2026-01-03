import React, { useState } from "react"; // 1. Import useState
import { Card, message } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
// Import icons cho Sidebar
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { updateUserProfile } from "../../API/api-user";
import { useNavigate } from "react-router-dom";
// Import CSS dashboard cho Sidebar
import "../Dashboard/dashboard.css";

const THEMES = [
  { id: 'light', name: 'Default Light', color: '#ffffff', textColor: '#333' },
  { id: 'dark', name: 'Dark Mode', color: '#0f172a', textColor: '#fff' },
  { id: 'christmas', name: 'Christmas', color: '#f0fdf4', textColor: '#14532d', border: '2px solid #dc2626' },
  { id: 'newyear', name: 'New Year', color: '#1c1917', textColor: '#fef3c7', border: '2px solid #d97706' },
];

const Settings = () => {
  const navigate = useNavigate();

  // 2. KHỞI TẠO STATE: Lấy theme hiện tại từ body class khi trang vừa load
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.body.className.replace('theme-', '') || 'light';
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const changeTheme = async (themeId) => {
    // Cập nhật DOM
    document.body.className = `theme-${themeId}`;

    // 3. CẬP NHẬT STATE: Để React render lại dấu tích
    setCurrentTheme(themeId);

    try {
      await updateUserProfile({ themePreference: themeId });
      message.success(`Theme changed to ${themeId}`);
    } catch (e) {
      // message.error("Failed to save preference"); // Có thể bỏ qua lỗi nếu muốn
    }
  };

  return (
    <div className="dashboard-page" style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
       <div className="dashboard-container" style={{ width: '100%', display: 'flex' }}>

       {/* === SIDEBAR CHUẨN === */}
       <aside className="sidebar">
          <div className="sidebar-top">
            <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} title="Go to Dashboard">
              <span className="logo-uni">Uni</span>Code
            </div>
            <nav className="nav-menu">
              <div className="nav-item" onClick={() => navigate('/dashboard')}>
                <FiGrid className="nav-icon" /> Dashboard
              </div>
              <div className="nav-item" onClick={() => navigate('/problems')}>
                <FiFileText className="nav-icon" /> Problems
              </div>
              <div className="nav-item" onClick={() => navigate('/profile/submissions')}>
                <FiSend className="nav-icon" /> Submissions
              </div>
              <div className="nav-item" onClick={() => navigate('/profile')}>
                <FiUser className="nav-icon" /> Profile
              </div>
            </nav>
          </div>
          <div className="sidebar-bottom">
            {/* Active tại trang Settings */}
            <div className="nav-item active" onClick={() => navigate('/settings')}>
              <FiSettings className="nav-icon" /> Settings
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <FiLogOut className="nav-icon" /> Log Out
            </div>
          </div>
        </aside>
        {/* === KẾT THÚC SIDEBAR === */}

       <div className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
         <h1 style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>Settings</h1>

         <Card
            title="Appearance"
            bordered={false}
            headStyle={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--text-secondary)' }}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '1px solid rgba(128, 128, 128, 0.2)'
            }}
          >
            <h3 style={{ color: 'var(--text-primary)', marginTop: 0 }}>Select Theme</h3>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 20 }}>
              {THEMES.map(theme => (
                <div
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  style={{
                    width: 150,
                    height: 100,
                    background: theme.color,
                    border: theme.border || '1px solid #ddd',
                    borderRadius: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    transform: currentTheme === theme.id ? 'scale(1.05)' : 'scale(1)',
                    borderColor: currentTheme === theme.id ? 'var(--accent-color)' : (theme.border ? 'transparent' : '#ddd')
                  }}
                  onMouseEnter={(e) => { if(currentTheme !== theme.id) e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={(e) => { if(currentTheme !== theme.id) e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <span style={{ color: theme.textColor, fontWeight: 'bold' }}>{theme.name}</span>

                  {currentTheme === theme.id && (
                    <CheckCircleFilled style={{ position: 'absolute', top: 10, right: 10, color: 'var(--accent-color)', fontSize: 20 }} />
                  )}
                </div>
              ))}
            </div>
          </Card>
       </div>
       </div>
    </div>
  );
};

export default Settings;