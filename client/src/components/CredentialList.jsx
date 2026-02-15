import React, { useState } from 'react';
import {
    ExternalLink, Copy, Eye, EyeOff, Edit3, Trash2,
    Globe, User, Lock, StickyNote, Shield
} from 'lucide-react';
import './CredentialList.css';

export const CredentialList = ({ credentials, onEdit, onDelete, onAdd, searchQuery = '' }) => {
    const [showPassword, setShowPassword] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    const filtered = credentials.filter(c =>
        c.websiteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const togglePasswordShow = (id) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="credential-list-container">
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <Shield size={56} />
                    </div>
                    <h3 className="empty-title">
                        {credentials.length === 0 ? 'Your vault is empty' : 'No credentials found'}
                    </h3>
                    <p className="empty-subtitle">
                        {credentials.length === 0 
                            ? 'Start by adding your first secure password entry'
                            : 'Try adjusting your search terms'}
                    </p>
                    {credentials.length === 0 && (
                        <button onClick={onAdd} className="empty-btn">
                            <span>Add First Credential</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="vault-grid">
                    {filtered.map(cred => (
                        <div key={cred._id} className="credential-card">
                            {/* Card Header */}
                            <div className="card-header">
                                <div className="site-info">
                                    <div className="site-icon">
                                        {cred.websiteName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="site-details">
                                        <h3>{cred.websiteName}</h3>
                                        {cred.websiteUrl && (
                                            <a 
                                                href={cred.websiteUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="site-url"
                                            >
                                                {new URL(cred.websiteUrl).hostname}
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button 
                                        className="action-btn edit" 
                                        onClick={() => onEdit(cred)}
                                        title="Edit credential"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button 
                                        className="action-btn delete" 
                                        onClick={() => onDelete(cred._id)}
                                        title="Delete credential"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="card-content">
                                {/* Username */}
                                <div className="data-row">
                                    <div className="data-label">
                                        <User size={14} />
                                        <span>Username</span>
                                    </div>
                                    <div className="data-value-wrapper">
                                        <span className="data-value">{cred.username || '—'}</span>
                                        {cred.username && (
                                            <button 
                                                className={`copy-btn ${copiedId === `user-${cred._id}` ? 'copied' : ''}`}
                                                onClick={() => copyToClipboard(cred.username, `user-${cred._id}`)}
                                                title="Copy username"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="data-row">
                                    <div className="data-label">
                                        <Lock size={14} />
                                        <span>Password</span>
                                    </div>
                                    <div className="data-value-wrapper">
                                        <span className="data-value password-field">
                                            {showPassword[cred._id] ? cred.password : '••••••••'}
                                        </span>
                                        <button 
                                            className="action-icon"
                                            onClick={() => togglePasswordShow(cred._id)}
                                            title={showPassword[cred._id] ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword[cred._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button 
                                            className={`copy-btn ${copiedId === `pass-${cred._id}` ? 'copied' : ''}`}
                                            onClick={() => copyToClipboard(cred.password, `pass-${cred._id}`)}
                                            title="Copy password"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Notes */}
                                {cred.notes && (
                                    <div className="notes-section">
                                        <div className="notes-header">
                                            <StickyNote size={14} />
                                            <span>Notes</span>
                                        </div>
                                        <p className="notes-text">{cred.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="card-footer">
                                <span>Updated {new Date(cred.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
