'use client';

import React from 'react';
import {People20Regular} from '@fluentui/react-icons';

interface Mahatma {
    name: string;
    mobile: string;
    ageGroup?: 'less-8' | 'more-8' | string;
    gender?: string;
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

interface GenderStatsProps {
    submissions: Submission[];
}

export default function GenderStats({submissions}: GenderStatsProps) {
    // 1. Filter verified submissions
    const verifiedSubmissions = submissions.filter(s => s.status === 'verified');

    // 2. Count attendees for each gender group
    let maleCount = 0;
    let femaleCount = 0;
    let unspecifiedCount = 0;

    verifiedSubmissions.forEach(sub => {
        sub.people?.forEach(person => {
            const g = (person.gender || '').trim().toLowerCase();
            if (g === 'male' || g === 'm' || g === 'boy' || g === 'b' || g === 'gents' || g === 'gent') {
                maleCount++;
            } else if (g === 'female' || g === 'f' || g === 'girl' || g === 'g' || g === 'ladies' || g === 'lady') {
                femaleCount++;
            } else {
                unspecifiedCount++;
            }
        });
    });

    const totalVerifiedAttendees = maleCount + femaleCount + unspecifiedCount;

    return (
        <div className="bg-white rounded-2xl border border-stone-150 p-4 shadow-sm animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <People20Regular className="text-primary w-5 h-5 shrink-0"/>
                    <h2 className="text-sm font-extrabold text-stone-900 tracking-tight">
                        Gender Distribution
                    </h2>
                </div>
                <span
                    className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Total: {totalVerifiedAttendees}
                </span>
            </div>

            {/* Simple Tabular Layout */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-stone-100">
                        <th className="py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Gender
                        </th>
                        <th className="py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">
                            Verified Count
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                    <tr className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-2 text-xs font-bold text-stone-700">
                            Male
                        </td>
                        <td className="py-2 text-xs font-bold text-stone-900 text-right font-mono">
                            {maleCount}
                        </td>
                    </tr>
                    <tr className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-2 text-xs font-bold text-stone-700">
                            Female
                        </td>
                        <td className="py-2 text-xs font-bold text-stone-900 text-right font-mono">
                            {femaleCount}
                        </td>
                    </tr>
                    {unspecifiedCount > 0 && (
                        <tr className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-2 text-xs font-bold text-stone-400 italic">
                                Unknown
                            </td>
                            <td className="py-2 text-xs font-bold text-stone-500 text-right font-mono">
                                {unspecifiedCount}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
