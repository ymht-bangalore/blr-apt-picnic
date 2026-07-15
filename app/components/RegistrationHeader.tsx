'use client';

import React from 'react';
import {publicConfig} from '@/lib/publicConfig';

export default function RegistrationHeader() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 overflow-hidden mb-6">
            {/* Banner Image Placeholder */}
            <div className="w-full aspect-4/1 relative overflow-hidden bg-stone-100 borderz-b borderz-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/picnic_banner.png"
                    alt="Mahatma Picnic Banner"
                    className="w-full h-full object-cover object-center animate-fade-in"
                />
            </div>

            {/* Neutral Header Title Area */}
            <div
                className="bg-stone-50/80 bg-accentx px-6 py-6 sm:px-8 sm:py-8 text-center sm:text-left border-b border-stone-200 relative">
                <span
                    className="inline-block bg-stone-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2.5">
                  {publicConfig.badgeText}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                    {publicConfig.title}
                </h1>
                <p className="text-base sm:text-lg text-stone-600 font-semibold mt-1">
                    {publicConfig.subtitle}
                </p>
            </div>

            {/* Structured Details Layout */}
            {/*<div*/}
            {/*    className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-white">*/}
            {/*    /!* Column 1: Date, Timings & Helpline *!/*/}
            {/*    <div className="p-6 space-y-6">*/}
            {/*        /!* Date *!/*/}
            {/*        <div className="flex items-start gap-4">*/}
            {/*            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 shrink-0">*/}
            {/*                <Calendar24Regular/>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Date</h3>*/}
            {/*                <p className="font-bold text-stone-900 text-base mt-0.5">{publicConfig.picnicDate}</p>*/}
            {/*                <p className="text-xs text-stone-600">Full Day picnic</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Timings *!/*/}
            {/*        <div className="flex items-start gap-4">*/}
            {/*            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-700 shrink-0">*/}
            {/*                <Clock24Regular/>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Timings &*/}
            {/*                    Schedule</h3>*/}
            {/*                <p className="font-semibold text-stone-900 text-sm mt-0.5">*/}
            {/*                    <strong className="text-stone-900">Departure:</strong> {publicConfig.departureTime}*/}
            {/*                </p>*/}
            {/*                <p className="font-semibold text-stone-900 text-sm mt-1">*/}
            {/*                    <strong className="text-stone-900">Return:</strong> {publicConfig.returnTime}*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        /!* Helpline *!/*/}
            {/*        <div className="flex items-start gap-4 pt-2">*/}
            {/*            <div className="p-2.5 rounded-xl bg-[#FAF0F0] text-secondary shrink-0">*/}
            {/*                <Phone24Regular/>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">For Further*/}
            {/*                    Queries</h3>*/}
            {/*                <div className="space-y-3 mt-1.5">*/}
            {/*                    {privateConfig.contacts.map((contact, index) => (*/}
            {/*                        <div key={index} className={index > 0 ? "border-t border-stone-100 pt-2.5" : ""}>*/}
            {/*                            <p className="font-bold text-stone-900 text-sm">{contact.name}</p>*/}
            {/*                            <a*/}
            {/*                                href={`tel:${contact.phone}`}*/}
            {/*                                className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-0.5"*/}
            {/*                                title={`Call ${contact.name}`}*/}
            {/*                            >*/}
            {/*                                {contact.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}*/}
            {/*                            </a>*/}
            {/*                        </div>*/}
            {/*                    ))}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* Column 2: Bus Routes & Pickup Points *!/*/}
            {/*    <div className="p-6 bg-stone-50/20">*/}
            {/*        <div className="flex items-center gap-2 mb-4">*/}
            {/*            <Location24Regular className="text-primary"/>*/}
            {/*            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">*/}
            {/*                Bus Routes & Pickup Points*/}
            {/*            </h3>*/}
            {/*        </div>*/}

            {/*        <ol className="space-y-3">*/}
            {/*            {publicConfig.pickupPoints.map((route, index) => (*/}
            {/*                <li*/}
            {/*                    key={index}*/}
            {/*                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-stone-200/60 shadow-sm"*/}
            {/*                >*/}
            {/*    <span*/}
            {/*        className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0">*/}
            {/*      {index + 1}*/}
            {/*    </span>*/}
            {/*                    <span className="text-sm font-semibold text-stone-800">*/}
            {/*      {route}*/}
            {/*    </span>*/}
            {/*                </li>*/}
            {/*            ))}*/}
            {/*        </ol>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Intro Description */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 text-center">
                <p className="text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto">
                    Please register all family members attending the picnic to help us plan transportation and food.
                    Registration is <strong className="text-secondary font-bold">₹{publicConfig.picnicFare} per
                    person</strong>.
                </p>
            </div>
        </div>
    );
}
