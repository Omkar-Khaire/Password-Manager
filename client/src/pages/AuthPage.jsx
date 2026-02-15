import React, { useState } from 'react';
import { ShieldCheck, Lock, UserPlus } from 'lucide-react'; // Professional icons
import { useAuth } from '../context/AuthContext';
import { Register, Login } from '../components/Auth';
import './AuthPage.css';

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { loading } = useAuth();

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

            <div className="auth-container-main">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <ShieldCheck size={40} strokeWidth={1.5} />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{isLogin ? 'Enter your credentials to access your vault' : 'Start securing your digital life today'}</p>
                </div>

                <div className="auth-form-content">
                    {isLogin ? <Login /> : <Register />}
                </div>

                <div className="auth-toggle">
                    <p>
                        {isLogin ? "New to the vault?" : "Been here before?"}
                        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? (
                                <> <UserPlus size={16} /> Create Account </>
                            ) : (
                                <> <Lock size={16} /> Sign In </>
                            )}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};