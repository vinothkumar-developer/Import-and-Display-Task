import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2, ChevronsLeft, ChevronsRight, Search, Users as UsersIcon, Filter, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserTable = ({ refreshTrigger, onDataChange }) => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [clearing, setClearing] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch all users for search functionality
            const allResponse = await axios.get(`http://localhost:5000/users?page=1&limit=10000`);
            setAllUsers(allResponse.data.users || []);
            
            // Fetch paginated users
            const response = await axios.get(`http://localhost:5000/users?page=${page}&limit=${limit}`);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setTotalUsers(response.data.totalUsers);
            // Ensure we don't get stuck on an empty page if limit changes
            if (response.data.currentPage > response.data.totalPages && response.data.totalPages > 0) {
                setPage(response.data.totalPages);
            } else {
                setPage(response.data.currentPage);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, refreshTrigger]);

    // Filter users based on search query
    const filteredUsers = searchQuery.trim() === '' 
        ? users 
        : allUsers.filter(user => {
            const query = searchQuery.toLowerCase();
            return (
                user.first_name?.toLowerCase().includes(query) ||
                user.last_name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.company_name?.toLowerCase().includes(query) ||
                user.city?.toLowerCase().includes(query) ||
                user.state?.toLowerCase().includes(query) ||
                user.phone1?.includes(query)
            );
        }).slice((page - 1) * limit, page * limit);

    const displayUsers = searchQuery.trim() === '' ? users : filteredUsers;
    const displayTotal = searchQuery.trim() === '' ? totalUsers : allUsers.length;
    const displayTotalPages = searchQuery.trim() === '' ? totalPages : Math.ceil(allUsers.length / limit);

    const handleClearDatabase = async () => {
        if (!window.confirm('Are you sure you want to clear all users from the database? This action cannot be undone.')) {
            return;
        }

        setClearing(true);
        try {
            await axios.delete('http://localhost:5000/users');
            toast.success('Database cleared successfully!');
            // Reset state
            setUsers([]);
            setAllUsers([]);
            setTotalUsers(0);
            setTotalPages(1);
            setPage(1);
            setSearchQuery('');
            // Refresh the data
            await fetchUsers();
            // Notify parent component if callback provided
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            console.error("Error clearing database", error);
            if (!error.response) {
                toast.error('Server Unreachable. Is the backend running?');
            } else {
                toast.error(error.response?.data?.message || 'Error clearing database');
            }
        } finally {
            setClearing(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    return (
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden ring-1 ring-slate-100/50">
            {/* Enhanced Table Header / Toolbar */}
            <div className="px-6 sm:px-8 py-6 border-b border-slate-200/60 bg-gradient-to-r from-white via-indigo-50/30 to-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <UsersIcon className="w-6 h-6 text-white" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
                                User Database
                                {searchQuery && (
                                    <span className="text-xs font-normal text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                        Filtered
                                    </span>
                                )}
                            </h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Total Records: <span className="text-indigo-600 font-bold text-base">{displayTotal}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 sm:flex-initial sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm hover:border-indigo-300 transition-all placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="text-xs">✕</span>
                                </button>
                            )}
                        </div>

                        {/* Rows Per Page Selector */}
                        <div className="flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-xl border border-slate-200/60">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-500 px-1 uppercase tracking-wide hidden sm:inline">Show:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="bg-white border text-xs font-bold border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 px-3 outline-none shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        {/* Clear Database Button */}
                        {displayTotal > 0 && (
                            <button
                                onClick={handleClearDatabase}
                                disabled={clearing}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-xl hover:from-rose-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-rose-100 transition-all shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                title="Clear all users from database"
                            >
                                {clearing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Clearing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden sm:inline">Clear DB</span>
                                        <span className="sm:hidden">Clear</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b-2 border-slate-200">
                            <th className="px-6 py-4 w-20 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">#</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-32 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                                            <div className="absolute inset-0 w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                                        </div>
                                        <span className="text-slate-600 font-semibold text-base mt-2">Fetching user records...</span>
                                        <span className="text-slate-400 text-sm mt-1">Please wait</span>
                                    </div>
                                </td>
                            </tr>
                        ) : displayUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-32 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
                                                <span className="text-4xl">📂</span>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <span className="text-xs">🔍</span>
                                            </div>
                                        </div>
                                        <h3 className="text-slate-900 font-bold text-xl mb-2">
                                            {searchQuery ? 'No matching records' : 'No records found'}
                                        </h3>
                                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                            {searchQuery 
                                                ? `Try adjusting your search query "${searchQuery}"`
                                                : 'Upload a CSV file to populate the database and view users here.'}
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayUsers.map((user, index) => {
                                const srNo = searchQuery.trim() === '' 
                                    ? (page - 1) * limit + index + 1 
                                    : (page - 1) * limit + index + 1;
                                return (
                                    <tr 
                                        key={user._id || index} 
                                        className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-violet-50/30 transition-all duration-200 group border-b border-slate-50"
                                    >
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors bg-slate-100 group-hover:bg-indigo-100 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                                                {srNo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-all">
                                                    {user.first_name} {user.last_name}
                                                </span>
                                                <a 
                                                    href={`mailto:${user.email}`} 
                                                    className="text-xs text-slate-500 hover:text-indigo-600 hover:underline transition-all truncate max-w-[200px] flex items-center gap-1"
                                                >
                                                    <span className="text-[10px]">✉</span>
                                                    {user.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 group-hover:from-indigo-100 group-hover:to-violet-50 group-hover:border-indigo-200 group-hover:text-indigo-700 transition-all">
                                                {user.company_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <a 
                                                    href={`tel:${user.phone1}`}
                                                    className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 flex items-center gap-2 transition-all hover:underline"
                                                >
                                                    <span className="text-[10px]">📞</span>
                                                    {user.phone1}
                                                </a>
                                                {user.phone2 && (
                                                    <span className="text-[10px] text-slate-400 ml-5 flex items-center gap-1">
                                                        <span>📱</span>
                                                        {user.phone2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px]">📍</span>
                                                <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-600 transition-all">
                                                    {user.city}, {user.state}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Pagination Footer */}
            <div className="px-6 sm:px-8 py-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 font-medium">
                        Showing <span className="font-bold text-slate-900">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-900">{Math.min(page * limit, displayTotal)}</span> of <span className="font-bold text-indigo-600">{displayTotal}</span>
                    </p>
                    {searchQuery && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                            Filtered
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1 || loading}
                        className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
                        title="First Page"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handlePrev}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2 mx-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <span className="text-xs font-semibold text-slate-400">Page</span>
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-lg w-10 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                            {page}
                        </div>
                        <span className="text-xs font-semibold text-slate-400">of {displayTotalPages || 1}</span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={page === displayTotalPages || loading}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => setPage(displayTotalPages)}
                        disabled={page === displayTotalPages || loading}
                        className="p-2.5 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-200 shadow-sm"
                        title="Last Page"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
