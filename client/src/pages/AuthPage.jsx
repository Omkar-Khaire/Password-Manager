import React, { useState } from 'react';
import { ShieldCheck, Lock, UserPlus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Register, Login } from '../components/Auth';
import './AuthPage.css';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { loading } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Securing connection...</p>
            </div>
        );
    }

    return (
        <div className="auth-page">
            {/* Background decorative elements */}
            <div className="bg-circle circle-1"></div>
            <div className="bg-circle circle-2"></div>

            {/* Theme Toggle Button */}
            <button 
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDark ? (
                    <Sun size={20} className="text-amber-400" />
                ) : (
                    <Moon size={20} className="text-slate-600" />
                )}
            </button>

            <div className="auth-container-main">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <ShieldCheck size={44} strokeWidth={1.5} />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Your Vault'}</h1>
                    <p>{isLogin ? 'Access your secure password vault with enterprise-grade protection' : 'Join thousands securing their digital identity'}</p>
                </div>

                <div className="auth-form-content">
                    {isLogin ? <Login /> : <Register />}
                </div>

                <div className="auth-toggle">
                    <p>
                        {isLogin ? "New here?" : "Already a member?"}
                        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? (
                                <> <UserPlus size={16} /> Create Account </>
                            ) : (
                                <> <Lock size={16} /> Sign In </>
                            )}
                        </button>
                    </p>
                </div>

                {/* Security Badge */}
                <div className="security-badge">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L3 3V7C3 11 8 14.5 8 14.5C8 14.5 13 11 13 7V3L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span>256-bit AES Encrypted</span>
                </div>
            </div>
        </div>
    );
};
