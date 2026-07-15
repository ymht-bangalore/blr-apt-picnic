'use client';

import React from 'react';
import {
    CheckmarkCircle48Filled,
    Calendar20Regular,
    People20Regular,
    Print20Regular,
    ArrowCounterclockwise20Regular,
    Info16Regular
} from '@fluentui/react-icons';
import {Mahatma} from '@/lib/db';
import {publicConfig} from '@/lib/publicConfig';

interface SuccessViewProps {
    registrationId: string;
    people: Mahatma[];
    amount: number;
    isDemo: boolean;
    onReset: () => void;
}

export default function SuccessView({
                                        registrationId,
                                        people,
                                        amount,
                                        isDemo,
                                        onReset
                                    }: SuccessViewProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-150 overflow-hidden animate-fade-in print:shadow-none print:border-none">
            {/* Visual Success Banner */}
            <div
                className="bg-emerald-50 border-b border-emerald-100 p-8 text-center flex flex-col items-center justify-center relative overflow-hidden print:bg-white print:border-b-2 print:border-stone-200">
                <div
                    className="absolute right-0 top-0 w-48 h-48 bg-emerald-100/30 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none print:hidden"></div>

                <div
                    className="p-3.5 rounded-full bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100 animate-bounce print:ring-0">
                    <CheckmarkCircle48Filled className="w-12 h-12"/>
                </div>

                <p className="text-sm font-bold text-emerald-800 tracking-wide uppercase mt-4">
                    Jai Satchitanand!
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                    Registration Submitted
                </h1>
                <p className="text-sm text-stone-700 mt-2 max-w-md">
                    Thank you for registering. Your details have been recorded and we will add all members to the
                    WhatsApp group soon.
                </p>

                {isDemo && (
                    <span
                        className="inline-block mt-3 bg-[#FDF7F0] border border-accent/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full print:hidden">
            Demo Registration (Saved in LocalStorage)
          </span>
                )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
                {/* Receipt Header Details */}
                <div className="grid grid-cols-2 gap-4 text-sm pb-5 border-b border-stone-200">
                    <div>
                        <span className="text-stone-600 font-bold text-xs uppercase block">Registration ID</span>
                        <span className="font-mono font-bold text-stone-900 select-all">{registrationId}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-stone-600 font-bold text-xs uppercase block">Date Registered</span>
                        <span className="font-bold text-stone-900">
              {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
              })}
            </span>
                    </div>
                </div>

                {/* Picnic Details Card */}
                <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Event Details</h3>
                    <div className="flex items-center gap-2.5 text-stone-850 text-sm">
                        <Calendar20Regular className="text-primary shrink-0"/>
                        <span>{publicConfig.title} — <strong>{publicConfig.picnicDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-stone-850 text-sm">
                        <People20Regular className="text-secondary shrink-0"/>
                        <span>{publicConfig.subtitle}</span>
                    </div>
                </div>

                {/* Registered Attendees */}
                <div>
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
                        Registered Attendees ({people.length})
                    </h3>
                    <div className="border border-stone-200 rounded-xl divide-y divide-stone-200 overflow-hidden">
                        {people.map((person, index) => (
                            <div key={index}
                                 className="flex justify-between items-center px-4 py-3 bg-white hover:bg-stone-50/30 text-sm">
                                <span className="font-bold text-stone-900">
                                    {person.name}{index === 0 ? ' (You)' : ''}
                                </span>
                                <span className="font-mono font-semibold text-stone-700">{person.mobile || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2.5">Payment
                        Summary</h3>
                    <div className="flex justify-between items-center text-sm py-1.5">
                        <span className="text-stone-700 font-semibold">Total Amount Paid</span>
                        <span className="text-lg font-black text-stone-950">₹{amount}</span>
                    </div>
                </div>

                {/* Notice Info */}
                <div
                    className="flex gap-2.5 bg-sky-50/50 border border-sky-200 text-sky-900 p-4 rounded-xl text-xs sm:text-sm leading-relaxed print:hidden">
                    <Info16Regular className="text-sky-700 shrink-0 mt-0.5"/>
                    <div>
                        <p className="font-bold">Next Steps</p>
                        <p className="mt-0.5 text-stone-700">
                            The sevarthis will verify the payment screenshot. Once verified, we will add all members to
                            the WhatsApp group. <b>Please keep this receipt handy.</b>
                        </p>
                    </div>
                </div>

                {/* Buttons (Hidden when printing) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-100 print:hidden">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-stone-200 text-stone-700 font-semibold bg-white hover:bg-stone-50 hover:text-stone-900 shadow-sm transition-all focus:ring-2 focus:ring-stone-200 cursor-pointer"
                    >
                        <Print20Regular className="shrink-0"/>
                        Print Receipt
                    </button>

                    <button
                        type="button"
                        onClick={onReset}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover shadow-sm hover:shadow transition-all focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                        <ArrowCounterclockwise20Regular className="shrink-0"/>
                        Register More People
                    </button>
                </div>
            </div>
        </div>
    );
}
