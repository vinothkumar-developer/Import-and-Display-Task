import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Users } from 'lucide-react';
import FileUpload from './components/FileUpload';
import UserTable from './components/UserTable';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 relative selection:bg-blue-100">
      <Toaster position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#1e293b',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.75rem',
            padding: '1rem',
          },
        }}
      />

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">DataStride</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">ENTERPRISE IMPORTER</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-green-50/50 rounded-full border border-green-100 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold tracking-wider">SYSTEM ONLINE</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 space-y-16">

        {/* Section 1: Import */}
        <section className="space-y-8 animate-fade-in-up">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Import Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">User Data</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Seamlessly ingest CSV files to populate your analytics dashboard. <br />
              Fast, secure, and ready for scale.
            </p>
          </div>
          <div className="max-w-2xl mx-auto transform transition-all hover:scale-[1.01] duration-300">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </section>

        {/* Section 2: Display */}
        <section>
          <UserTable refreshTrigger={refreshKey} />
        </section>

      </main>
    </div>
  );
}

export default App;
