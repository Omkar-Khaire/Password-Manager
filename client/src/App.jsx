import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CredentialProvider } from './context/CredentialContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Loader2 } from 'lucide-react';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-600 dark:text-slate-400">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <Loader2 className="relative animate-spin text-indigo-600 dark:text-indigo-400" size={48} strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-lg tracking-wide">Unlocking Vault...</p>
        <p className="text-sm mt-2 text-slate-500 dark:text-slate-500">Enterprise-grade security at work</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 selection:bg-indigo-200 dark:selection:bg-indigo-900">
      
      {/* --- ANIMATED GRADIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-300 to-purple-300 dark:from-indigo-600 dark:to-purple-600 rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-pulse" />
        
        {/* Bottom Left Glow */}
        <div className="absolute -bottom-[20%] -left-[15%] w-[700px] h-[700px] bg-gradient-to-tr from-indigo-200 to-blue-200 dark:from-indigo-700 dark:to-blue-700 rounded-full blur-[120px] opacity-25 dark:opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Center Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 rounded-full blur-[100px] opacity-10 dark:opacity-5" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <main className="relative z-10 w-full h-full">
        {user ? <Dashboard /> : <AuthPage />}
      </main>
      
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CredentialProvider>
          <AppContent />
        </CredentialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;