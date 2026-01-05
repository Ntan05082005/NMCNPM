import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Tabs, message, Avatar } from "antd";
import { UserOutlined, GithubOutlined, LinkedinOutlined, SaveOutlined } from "@ant-design/icons";
// Import thêm các icons cho Sidebar
import { FiGrid, FiFileText, FiSend, FiUser, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';
import { getUserProfile, updateUserProfile } from "../../API/api-user";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
// Import CSS của Dashboard để lấy style cho Sidebar (nếu chưa có trong index.css)
import "../Dashboard/dashboard.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data);
      form.setFieldsValue(res.data);
      if(res.data.themePreference) {
        document.body.className = `theme-${res.data.themePreference}`;
      }
    } catch (error) {
      // Bỏ qua lỗi nếu chưa login
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const onFinish = async (values) => {
    try {
      await updateUserProfile(values);
      message.success("Profile updated successfully!");
      if (values.newPassword) {
        message.info("Password changed. Please login again.");
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data || "Failed to update profile";
      message.error(errorMsg);
    }
  };

  return (
    // Sử dụng class dashboard-page để ăn theo layout chung
    <div className="dashboard-page profile-page-container">
      <div className="dashboard-container" style={{background: 'var(--bg-primary)'}}>

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
              {/* Active tại trang Profile */}
              <div className="nav-item active" onClick={() => navigate('/profile')}>
                <FiUser className="nav-icon" /> Profile
              </div>
              {isAdmin && (
                <div className="nav-item admin-nav" onClick={() => navigate('/admin')}>
                  <FiShield className="nav-icon" /> Admin Panel
                </div>
              )}
            </nav>
          </div>
          <div className="sidebar-bottom">
            <div className="nav-item" onClick={() => navigate('/settings')}>
              <FiSettings className="nav-icon" /> Settings
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <FiLogOut className="nav-icon" /> Log Out
            </div>
          </div>
        </aside>
        {/* === KẾT THÚC SIDEBAR === */}

        {/* === MAIN CONTENT === */}
        <div className="profile-content main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>My Profile</h1>

          <div className="profile-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 30 }}>
            <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: 'var(--accent-color)' }} />
            <div style={{ marginLeft: 20 }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{user?.username || "Guest"}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>
          </div>

          <Card className="profile-card" loading={loading} style={{ background: 'var(--bg-secondary)', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Basic Information" key="1">
                <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <Form.Item label="Full Name" name="fullName">
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
                      <Input />
                    </Form.Item>
                  </div>

                  <h3 style={{color: 'var(--text-primary)', marginTop: 10}}>Social Links</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <Form.Item label="GitHub URL" name="githubLink">
                      <Input prefix={<GithubOutlined />} placeholder="https://github.com/..." />
                    </Form.Item>
                    <Form.Item label="LinkedIn URL" name="linkedinLink">
                      <Input prefix={<LinkedinOutlined />} placeholder="https://linkedin.com/in/..." />
                    </Form.Item>
                  </div>

                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} style={{ background: 'var(--accent-color)', marginTop: 10 }}>
                    Save Changes
                  </Button>
                </Form>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Security" key="2">
                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: 'Please enter current password' }]}>
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                  <Form.Item label="New Password" name="newPassword" rules={[{ required: true }, { min: 6 }]}>
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm new password" />
                  </Form.Item>
                  <Button type="primary" danger htmlType="submit">Change Password</Button>
                </Form>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;