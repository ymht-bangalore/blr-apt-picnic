'use client';

import React from 'react';
import {Location20Regular} from '@fluentui/react-icons';
import {publicConfig} from '@/lib/publicConfig';

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

interface PickupPointStatsProps {
    submissions: Submission[];
}

export default function PickupPointStats({submissions}: PickupPointStatsProps) {
    const pickupPoints = publicConfig.pickupPoints;

    // 1. Filter verified submissions
    const verifiedSubmissions = submissions.filter(s => s.status === 'verified');

    // 2. Count attendees for each pickup point
    const counts = verifiedSubmissions.reduce((acc, sub) => {
        const point = sub.pickup_point || 'Self';
        acc[point] = (acc[point] || 0) + (sub.people?.length || 0);
        return acc;
    }, {} as Record<string, number>);

    // Total verified attendees
    const totalVerifiedAttendees = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return (
        <div className="bg-white rounded-2xl border border-stone-150 p-4 shadow-sm animate-scale-up">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2 mb-2">
                <div className="flex items-center gap-2">
                    <Location20Regular className="text-primary w-5 h-5 shrink-0" />
                    <h2 className="text-sm font-extrabold text-stone-900 tracking-tight">
                        Pickup Point Distribution
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
                                Pickup Point
                            </th>
                            <th className="py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 text-right">
                                Mahatmas Count
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {pickupPoints.map((opt) => {
                            const count = counts[opt.name] || 0;
                            return (
                                <tr key={opt.id} className="hover:bg-stone-50/50 transition-colors">
                                    <td className="py-2 text-xs font-bold text-stone-700">
                                        {opt.name}
                                    </td>
                                    <td className="py-2 text-xs font-bold text-stone-900 text-right font-mono">
                                        {count}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
