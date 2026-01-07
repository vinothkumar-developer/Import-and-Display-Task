import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Users, LayoutDashboard } from 'lucide-react';
import FileUpload from './components/FileUpload';
import UserTable from './components/UserTable';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 relative selection:bg-indigo-100">
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#1e293b',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid #e2e8f0',
          },
        }}
      />

      {/* Enhanced Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-200/20 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob"></div>
        <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-200/20 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-purple-200/20 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modern Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">User Directory</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50/80 backdrop-blur-sm rounded-full border border-emerald-100/50 shadow-sm">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 tracking-wide">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 space-y-12">

        {/* Hero / Upload Section */}
        <section className="space-y-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">User Records</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Efficiently import, view, and manage user data with our secure CSV ingestion system.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </section>

        {/* Data Display Section */}
        <section>
          <UserTable refreshTrigger={refreshKey} />
        </section>

      </main>
    </div>
  );
}

export default App;
