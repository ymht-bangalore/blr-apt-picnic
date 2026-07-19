'use client';

import React from 'react';
import {People20Regular} from '@fluentui/react-icons';

interface Mahatma {
    name: string;
    mobile: string;
    ageGroup?: 'less-8' | 'more-8' | string;
}

interface Submission {
    id: string;
    created_at: string;
    people: Mahatma[];
    amount: number;
    screenshot_url: string;
    status: string;
    pickup_point?: string;
}

interface AgeStatsProps {
    submissions: Submission[];
}

export default function AgeStats({submissions}: AgeStatsProps) {
    // 1. Filter verified submissions
    const verifiedSubmissions = submissions.filter(s => s.status === 'verified');

    // 2. Count attendees for each age group
    let adultCount = 0;
    let childCount = 0;

    verifiedSubmissions.forEach(sub => {
        sub.people?.forEach(person => {
            if (person.ageGroup === 'less-8') {
                childCount++;
            } else {
                adultCount++;
            }
        });
    });

    const totalVerifiedAttendees = adultCount + childCount;

    return (
        <div className="bg-white rounded-2xl border border-stone-150 p-4 shadow-sm animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <People20Regular className="text-primary w-5 h-5 shrink-0" />
                    <h2 className="text-sm font-extrabold text-stone-900 tracking-tight">
                        Age Group Distribution
                    </h2>
                </div>
                <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Total: {totalVerifiedAttendees}
                </span>
            </div>

            {/* Simple Tabular Layout */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-stone-100">
                            <th className="py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                Age Group
                            </th>
                            <th className="py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">
                                Mahatmas Count
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        <tr className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-2 text-xs font-bold text-stone-700">
                                Adults / Mahatmas (8+)
                            </td>
                            <td className="py-2 text-xs font-bold text-stone-900 text-right font-mono">
                                {adultCount}
                            </td>
                        </tr>
                        <tr className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-2 text-xs font-bold text-stone-700">
                                Children (Under 8)
                            </td>
                            <td className="py-2 text-xs font-bold text-stone-900 text-right font-mono">
                                {childCount}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
