import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
            toast.error('Please upload a valid CSV file');
            return;
        }
        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await axios.post('http://localhost:5000/users/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Users imported successfully!');
            setFile(null);
            // Reset the file input so the same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            if (!error.response) {
                toast.error('Server Unreachable. Is the backend running?');
            } else {
                toast.error(error.response?.data?.message || 'Error importing users');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div
                className={`relative group flex flex-col items-center justify-center w-full h-56 sm:h-72 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out overflow-hidden backdrop-blur-sm
          ${dragActive
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/80 to-violet-50/60 scale-[1.02] shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-200/50'
                        : 'border-slate-300 bg-white/90 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/50 hover:to-violet-50/30 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10'
                    }
          ${file ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 ring-2 ring-emerald-200/50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.3)_1px,_transparent_0)] bg-[length:24px_24px]"></div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".csv"
                    onChange={handleChange}
                    disabled={uploading}
                />

                {file ? (
                    <div className="z-20 text-center p-8 w-full relative">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-emerald-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-2xl shadow-xl border-2 border-emerald-200">
                                <FileText className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-3 border-white shadow-lg animate-bounce">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-8">
                            <p className="text-slate-900 font-bold text-xl truncate max-w-[85%] mx-auto tracking-tight">{file.name}</p>
                            <div className="flex items-center justify-center gap-3 text-slate-500 text-sm font-medium">
                                <span className="px-2 py-1 bg-slate-100 rounded-lg">{(file.size / 1024).toFixed(2)} KB</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-semibold">CSV Document</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={(e) => { e.preventDefault(); removeFile(); }}
                                className="px-6 py-3 text-sm font-semibold text-rose-600 bg-white border-2 border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all shadow-md hover:shadow-lg relative z-30 disabled:opacity-50"
                                disabled={uploading}
                            >
                                <X className="w-4 h-4 inline mr-1.5" />
                                Remove
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); handleUpload(); }}
                                disabled={uploading}
                                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-80 disabled:cursor-not-allowed relative z-30 flex items-center gap-2 group transform hover:scale-105"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Importing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                        <span>Import Users</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-8 pointer-events-none relative z-20">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 p-6 rounded-3xl inline-block group-hover:from-indigo-200 group-hover:to-violet-200 group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <Upload className="w-12 h-12 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                            Drop your CSV file here
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-base text-slate-600 mb-2">
                            <span className="font-medium">or</span>
                            <span className="text-indigo-600 font-bold underline decoration-2 decoration-indigo-200 underline-offset-4 group-hover:decoration-indigo-400 group-hover:text-indigo-700 transition-all">
                                browse to upload
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-4 font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                            Supports .csv files only
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-300"></span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
