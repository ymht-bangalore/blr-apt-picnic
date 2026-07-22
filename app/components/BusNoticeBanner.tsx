'use client';

import React from 'react';
import {publicConfig} from '@/lib/publicConfig';
import {Info24Filled, Warning24Filled} from '@fluentui/react-icons';

interface BusNoticeBannerProps {
    className?: string;
}

export default function BusNoticeBanner({className = ''}: BusNoticeBannerProps) {
    const {busNotice} = publicConfig;

    if (!publicConfig.busRegistrationClosed || !busNotice) {
        return null;
    }

    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-amber-600/15 border border-amber-300/70 rounded-2xl p-5 sm:p-7 shadow-sm mb-6 backdrop-blur-xs transition-all duration-300 hover:shadow-md animate-scale-up ${className}`}
        >
            {/* Background Decorative Element */}
            <div
                className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"/>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 relative z-10">
                {/* Visual Icon Badge */}
                <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-700 shrink-0 shadow-inner">
                    <Warning24Filled className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 animate-pulse"/>
                </div>

                <div className="flex-1 space-y-2.5">
                    {/* Header & Status Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping"/>
                            {busNotice.badge}
                        </span>
                        <span
                            className="text-xs font-bold text-amber-800/80 bg-amber-200/50 px-2.5 py-0.5 rounded-md border border-amber-300/40">
                            Self Transport Available
                        </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight leading-snug">
                        {busNotice.title}
                    </h2>

                    <p className="text-sm text-stone-700 leading-relaxed font-medium">
                        {busNotice.message}
                    </p>

                    {/* Actionable callout inside notice */}
                    <div className="pt-1">
                        <div
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100/80 border border-amber-300/60 text-stone-850 text-xs sm:text-sm font-semibold">
                            <Info24Filled className="w-4 h-4 text-amber-700 shrink-0"/>
                            <span>{busNotice.subMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
