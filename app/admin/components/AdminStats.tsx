'use client';

import React from 'react';
import {
    DocumentFolder24Regular,
    People24Regular,
    Money24Regular,
    Clock24Regular,
    Clock16Regular,
    CheckmarkCircle16Regular,
    DismissCircle16Regular
} from '@fluentui/react-icons';

interface Submission {
    id: string;
    created_at: string;
    people: Array<{ name: string; mobile: string }>;
    amount: number;
    screenshot_url: string;
    status: string;
}

interface AdminStatsProps {
    submissions: Submission[];
}

export default function AdminStats({submissions}: AdminStatsProps) {
    const totalSubmissions = submissions.length;

    const totalAttendees = submissions.reduce(
        (acc, curr) => acc + (curr.people?.length || 0),
        0
    );

    const verifiedSubmissions = submissions.filter(s => s.status === 'verified');
    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    const cancelledSubmissions = submissions.filter(s => s.status === 'cancelled');

    const verifiedAttendees = verifiedSubmissions.reduce(
        (acc, curr) => acc + (curr.people?.length || 0),
        0
    );
    const pendingAttendees = pendingSubmissions.reduce(
        (acc, curr) => acc + (curr.people?.length || 0),
        0
    );
    const cancelledAttendees = cancelledSubmissions.reduce(
        (acc, curr) => acc + (curr.people?.length || 0),
        0
    );

    const totalVerifiedRevenue = verifiedSubmissions.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const totalPendingRevenue = pendingSubmissions.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const renderStatusDetails = (pending: number, verified: number, cancelled: number) => (
        <div className="flex items-center gap-2 mt-1.5">
            <span
                className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50/60 px-1.5 py-0.5 rounded-lg font-bold border border-amber-100/60">
                <Clock16Regular className="w-3.5 h-3.5 shrink-0"/>
                {pending}
            </span>
            <span
                className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50/60 px-1.5 py-0.5 rounded-lg font-bold border border-emerald-100/60">
                <CheckmarkCircle16Regular className="w-3.5 h-3.5 shrink-0"/>
                {verified}
            </span>
            <span
                className="flex items-center gap-1.5 text-[11px] text-rose-600 bg-rose-50/60 px-1.5 py-0.5 rounded-lg font-bold border border-rose-100/60">
                <DismissCircle16Regular className="w-3.5 h-3.5 shrink-0"/>
                {cancelled}
            </span>
        </div>
    );

    const stats = [
        {
            title: 'Total Submissions',
            value: totalSubmissions,
            detail: renderStatusDetails(pendingSubmissions.length, verifiedSubmissions.length, cancelledSubmissions.length),
            icon: DocumentFolder24Regular,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50 border-blue-100',
        },
        {
            title: 'Total Attendees',
            value: totalAttendees,
            detail: renderStatusDetails(pendingAttendees, verifiedAttendees, cancelledAttendees),
            icon: People24Regular,
            iconColor: 'text-amber-600',
            bgColor: 'bg-amber-50 border-amber-100',
        },
        {
            title: 'Revenue Collected',
            value: `₹${totalVerifiedRevenue.toLocaleString()}`,
            detail: (
                <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500 font-bold">
                    <Clock16Regular className="w-3.5 h-3.5 text-amber-500 shrink-0"/>
                    <span>+ ₹{totalPendingRevenue.toLocaleString()} pending verification</span>
                </div>
            ),
            icon: Money24Regular,
            iconColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50 border-emerald-100',
        },
        {
            title: 'Pending Approvals',
            value: pendingSubmissions.length,
            detail: 'Awaiting verification',
            icon: Clock24Regular,
            iconColor: 'text-rose-600',
            bgColor: 'bg-rose-50 border-rose-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={idx}
                        className="p-6 rounded-3xl border border-stone-150 bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-stone-500">{stat.title}</span>
                            <div
                                className={`p-2.5 rounded-2xl ${stat.bgColor.split(' ')[0]} ${stat.iconColor} border ${stat.bgColor.split(' ')[1]}`}>
                                <IconComponent className="w-6 h-6 shrink-0"/>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                                {stat.value}
                            </h3>
                            <div className="text-xs text-stone-500 mt-1 font-medium">{stat.detail}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
