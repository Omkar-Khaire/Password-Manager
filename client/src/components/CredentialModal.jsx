import React, { useState, useEffect } from 'react';
import { X, Globe, User, Lock, Notebook, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import './CredentialModal.css';

export const CredentialModal = ({ credential, onSave, onClose, loading }) => {
    const [form, setForm] = useState(
        credential
            ? { ...credential }
            : { websiteName: '', websiteUrl: '', username: '', password: '', notes: '' }
    );
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [copied, setCopied] = useState(false);

    // Calculate password strength
    useEffect(() => {
        const pwd = form.password || '';
        let strength = 0;
        
        if (pwd.length >= 8) strength += 20;
        if (pwd.length >= 12) strength += 20;
        if (/[a-z]/.test(pwd)) strength += 15;
        if (/[A-Z]/.test(pwd)) strength += 15;
        if (/[0-9]/.test(pwd)) strength += 15;
        if (/[!@#$%^&*()\-_+=\[\]{};':"\\|,.<>?]/.test(pwd)) strength += 15;
        
        setPasswordStrength(Math.min(strength, 100));
    }, [form.password]);

    // Password Generator Logic
    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let retVal = "";
        for (let i = 0; i < 18; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setForm({ ...form, password: retVal });
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(form.password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.websiteName || !form.password) {
            setError('Website name and password are required');
            return;
        }
        try {
            await onSave(form);
        } catch (err) {
            setError(err.message);
        }
    };

    const getStrengthLabel = () => {
        if (passwordStrength < 30) return { text: 'Weak', color: 'weak' };
        if (passwordStrength < 60) return { text: 'Fair', color: 'medium' };
        if (passwordStrength < 80) return { text: 'Good', color: 'good' };
        return { text: 'Strong', color: 'strong' };
    };

    const strength = getStrengthLabel();

    return (
        <div className="modal-overlay" onClick={() => onClose()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title">
                        <div className={`header-icon ${credential ? 'edit' : 'add'}`}>
                            <Lock size={22} />
                        </div>
                        <div>
                            <h2>{credential ? 'Edit Credential' : 'Add New Credential'}</h2>
                            <p>{credential ? 'Update your secure entry' : 'Create a new secure password entry'}</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose} title="Close modal">
                        <X size={22} />
                    </button>
                </div>

                {error && (
                    <div className="modal-error-banner">
                        <span>{error}</span>
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-section">
                        <div className="input-field">
                            <label>
                                <Globe size={16} />
                                <span>Website Name *</span>
                            </label>
                            <input
                                type="text"
                                value={form.websiteName}
                                onChange={e => setForm({ ...form, websiteName: e.target.value })}
                                placeholder="e.g. Amazon, Gmail, Netflix"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="input-field">
                            <label>
                                <Globe size={16} />
                                <span>Website URL</span>
                            </label>
                            <input
                                type="url"
                                value={form.websiteUrl || ''}
                                onChange={e => setForm({ ...form, websiteUrl: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="input-field">
                            <label>
                                <User size={16} />
                                <span>Username / Email</span>
                            </label>
                            <input
                                type="text"
                                value={form.username || ''}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                placeholder="user@example.com or username"
                            />
                        </div>
                    </div>

                    <div className="form-section password-section">
                        <label>
                            <Lock size={16} />
                            <span>Password *</span>
                        </label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter a strong password"
                                required
                            />
                            <div className="password-actions">
                                <button 
                                    type="button" 
                                    className="action-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button 
                                    type="button" 
                                    className="action-btn"
                                    onClick={copyPassword}
                                    title="Copy password"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                                <button 
                                    type="button" 
                                    className="action-btn generate-btn"
                                    onClick={generatePassword}
                                    title="Generate password"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Meter */}
                        {form.password && (
                            <div className="strength-info">
                                <div className="strength-bar-container">
                                    <div className="strength-bar-track">
                                        <div 
                                            className={`strength-bar-fill ${strength.color}`}
                                            style={{ width: `${passwordStrength}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="strength-text">
                                    <span>Password Strength: <strong>{strength.text}</strong></span>
                                    <span className="length-info">{form.password.length} characters</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-section">
                        <label>
                            <Notebook size={16} />
                            <span>Notes</span>
                        </label>
                        <textarea
                            value={form.notes || ''}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            placeholder="Add any notes or hints (backup codes, security questions, etc.)"
                            rows="4"
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            <span>Cancel</span>
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner-mini"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{credential ? 'Save Changes' : 'Add Credential'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
