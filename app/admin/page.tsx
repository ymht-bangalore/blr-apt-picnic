'use client';

import React, {useState, useEffect, startTransition} from 'react';
import {
    ArrowClockwise24Regular,
    ArrowExit24Regular,
    Search24Regular,
    Filter24Regular,
    Eye24Regular,
    ChevronRight24Regular,
    CheckmarkCircle24Filled,
    DismissCircle24Filled,
    Warning24Filled,
    ArrowDownload24Regular,
    Dismiss20Regular,
    Print24Regular,
    ArrowSort20Regular,
    ArrowSortUp20Regular,
    ArrowSortDown20Regular
} from '@fluentui/react-icons';

// Import subcomponents
import AdminLogin from './components/AdminLogin';
import AdminStats from './components/AdminStats';
import SubmissionDetailsModal from './components/SubmissionDetailsModal';
import ScreenshotModal from './components/ScreenshotModal';
import {printReceipt} from '@/lib/receipt';

interface Mahatma {
    name: string;
    mobile: string;
    ageGroup?: 'less-8' | 'more-8';
}

interface Submission {
    id: string;
    created_at: string;
    people: Mahatma[];
    amount: number;
    pickup_point?: string;
    screenshot_url: string;
    status: string;
}

export default function AdminDashboardPage() {
    const [password, setPassword] = useState<string | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Sorting state
    const [sortField, setSortField] = useState<'date' | 'name'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSort = (field: 'date' | 'name') => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder(field === 'date' ? 'desc' : 'asc');
        }
    };

    // Modal states
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<{ url: string; name: string } | null>(null);

    // 1. Session check on mount
    useEffect(() => {
        const savedPassword = sessionStorage.getItem('admin_password');
        if (savedPassword) {
            setPassword(savedPassword);
            loadData(savedPassword);
        } else {
            setIsCheckingSession(false);
        }
    }, []);

    const loadData = async (adminPassword: string) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/submissions', {
                method: 'GET',
                headers: {
                    'x-admin-password': adminPassword,
                },
            });

            if (response.status === 401) {
                // Token expired / wrong
                sessionStorage.removeItem('admin_password');
                setPassword(null);
                setError('Session expired. Please log in again.');
            } else if (response.ok) {
                const data = await response.json();
                setSubmissions(data.submissions || []);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to fetch submissions.');
            }
        } catch (err: any) {
            setError('Network error occurred. Please verify server connection.');
        } finally {
            setLoading(false);
            setIsCheckingSession(false);
        }
    };

    const handleLoginSuccess = (validPassword: string) => {
        sessionStorage.setItem('admin_password', validPassword);
        setPassword(validPassword);
        loadData(validPassword);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_password');
        setPassword(null);
        setSubmissions([]);
    };

    // Status updates
    const handleUpdateStatus = async (id: string, newStatus: string) => {
        if (!password) return;

        try {
            // Update database via API
            const response = await fetch('/api/admin/submissions', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': password,
                },
                body: JSON.stringify({id, status: newStatus}),
            });

            if (response.ok) {
                // Success, update local state
                const updatedSubmissions = submissions.map(item => {
                    if (item.id === id) {
                        return {...item, status: newStatus};
                    }
                    return item;
                });
                setSubmissions(updatedSubmissions);

                // Update selected modal submission if open
                if (selectedSubmission && selectedSubmission.id === id) {
                    setSelectedSubmission(prev => prev ? {...prev, status: newStatus} : null);
                }
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update status on server');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update status. Please try again.');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified':
                return <CheckmarkCircle24Filled className="w-5 h-5 text-emerald-600 shrink-0"/>;
            case 'cancelled':
                return <DismissCircle24Filled className="w-5 h-5 text-red-600 shrink-0"/>;
            default:
                return <Warning24Filled className="w-5 h-5 text-amber-500 shrink-0"/>;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-amber-50 text-amber-800 border-amber-100';
        }
    };

    const handleDownloadCSV = () => {
        if (filteredSubmissions.length === 0) return;

        // 1. Compile CSV rows with all attendees
        const rows: string[][] = [
            ['S.No', 'Attendee Name', 'Attendee Age Group', 'Attendee Mobile', 'Pickup Point', 'Primary Contact Name', 'Primary Contact Mobile', 'Fare Paid (₹)', 'Verification Status', 'Submission Date']
        ];

        let counter = 1;
        filteredSubmissions.forEach(sub => {
            const primaryContact = sub.people[0]?.name || 'N/A';
            const primaryMobile = sub.people[0]?.mobile || 'N/A';
            const fare = sub.amount;
            const status = sub.status.toUpperCase();
            const date = new Date(sub.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const pickupPoint = sub.pickup_point || 'Self';

            sub.people.forEach(person => {
                const ageGroupText = person.ageGroup === 'less-8'
                    ? 'Age less than 8'
                    : 'Age 8 and above';

                rows.push([
                    counter.toString(),
                    person.name,
                    ageGroupText,
                    person.mobile || '',
                    pickupPoint,
                    primaryContact,
                    primaryMobile,
                    fare.toString(),
                    status,
                    date
                ]);
                counter++;
            });
        });

        // 2. Format columns safely as valid CSV (escape quotes, handle trailing line breaks)
        const csvContent = rows
            .map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
            .join('\r\n');

        // 3. Create blob download anchor and execute click
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);

        const dateStamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `picnic_attendees_${statusFilter}_${dateStamp}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter & Search & Sort submissions
    const filteredSubmissions = submissions
        .filter((sub) => {
            const person1 = sub.people?.[0];
            const nameMatch = person1?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const phoneMatch = (person1?.mobile || '').includes(searchQuery) || false;
            const anyAttendeeMatch = sub.people?.some(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.mobile || '').includes(searchQuery)
            ) || false;

            const matchesSearch = nameMatch || phoneMatch || anyAttendeeMatch;
            const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortField === 'date') {
                const valA = new Date(a.created_at).getTime();
                const valB = new Date(b.created_at).getTime();
                return sortOrder === 'asc' ? valA - valB : valB - valA;
            } else {
                const valA = (a.people?.[0]?.name || '').trim().toLowerCase();
                const valB = (b.people?.[0]?.name || '').trim().toLowerCase();
                return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
        });

    if (isCheckingSession) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-semibold text-stone-600">Initializing Admin Session...</span>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!password) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess}/>;
    }

    return (
        <div className="flex-1 w-full flex flex-col min-h-screen">
            <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-150 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                            Registration Dashboard
                        </h1>
                        <p className="text-sm text-stone-500 mt-1">
                            Verify payments, browse attendees list, and manage Bangalore picnic registrations.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => loadData(password)}
                            disabled={loading}
                            className="p-3 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50"
                            title="Refresh Registrations"
                        >
                            <ArrowClockwise24Regular className={`w-5 h-5 shrink-0 ${loading ? 'animate-spin' : ''}`}/>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="py-3 px-5 bg-white hover:bg-stone-50 hover:text-red-700 text-stone-700 border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 flex items-center gap-2 font-bold text-sm cursor-pointer"
                        >
                            <ArrowExit24Regular className="w-5 h-5 shrink-0"/>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Panel */}
                <AdminStats submissions={submissions}/>

                {/* Filter, Search & Table Container */}
                <div className="bg-white rounded-3xl border border-stone-150 shadow-sm overflow-hidden">

                    {/* Controls Bar */}
                    <div
                        className="p-6 border-b border-stone-100 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-stone-50/30">

                        {/* Search Input */}
                        <div className="relative w-full lg:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                <Search24Regular className="w-5 h-5"/>
              </span>
                            <input
                                type="text"
                                placeholder="Search by name or mobile..."
                                value={searchQuery}
                                onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
                                className="w-full pl-12 pr-10 py-3 bg-white border border-stone-200 rounded-2xl text-sm placeholder-stone-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-150"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => startTransition(() => setSearchQuery(''))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer focus:outline-none"
                                    title="Clear search"
                                >
                                    <Dismiss20Regular className="w-4 h-4"/>
                                </button>
                            )}
                        </div>

                        {/* Middle & Right Section Container */}
                        <div
                            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-4 flex-1">

                            {/* Filter Buttons */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                                <span
                                    className="text-xs font-bold text-stone-500 flex items-center gap-1 mr-2 shrink-0">
                                    <Filter24Regular className="w-4 h-4"/>
                                    Filter status:
                                </span>
                                {[
                                    {label: 'All', value: 'all'},
                                    {label: 'Pending', value: 'pending'},
                                    {label: 'Verified', value: 'verified'},
                                    {label: 'Cancelled', value: 'cancelled'},
                                ].map((opt) => (
                                    <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => startTransition(() => setStatusFilter(opt.value))}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                            statusFilter === opt.value
                                                ? 'bg-primary border-primary text-white shadow-sm'
                                                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Selector */}
                            {/*<div className="flex items-center gap-2 shrink-0">*/}
                            {/*    <span*/}
                            {/*        className="text-xs font-bold text-stone-500 flex items-center gap-1 mr-1 shrink-0">*/}
                            {/*        <ArrowSort20Regular className="w-4 h-4 text-stone-500"/>*/}
                            {/*        Sort:*/}
                            {/*    </span>*/}
                            {/*    <select*/}
                            {/*        value={`${sortField}-${sortOrder}`}*/}
                            {/*        onChange={(e) => {*/}
                            {/*            const [field, order] = e.target.value.split('-') as ['date' | 'name', 'asc' | 'desc'];*/}
                            {/*            setSortField(field);*/}
                            {/*            setSortOrder(order);*/}
                            {/*        }}*/}
                            {/*        className="bg-white border border-stone-200 hover:bg-stone-50 rounded-xl px-3 py-2 text-xs font-bold text-stone-600 transition-all cursor-pointer focus:ring-2 focus:ring-primary/20 outline-none"*/}
                            {/*    >*/}
                            {/*        <option value="date-desc">Date (Newest First)</option>*/}
                            {/*        <option value="date-asc">Date (Oldest First)</option>*/}
                            {/*        <option value="name-asc">Name (A - Z)</option>*/}
                            {/*        <option value="name-desc">Name (Z - A)</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}

                            {/* Download CSV button */}
                            <button
                                type="button"
                                onClick={handleDownloadCSV}
                                disabled={filteredSubmissions.length === 0}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shrink-0"
                                title="Download spreadsheet of attendees matching current filter"
                            >
                                <ArrowDownload24Regular className="w-5 h-5 text-emerald-600 shrink-0"/>
                                Export CSV
                            </button>

                        </div>

                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl font-semibold flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Table / List View */}
                    <div className="overflow-x-auto">
                        {loading && submissions.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3">
                                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-xs text-stone-500 font-bold">Loading submissions...</span>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="py-20 text-center text-stone-400">
                                <span className="text-4xl block mb-3">📂</span>
                                <span className="text-sm font-semibold">No submissions found matching filters.</span>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-stone-100 text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50/50">
                                    <th
                                        className="py-4.5 px-6 cursor-pointer hover:bg-stone-100/50 transition-colors select-none group"
                                        onClick={() => handleSort('date')}
                                        title="Sort by Submit Date"
                                    >
                                        <div className="flex items-center gap-1">
                                            Submit Date
                                            {sortField === 'date' ? (
                                                sortOrder === 'asc' ? (
                                                    <ArrowSortUp20Regular className="w-4 h-4 text-primary shrink-0"/>
                                                ) : (
                                                    <ArrowSortDown20Regular className="w-4 h-4 text-primary shrink-0"/>
                                                )
                                            ) : (
                                                <ArrowSort20Regular
                                                    className="w-4 h-4 text-stone-300 group-hover:text-stone-400 shrink-0 transition-colors"/>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="py-4.5 px-6 cursor-pointer hover:bg-stone-100/50 transition-colors select-none group"
                                        onClick={() => handleSort('name')}
                                        title="Sort by Person 1 Name"
                                    >
                                        <div className="flex items-center gap-1">
                                            Person 1 (Primary)
                                            {sortField === 'name' ? (
                                                sortOrder === 'asc' ? (
                                                    <ArrowSortUp20Regular className="w-4 h-4 text-primary shrink-0"/>
                                                ) : (
                                                    <ArrowSortDown20Regular className="w-4 h-4 text-primary shrink-0"/>
                                                )
                                            ) : (
                                                <ArrowSort20Regular
                                                    className="w-4 h-4 text-stone-300 group-hover:text-stone-400 shrink-0 transition-colors"/>
                                            )}
                                        </div>
                                    </th>
                                    <th className="py-4.5 px-6 text-center">Attendees</th>
                                    <th className="py-4.5 px-6">Paid Amount</th>
                                    <th className="py-4.5 px-6">Receipt</th>
                                    <th className="py-4.5 px-6">Status</th>
                                    <th className="py-4.5 px-6 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 text-sm">
                                {filteredSubmissions.map((sub) => {
                                    const person1 = sub.people?.[0] || {name: 'Unknown', mobile: 'N/A'};
                                    const numPersons = sub.people?.length || 0;
                                    const dateStr = new Date(sub.created_at).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    });

                                    return (
                                        <tr
                                            key={sub.id}
                                            className="hover:bg-stone-50/40 transition-[background-color] group cursor-pointer"
                                            onClick={() => setSelectedSubmission(sub)}
                                        >
                                            <td className="py-4 px-6 font-medium text-stone-600">
                                                {dateStr}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-stone-900">{person1.name}</div>
                                                <div className="text-xs text-stone-400 mt-0.5">{person1.mobile}</div>
                                                <div className="mt-1.5 flex flex-wrap">
                                                    <span
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FDF1ED] text-primary px-2 py-0.5 rounded border border-primary/20 shadow-sm">
                                                        📍 {sub.pickup_point || 'Self'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className="inline-flex items-center justify-center font-bold px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-700 text-xs rounded-lg min-w-8">
                                                    {numPersons}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-extrabold text-stone-900 font-mono">
                                                ₹{sub.amount.toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                                {sub.screenshot_url ? (
                                                    <button
                                                        onClick={() => setScreenshotPreview({
                                                            url: sub.screenshot_url,
                                                            name: person1.name
                                                        })}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 transition-all cursor-pointer"
                                                    >
                                                        <Eye24Regular className="w-4 h-4 shrink-0 text-stone-500"/>
                                                        View Screenshot
                                                    </button>
                                                ) : (
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/40 rounded-lg text-[10px] font-bold text-amber-700 select-none">
                                                        <Warning24Filled
                                                            className="w-3.5 h-3.5 shrink-0 text-amber-500"/>
                                                        Pending Upload
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5">
                                                    {getStatusIcon(sub.status)}
                                                    <span
                                                        className={`px-2.5 py-0.5 text-xs font-extrabold border rounded-full ${getStatusBadgeClass(sub.status)}`}>
                                                        {sub.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => printReceipt(sub)}
                                                        className="inline-flex items-center justify-center p-2 text-stone-400 hover:text-primary hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                                                        title="Print booking receipt"
                                                    >
                                                        <Print24Regular className="w-5 h-5"/>
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedSubmission(sub)}
                                                        className="inline-flex items-center justify-center p-2 text-stone-400 group-hover:text-primary hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                                                        title="View all details"
                                                    >
                                                        <ChevronRight24Regular className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer stats check */}
                    <div className="p-4 border-t border-stone-100 bg-stone-50/20 text-center text-xs text-stone-400">
                        Showing {filteredSubmissions.length} of {submissions.length} submissions
                    </div>

                </div>

            </main>

            {/* Details Modal */}
            {selectedSubmission && (
                <SubmissionDetailsModal
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onViewScreenshot={(url, name) => setScreenshotPreview({url, name})}
                />
            )}

            {/* Screenshot Preview Modal */}
            {screenshotPreview && (
                <ScreenshotModal
                    imageUrl={screenshotPreview.url}
                    personName={screenshotPreview.name}
                    onClose={() => setScreenshotPreview(null)}
                />
            )}

        </div>
    );
}
