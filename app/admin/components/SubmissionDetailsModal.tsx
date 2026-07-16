'use client';

import React, {useState} from 'react';
import {
    Dismiss24Regular,
    Person20Regular,
    Phone20Regular,
    Money20Regular,
    Calendar20Regular,
    Image20Regular,
    CheckmarkCircle24Filled,
    DismissCircle24Filled,
    Warning24Filled,
    Call20Filled
} from '@fluentui/react-icons';
import {publicConfig} from '@/lib/publicConfig';

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
    screenshot_url: string;
    status: string;
}

interface SubmissionDetailsModalProps {
    submission: Submission;
    onClose: () => void;
    onUpdateStatus: (id: string, newStatus: string) => Promise<void>;
    onViewScreenshot: (imageUrl: string, personName: string) => void;
}

export default function SubmissionDetailsModal({
                                                   submission,
                                                   onClose,
                                                   onUpdateStatus,
                                                   onViewScreenshot
                                               }: SubmissionDetailsModalProps) {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === submission.status) return;
        setUpdating(true);
        setError('');
        try {
            await onUpdateStatus(submission.id, newStatus);
        } catch (err: any) {
            setError(err.message || 'Failed to update status. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <CheckmarkCircle24Filled className="w-4 h-4 shrink-0 text-emerald-600"/>
            Verified
          </span>
                );
            case 'cancelled':
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">
            <DismissCircle24Filled className="w-4 h-4 shrink-0 text-red-600"/>
            Cancelled
          </span>
                );
            default:
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 animate-pulse">
            <Warning24Filled className="w-4 h-4 shrink-0 text-amber-600"/>
            Pending Verification
          </span>
                );
        }
    };

    const formattedDate = new Date(submission.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
            <div className="absolute inset-0" onClick={onClose}/>

            <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full min-h-137.5 max-h-[90vh] flex flex-col z-10 border border-stone-150 animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50/50">
                    <div>
                        <h3 className="font-extrabold text-stone-950 text-lg tracking-tight">Submission Details</h3>
                        <p className="text-xs font-mono text-stone-500 mt-1 select-all select-none">ID: {submission.id}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-xl transition-colors cursor-pointer border border-stone-200 bg-white shadow-sm"
                    >
                        <Dismiss24Regular className="w-5 h-5"/>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div
                            className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-2xl">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-stone-50 border border-stone-150 p-4 rounded-2xl text-sm">
                        <div className="space-y-1">
                            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider block">Submitted On</span>
                            <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                                <Calendar20Regular className="w-4 h-4 text-stone-400"/>
                                {formattedDate}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider block">Current Status</span>
                            <div>{getStatusBadge(submission.status)}</div>
                        </div>
                    </div>

                    {/* Admin Status Actions */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Update Verification
                            Status</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                disabled={updating}
                                onClick={() => handleStatusChange('verified')}
                                className={`py-3 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                                    submission.status === 'verified'
                                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Verify & Approve
                            </button>
                            <button
                                type="button"
                                disabled={updating}
                                onClick={() => handleStatusChange('pending')}
                                className={`py-3 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                                    submission.status === 'pending'
                                        ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Mark Pending
                            </button>
                            <button
                                type="button"
                                disabled={updating}
                                onClick={() => handleStatusChange('cancelled')}
                                className={`py-3 px-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                                    submission.status === 'cancelled'
                                        ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                                        : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
                                } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Cancel / Reject
                            </button>
                        </div>
                    </div>

                    {/* Registered Attendees */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                                Attendees ({submission.people.length})
                            </h4>
                            <span className="text-xs font-bold text-stone-500">
                Fare: ₹{publicConfig.picnicFare}/person
              </span>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {submission.people.map((person, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3.5 border border-stone-150 rounded-2xl bg-white hover:bg-stone-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div
                                                className="text-sm font-semibold text-stone-900 flex items-center gap-1">
                                                <Person20Regular className="w-4 h-4 text-stone-400"/>
                                                {person.name}
                                            </div>
                                            <div
                                                className="text-xs text-stone-500 flex flex-wrap gap-x-2 gap-y-0.5 items-center mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <Phone20Regular className="w-3.5 h-3.5 text-stone-400"/>
                                                    {person.mobile || '—'}
                                                </span>
                                                <span className="text-stone-300 select-none">•</span>
                                                <span
                                                    className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider select-none">
                                                    {person.ageGroup === 'less-8' ? 'Under 8' : 'Age 8+'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {idx === 0 && (
                                            <span
                                                className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-md border border-primary/10 select-none">
                                                Primary Contact
                                            </span>
                                        )}
                                        {person.mobile && (
                                            <a
                                                href={`tel:+91${person.mobile}`}
                                                className="p-1 text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
                                                title={`Call ${person.name} (${person.mobile})`}
                                            >
                                                <Call20Filled className="w-5 h-5 shrink-0"/>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amount and Receipt */}
                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <div className="flex items-center gap-1">
                            <Money20Regular className="w-5 h-5 text-stone-400"/>
                            <div>
                                <span className="text-xs text-stone-500 font-semibold block">Total Amount Paid</span>
                                <span className="text-xl font-black text-stone-900">₹{submission.amount}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onViewScreenshot(submission.screenshot_url, submission.people[0]?.name || 'Mahatma')}
                            className="flex items-center gap-1.5 py-2.5 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                            <Image20Regular className="w-4 h-4 shrink-0"/>
                            View Screenshot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
