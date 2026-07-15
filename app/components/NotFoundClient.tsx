'use client';

import React from 'react';
import Link from 'next/link';
import {CompassNorthwest24Regular, Home24Regular} from '@fluentui/react-icons';

export default function NotFoundClient() {
    return (
        <div
            className="flex-1 min-h-screen flex flex-col items-center justify-center p-4 bg-stone-50 picnic-gradient-bg">
            <main
                className="max-w-md w-full text-center space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-150 shadow-md animate-scale-up">
                {/* Visual Icon Header */}
                <div className="flex justify-center">
                    <div
                        className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-primary ring-8 ring-primary-light/50 animate-pulse">
                        <CompassNorthwest24Regular className="w-10 h-10 animate-spin"
                                                   style={{animationDuration: '6s'}}/>
                    </div>
                </div>

                {/* Error Code & Heading */}
                <div className="space-y-2.5">
                    <span className="text-xs font-black text-primary tracking-widest uppercase">Error 404</span>
                    <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                        Lost on the way to the picnic?
                    </h1>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Jai Satchitanand! It looks like you've taken a detour or this spot isn't on our picnic map.
                    </p>
                </div>

                {/* Buttons / Actions */}
                <div className="flex flex-col gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                    >
                        <Home24Regular className="shrink-0 w-5 h-5"/>
                        Go to Registration
                    </Link>
                </div>

                {/* Lighthearted Footer */}
                <div className="pt-4 border-t border-dashed border-stone-200 text-xs text-stone-400">
                    Bengaluru Picnic Team wishes you a smooth journey!
                </div>
            </main>
        </div>
    );
}
