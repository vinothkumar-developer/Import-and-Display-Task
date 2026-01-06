import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
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
            toast.error(error.response?.data?.message || 'Error importing users');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div
                className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-300 bg-white hover:bg-slate-50'}
          ${file ? 'border-green-500 bg-green-50' : ''}
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
                    <div className="z-20 text-center p-4 w-full">
                        <div className="flex items-center justify-center mb-3">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FileText className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <p className="text-slate-900 font-medium text-lg truncate max-w-[90%] mx-auto">{file.name}</p>
                        <p className="text-slate-500 text-sm mb-4">{(file.size / 1024).toFixed(2)} KB</p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={(e) => { e.preventDefault(); removeFile(); }}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors z-30 relative"
                                disabled={uploading}
                            >
                                Remove
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); handleUpload(); }}
                                disabled={uploading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors z-30 relative flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Import Users
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <div className="flex items-center justify-center mb-3">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-lg font-medium text-slate-700 mb-1">
                            Drop your CSV file here
                        </p>
                        <p className="text-sm text-slate-500">
                            or click to browse
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
