import React, { useState, useEffect } from 'react';
import { Shield, LogOut, Plus, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';
import { CredentialList } from '../components/CredentialList';
import { CredentialModal } from '../components/CredentialModal';
import './Dashboard.css';

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const { credentials, loading, addCredential, updateCredential, deleteCredential } = useCredentials();
    const [showModal, setShowModal] = useState(false);
    const [editingCredential, setEditingCredential] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);

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
                setMessage({ type: 'success', text: 'Vault updated successfully' });
            } else {
                await addCredential(data);
                setMessage({ type: 'success', text: 'New login secured' });
            }
            setShowModal(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this credential permanently?')) return;
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
                    {message.text}
                </div>
            )}

            <nav className="side-nav">
                <div className="nav-logo">
                    <Shield className="logo-icon" size={32} />
                    <span>Vault.io</span>
                </div>
                <div className="nav-user">
                    <div className="avatar">{user?.name?.charAt(0) || <User />}</div>
                    <div className="user-info">
                        <p className="u-name">{user?.name}</p>
                        <p className="u-status">Pro Account</p>
                    </div>
                </div>
                <button className="nav-logout" onClick={logout}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            <main className="dashboard-content">
                <header className="content-header">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Search your vault..." />
                    </div>
                    <button className="btn-primary" onClick={handleAddClick}>
                        <Plus size={18} /> Add New
                    </button>
                </header>

                <section className="vault-section">
                    <div className="section-title">
                        <h2>Your Credentials</h2>
                        <span className="count-badge">{credentials.length}</span>
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