import React, { useState, useEffect } from 'react';
import { X, Globe, User, Lock, Notebook, RefreshCw, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import './CredentialModal.css';

export const CredentialModal = ({ credential, onSave, onClose, loading }) => {
    const [form, setForm] = useState(
        credential
            ? { ...credential }
            : { websiteName: '', websiteUrl: '', username: '', password: '', notes: '' }
    );
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Password Generator Logic
    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let retVal = "";
        for (let i = 0, n = charset.length; i < 16; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setForm({ ...form, password: retVal });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.websiteName || !form.password) {
            setError('Required fields are missing');
            return;
        }
        try {
            await onSave(form);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-title">
                        <div className={`header-icon ${credential ? 'edit' : 'add'}`}>
                            <Lock size={20} />
                        </div>
                        <h2>{credential ? 'Edit Credential' : 'Secure New Entry'}</h2>
                    </div>
                    <button className="close-x" onClick={onClose}><X size={20} /></button>
                </div>

                {error && <div className="modal-error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="modern-modal-form">
                    <div className="form-grid">
                        <div className="input-field">
                            <label><Globe size={14} /> Website Name *</label>
                            <input
                                type="text"
                                value={form.websiteName}
                                onChange={e => setForm({ ...form, websiteName: e.target.value })}
                                placeholder="e.g. Amazon"
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label><User size={14} /> Username / Email</label>
                            <input
                                type="text"
                                value={form.username || ''}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="input-field full-width">
                            <label><Lock size={14} /> Password *</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    required
                                />
                                <div className="input-actions">
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button type="button" className="gen-btn" onClick={generatePassword} title="Generate Password">
                                        <RefreshCw size={18} />
                                    </button>
                                </div>
                            </div>
                            {/* Simple Strength Meter */}
                            <div className="strength-meter">
                                <div className={`bar ${form.password.length > 10 ? 'strong' : form.password.length > 5 ? 'medium' : 'weak'}`}></div>
                            </div>
                        </div>

                        <div className="input-field full-width">
                            <label><Notebook size={14} /> Private Notes</label>
                            <textarea
                                value={form.notes || ''}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="Secret hints, backup codes, etc..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? <div className="spinner-small"></div> : (
                                <>{credential ? 'Save Changes' : 'Secure Entry'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};