import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2, ChevronsLeft, ChevronsRight } from 'lucide-react';

const UserTable = ({ refreshTrigger }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/users?page=${page}&limit=${limit}`);
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

    const handlePrev = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden ring-1 ring-slate-100">
            {/* Table Header / Toolbar */}
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-2.5 rounded-xl border border-indigo-100/50">
                        <span className="text-2xl">👥</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                            Imported Database
                        </h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Total Records: <span className="text-indigo-600 font-bold">{totalUsers}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wide">Show:</span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-white border text-xs font-bold border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 px-3 outline-none shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
                    >
                        <option value={10}>10 rows</option>
                        <option value={20}>20 rows</option>
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/80">
                            <th className="px-6 py-4 w-20 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                                        <span className="text-slate-500 font-medium text-sm">Fetching user records...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-70 mb-4">
                                        <span className="text-5xl mb-4">📂</span>
                                        <h3 className="text-slate-900 font-semibold text-lg">No records found</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Upload a CSV file to populate the database and view users here.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => {
                                const srNo = (page - 1) * limit + index + 1;
                                return (
                                    <tr key={user._id} className="hover:bg-slate-50/80 transition-all duration-150 group">
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors bg-slate-100 group-hover:bg-indigo-50 rounded-md px-2 py-1">{srNo}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                                                    {user.first_name} {user.last_name}
                                                </span>
                                                <a href={`mailto:${user.email}`} className="text-xs text-slate-500 hover:text-indigo-500 hover:underline transition-colors mt-0.5 truncate">
                                                    {user.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                {user.company_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                                    📞 {user.phone1}
                                                </span>
                                                {user.phone2 && <span className="text-[10px] text-slate-400 ml-5">{user.phone2}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                📍 {user.city}, {user.state}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-800">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-800">{Math.min(page * limit, totalUsers)}</span> of <span className="font-bold text-slate-800">{totalUsers}</span>
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1 || loading}
                        className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                        title="First Page"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handlePrev}
                        disabled={page === 1 || loading}
                        className="flex items-center px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                    >
                        Previous
                    </button>

                    <div className="flex items-center gap-1 mx-1">
                        <span className="text-xs font-bold text-slate-400">Page</span>
                        <div className="bg-white border border-slate-200 rounded-md w-8 h-8 flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm">
                            {page}
                        </div>
                        <span className="text-xs font-bold text-slate-400">of {totalPages || 1}</span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={page === totalPages || loading}
                        className="flex items-center px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                    >
                        Next
                    </button>

                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages || loading}
                        className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
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
