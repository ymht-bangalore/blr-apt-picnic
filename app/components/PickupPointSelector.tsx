'use client';

import React from 'react';
import {Location24Regular} from '@fluentui/react-icons';

interface PickupPointSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function PickupPointSelector({value, onChange, error}: PickupPointSelectorProps) {
    const options = [
        {id: 'akshay-nagar', name: 'Akshay Nagar (NRI Layout)'},
        {id: 'hedge-nagar', name: 'Hedge Nagar'},
        {id: 'iskcon', name: 'Iskcon Rajaji Nagar'},
        {id: 'ms-palya', name: 'MS Palya'},
        {id: 'mysore-bank', name: 'Mysore Bank (Majestic)'},
        {id: 'whitefield', name: 'Whitefield'},
        {id: 'self', name: 'Self'},
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            <div className="border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Location24Regular className="text-primary shrink-0"/>
                    Select Pickup Point <span className="text-red-500 font-bold">*</span>
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                    Choose your preferred boarding point.
                </p>
            </div>

            {/* Standard Radio Group */}
            <div
                role="radiogroup"
                aria-label="Pickup Point"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                {options.map((opt) => {
                    const isSelected = value === opt.name;
                    return (
                        <label
                            key={opt.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 cursor-pointer hover:bg-stone-50/50 hover:border-stone-300 ${
                                isSelected
                                    ? 'bg-primary-light/40 border-primary/40 text-primary'
                                    : `bg-white border-stone-200 text-stone-700 ${
                                        error ? 'border-red-400' : ''
                                    }`
                            }`}
                        >
                            <input
                                type="radio"
                                id={`pickup-${opt.id}`}
                                name="pickup-point"
                                value={opt.name}
                                checked={isSelected}
                                onChange={() => onChange(opt.name)}
                                className="w-4 h-4 text-primary border-stone-300 focus:ring-primary accent-primary cursor-pointer shrink-0"
                            />
                            <span className={`text-sm font-bold block select-none ${
                                isSelected ? 'text-primary' : 'text-stone-850'
                            }`}>
                                {opt.name}
                            </span>
                        </label>
                    );
                })}
            </div>

            {error && (
                <p className="mt-3 text-xs font-semibold text-red-650 flex items-center gap-1">
                    <span>⚠️</span> {error}
                </p>
            )}
        </div>
    );
}
