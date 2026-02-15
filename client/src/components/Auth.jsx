import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-wrapper">
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit} className="modern-form">
                <div className="input-group">
                    <User className="input-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </div>

                <div className="input-group">
                    <Mail className="input-icon" size={18} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>

                <div className="input-group">
                    <Lock className="input-icon" size={18} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <div className="loader-small"></div> : (
                        <>Get Started <ArrowRight size={18} /></>
                    )}
                </button>
            </form>
        </div>
    );
};

export const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-wrapper">
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit} className="modern-form">
                <div className="input-group">
                    <Mail className="input-icon" size={18} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </div>

                <div className="input-group">
                    <Lock className="input-icon" size={18} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? <div className="loader-small"></div> : (
                        <>Sign In <ArrowRight size={18} /></>
                    )}
                </button>
            </form>
        </div>
    );
};  