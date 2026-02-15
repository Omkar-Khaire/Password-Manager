import React, { createContext, useState, useCallback, useEffect } from 'react';

const CredentialContext = createContext();

export const CredentialProvider = ({ children }) => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/credentials', { credentials: 'include' });
      if (!res.ok) throw new Error('Fetch failed');
      const { credentials: creds } = await res.json();
      setCredentials(creds);
    } catch (err) {
      console.error('Fetch credentials error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount if user logged in (handled in parent)
  useEffect(() => {
    fetchCredentials();
  }, []);

  const addCredential = useCallback(async (data) => {
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Add failed');
    const { credential } = await res.json();
    setCredentials(prev => [...prev, credential]);
    return credential;
  }, []);

  const updateCredential = useCallback(async (id, data) => {
    const res = await fetch(`/api/credentials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
    const { credential } = await res.json();
    setCredentials(prev => prev.map(c => c._id === id ? credential : c));
    return credential;
  }, []);

  const deleteCredential = useCallback(async (id) => {
    const res = await fetch(`/api/credentials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
    setCredentials(prev => prev.filter(c => c._id !== id));
  }, []);

  return (
    <CredentialContext.Provider value={{ credentials, loading, addCredential, updateCredential, deleteCredential, fetchCredentials }}>
      {children}
    </CredentialContext.Provider>
  );
};

export const useCredentials = () => {
  const context = React.useContext(CredentialContext);
  if (!context) throw new Error('useCredentials must be used within CredentialProvider');
  return context;
};