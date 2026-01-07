import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await axios.post('http://localhost:5000/api/users/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Users imported successfully!');
            setFile(null);
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
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                className={`relative group flex flex-col items-center justify-center w-full h-52 sm:h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out overflow-hidden
          ${dragActive
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01] shadow-xl shadow-indigo-500/10'
                        : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50/80 shadow-sm hover:shadow-md'
                    }
          ${file ? 'border-emerald-500 bg-emerald-50/30' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".csv"
                    onChange={handleChange}
                    disabled={uploading}
                />

                {file ? (
                    <div className="z-20 text-center p-6 w-full animate-fade-in-up">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-emerald-200 rounded-full blur opacity-40 animate-pulse"></div>
                            <div className="relative bg-white p-3 rounded-full shadow-md border border-emerald-100">
                                <FileText className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                                <CheckCircle className="w-3 h-3" />
                            </div>
                        </div>

                        <div className="space-y-1 mb-6">
                            <p className="text-slate-900 font-bold text-lg truncate max-w-[80%] mx-auto tracking-tight">{file.name}</p>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{(file.size / 1024).toFixed(2)} KB • CSV Document</p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={(e) => { e.preventDefault(); removeFile(); }}
                                className="px-5 py-2.5 text-sm font-semibold text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all shadow-sm relative z-30"
                                disabled={uploading}
                            >
                                Remove
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); handleUpload(); }}
                                disabled={uploading}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-80 disabled:cursor-not-allowed relative z-30 flex items-center gap-2 group"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                        Upload File
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-6 pointer-events-none">
                        <div className="bg-slate-100 p-4 rounded-full inline-block mb-4 group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <p className="text-lg font-bold text-slate-800 mb-2">
                            Drop your CSV file here
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                            <span>or</span>
                            <span className="text-indigo-600 font-semibold underline decoration-2 decoration-indigo-100 underline-offset-4 group-hover:decoration-indigo-200">browse to upload</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wide">Supports .csv files only</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
