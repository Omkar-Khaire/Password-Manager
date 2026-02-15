import React, { useState } from 'react';
import {
    ExternalLink, Copy, Eye, EyeOff, Edit3, Trash2,
    Plus, Search, Globe, User, ShieldUser, StickyNote
} from 'lucide-react';
import './CredentialList.css';

export const CredentialList = ({ credentials, onEdit, onDelete, onAdd }) => {
    const [search, setSearch] = useState('');
    const [showPassword, setShowPassword] = useState({});

    const filtered = credentials.filter(c =>
        c.websiteName.toLowerCase().includes(search.toLowerCase())
    );

    const togglePasswordShow = (id) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Toast logic here
    };

    return (
        <div className="vault-container max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header Controls */}
            <div className="vault-controls flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="search-wrapper relative w-full md:w-96">
                    <Search size={18} className="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Search credentials..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

            </div>

            {filtered.length === 0 ? (
                <div className="empty-state-container flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="empty-icon mb-4 p-4 bg-gray-100 rounded-full text-gray-400">
                        <ShieldUser size={48} />
                    </div>
                    <p className="text-lg font-medium">{credentials.length === 0 ? 'Your vault is empty.' : 'No matching results found.'}</p>
                    {credentials.length === 0 && (
                        <button onClick={onAdd} className="btn mt-4 text-blue-600 hover:underline font-medium">
                            Create your first entry
                        </button>
                    )}
                </div>
            ) : (
                <div className="vault-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(cred => (
                        <div key={cred._id} className="vault-card group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                            {/* Card Accent Top */}
                            <div className="card-accent h-1.5 w-full bg-blue-500 group-hover:bg-blue-600 transition-colors" />

                            <div className="card-main-header p-5 flex items-start justify-between border-b border-gray-50">
                                <div className="site-info flex gap-4">
                                    <div className="site-avatar h-12 w-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl font-bold text-xl">
                                        {cred.websiteName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{cred.websiteName}</h3>
                                        {cred.websiteUrl && (
                                            <a href={cred.websiteUrl} target="_blank" rel="noopener noreferrer" className="site-link flex items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition-colors">
                                                {new URL(cred.websiteUrl).hostname} <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="action-cluster flex gap-1">
                                    <button className="icon-btn edit p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" onClick={() => onEdit(cred)}>
                                        <Edit3 size={16} />
                                    </button>
                                    <button className="icon-btn delete p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" onClick={() => onDelete(cred._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="card-body p-5 space-y-4 flex-grow">
                                {/* Username Row */}
                                <div className="data-row flex items-center gap-3">
                                    <User size={16} className="row-icon text-gray-400" />
                                    <div className="flex-grow flex flex-col">
                                        <span className="label text-[10px] uppercase tracking-wider text-gray-400 font-bold">Username</span>
                                        <span className="value text-gray-700 font-medium truncate max-w-[150px]">{cred.username || '—'}</span>
                                    </div>
                                    {cred.username && (
                                        <button className="mini-copy p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md" onClick={() => copyToClipboard(cred.username)}>
                                            <Copy size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Password Row */}
                                <div className="data-row flex items-center gap-3">
                                    <ShieldUser size={16} className="row-icon text-gray-400" />
                                    <div className="flex-grow flex flex-col">
                                        <span className="label text-[10px] uppercase tracking-wider text-gray-400 font-bold">Password</span>
                                        <span className="value monospace font-mono text-gray-700 tracking-wider">
                                            {showPassword[cred._id] ? cred.password : '••••••••'}
                                        </span>
                                    </div>
                                    <div className="row-actions flex gap-1">
                                        <button className="mini-btn p-1.5 text-gray-400 hover:text-blue-600" onClick={() => togglePasswordShow(cred._id)}>
                                            {showPassword[cred._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button className="mini-btn p-1.5 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md" onClick={() => copyToClipboard(cred.password)}>
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                {cred.notes && (
                                    <div className="notes-preview mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2">
                                        <StickyNote size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 line-clamp-2 italic">{cred.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer px-5 py-3 bg-gray-50 text-[10px] text-gray-400 font-medium uppercase tracking-widest border-t border-gray-100">
                                Last Updated: {new Date(cred.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};