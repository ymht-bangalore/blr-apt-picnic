'use client';

import React from 'react';
import {publicConfig} from '@/lib/publicConfig';
import {DismissCircle24Filled, Info24Filled} from '@fluentui/react-icons';

interface RegistrationClosedBannerProps {
    className?: string;
}

const renderWithClickablePhone = (text: string) => {
    const phoneRegex = /(\b\d{10}\b)/g;
    const parts = text.split(phoneRegex);

    return parts.map((part, index) => {
        if (/^\d{10}$/.test(part)) {
            return (
                <a
                    key={index}
                    href={`tel:${part}`}
                    className="font-bold text-rose-750 hover:text-rose-900 underline underline-offset-2 decoration-rose-400 hover:decoration-rose-700 transition-colors"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

export default function RegistrationClosedBanner({className = ''}: RegistrationClosedBannerProps) {
    const {closedNotice} = publicConfig;

    if (!publicConfig.registrationClosed || !closedNotice) {
        return null;
    }

    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br from-rose-500/10 via-red-500/5 to-rose-600/15 border border-rose-300/70 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 backdrop-blur-xs transition-all duration-300 hover:shadow-md animate-scale-up ${className}`}
        >
            {/* Background Decorative Glow */}
            <div
                className="absolute -right-8 -bottom-8 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl pointer-events-none"/>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
                {/* Visual Icon Badge */}
                <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-700 shrink-0 shadow-inner">
                    <DismissCircle24Filled className="w-8 h-8 sm:w-9 sm:h-9 text-rose-600"/>
                </div>

                <div className="flex-1 space-y-3">
                    {/* Status Pill Header */}
                    <span
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                        {closedNotice.badge}
                        </span>

                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-snug">
                        {closedNotice.title}
                    </h2>

                    <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
                        {closedNotice.message}
                    </p>

                    {/* SubMessage Notice Callout */}
                    <div className="pt-1">
                        <div
                            className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-100/70 border border-rose-200/80 text-stone-850 text-xs sm:text-sm font-semibold">
                            <Info24Filled className="w-5 h-5 text-rose-700 shrink-0"/>
                            <span>{renderWithClickablePhone(closedNotice.subMessage)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
