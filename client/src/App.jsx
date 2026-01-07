import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Users, LayoutDashboard, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import UserTable from './components/UserTable';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900 font-sans pb-20 relative selection:bg-indigo-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e293b',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '1rem',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Enhanced Background Gradients with Animation */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob animation-delay-6000"></div>
      </div>

      {/* Enhanced Header with Glassmorphism */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-lg shadow-slate-900/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
              <LayoutDashboard className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">User Directory</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 backdrop-blur-sm rounded-full border border-emerald-200/60 shadow-md shadow-emerald-500/10">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Better Spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 space-y-16">

        {/* Hero / Upload Section */}
        <section className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100/80 rounded-full border border-indigo-200/60 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">CSV Import System</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 animate-gradient">User Records</span>
            </h2>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Efficiently import, view, and manage user data with our secure CSV ingestion system. Built for speed and simplicity.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </section>

        {/* Data Display Section */}
        <section className="animate-fade-in-up animation-delay-200">
          <UserTable 
            refreshTrigger={refreshKey} 
            onDataChange={() => setRefreshKey(prev => prev + 1)}
          />
        </section>

      </main>
    </div>
  );
}

export default App;
