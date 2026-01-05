import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * OAuth2 Redirect Handler
 * This page receives the JWT token from backend after successful OAuth2 login
 * and stores it in localStorage before redirecting to dashboard
 */
export default function OAuth2Redirect() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');

        if (token && username && userId) {
            // Clear any previous data
            localStorage.clear();

            // Store the new OAuth login data
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('user_id', userId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role || 'USER');

            console.log('✅ OAuth2 login successful for:', username);

            // Redirect based on role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            console.error('❌ OAuth2 redirect missing required parameters');
            navigate('/login?error=oauth_failed');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontSize: '18px',
            color: '#64748b'
        }}>
            Completing login...
        </div>
    );
}
