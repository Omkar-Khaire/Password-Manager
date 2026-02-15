import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CredentialProvider } from './context/CredentialContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Loader2 } from 'lucide-react'; // Adding a nicer loader icon
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
        <p className="font-medium tracking-wide">Unlocking Vault...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 selection:bg-blue-100">
      
      {/* --- MODERN MESH BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Right Ambient Glow */}
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px]" />
        
        {/* Bottom Left Ambient Glow */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px]" />
        
        {/* Subtle Micro-Grid Overlay for a "Tech" feel */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-multiply" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23000'/%3E%3C/svg%3E")` }} 
        />
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
    <AuthProvider>
      <CredentialProvider>
        <AppContent />
      </CredentialProvider>
    </AuthProvider>
  );
}

export default App;