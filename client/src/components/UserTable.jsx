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
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-slate-50 to-white gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Imported Users
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage and view your customer database</p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">Rows per page:</span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-16 text-center">Sr. No</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Location</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center animate-pulse">
                                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                                        <span className="text-slate-400 font-medium">Loading records...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center text-slate-400 italic">
                                    No users found. Upload a CSV to get started.
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => {
                                const srNo = (page - 1) * limit + index + 1;
                                return (
                                    <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-center font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
                                            {srNo}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                {user.first_name} {user.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {user.company_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${user.email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                                                {user.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-slate-700 font-medium">{user.phone1}</div>
                                            <div className="text-xs text-slate-400">{user.phone2}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                {user.city}, {user.state}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500 font-medium">
                    Showing <span className="text-slate-900">{(page - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(page * limit, totalUsers)}</span> of <span className="text-slate-900">{totalUsers}</span> entries
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1 || loading}
                        className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        title="First Page"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handlePrev}
                        disabled={page === 1 || loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>

                    <div className="flex items-center gap-1 mx-2 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-sm text-slate-600">Page</span>
                        <span className="text-sm font-bold text-blue-600">{page}</span>
                        <span className="text-sm text-slate-400">/</span>
                        <span className="text-sm font-medium text-slate-600">{totalPages || 1}</span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={page === totalPages || loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>

                    <button
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages || loading}
                        className="p-2 text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
