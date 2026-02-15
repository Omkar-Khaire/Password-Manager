import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Plus, Search, User, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';
import { useTheme } from '../context/ThemeContext';
import { CredentialList } from '../components/CredentialList';
import { CredentialModal } from '../components/CredentialModal';
import './Dashboard.css';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const { credentials, loading, addCredential, updateCredential, deleteCredential } = useCredentials();
    const { isDark, toggleTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [editingCredential, setEditingCredential] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-clear toast messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleAddClick = () => {
        setEditingCredential(null);
        setShowModal(true);
    };

    const handleEditClick = (credential) => {
        setEditingCredential(credential);
        setShowModal(true);
    };

    const handleSave = async (data) => {
        setActionLoading(true);
        try {
            if (editingCredential) {
                await updateCredential(editingCredential._id, data);
                setMessage({ type: 'success', text: 'Credential updated successfully' });
            } else {
                await addCredential(data);
                setMessage({ type: 'success', text: 'New credential secured' });
            }
            setShowModal(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this credential?')) return;
        try {
            await deleteCredential(id);
            setMessage({ type: 'success', text: 'Credential removed' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="dashboard-wrapper">
            {/* Toast Notification */}
            {message && (
                <div className={`toast-message ${message.type}`}>
                    <div className="toast-content">
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)} className="toast-close">×</button>
                    </div>
                </div>
            )}

            {/* Sidebar Navigation */}
            <nav className={`side-nav ${sidebarOpen ? 'open' : ''}`}>
                <div className="nav-header">
                    <div className="nav-logo">
                        <div className="logo-icon-wrapper">
                            <Shield className="logo-icon" size={24} />
                        </div>
                        <div className="logo-text">
                            <span className="logo-name">SecureVault</span>
                            <span className="logo-subtitle">Password Manager</span>
                        </div>
                    </div>
                    <button 
                        className="sidebar-close-btn md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="nav-user-section">
                    <div className="user-avatar">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="user-info">
                        <p className="u-name">{user?.name || 'User'}</p>
                        <p className="u-status">Premium Account</p>
                    </div>
                </div>

                <div className="nav-actions">
                    <button className="nav-theme-btn" onClick={toggleTheme} title="Toggle Theme">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{isDark ? 'Light' : 'Dark'}</span>
                    </button>

                    <button className="nav-logout" onClick={logout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="dashboard-content">
                <header className="content-header">
                    <div className="header-left">
                        <button 
                            className="sidebar-toggle-btn md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="page-title">Your Vault</h1>
                    </div>

                    <div className="header-controls">
                        <div className="search-bar">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search credentials..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn-primary" onClick={handleAddClick}>
                            <Plus size={18} />
                            <span>Add New</span>
                        </button>
                    </div>
                </header>

                <section className="vault-section">
                    <div className="section-header">
                        <div>
                            <h2>Stored Credentials</h2>
                            <p className="section-desc">Manage and secure your passwords</p>
                        </div>
                        <div className="count-badge">{credentials.length}</div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="pulse-loader"></div>
                            <p>Decrypting vault...</p>
                        </div>
                    ) : (
                        <CredentialList
                            credentials={credentials}
                            onAdd={handleAddClick}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                            searchQuery={searchQuery}
                        />
                    )}
                </section>
            </main>

            {showModal && (
                <CredentialModal
                    credential={editingCredential}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};
