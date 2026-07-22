'use client';

import React from 'react';
import {Location24Regular} from '@fluentui/react-icons';
import {publicConfig} from '@/lib/publicConfig';

interface PickupPointSelectorProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function PickupPointSelector({value, onChange, error}: PickupPointSelectorProps) {
    const options = publicConfig.pickupPoints.filter(
        (point) => point.id !== "iskcon"
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            <div className="border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Location24Regular className="text-primary shrink-0"/>
                    {publicConfig.busRegistrationClosed ? 'Select Transportation Option' : 'Select Pickup Point'} <span
                    className="text-red-500 font-bold">*</span>
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                    {publicConfig.busRegistrationClosed
                        ? 'Bus pickup seats are full. Please select "Self" to arrange your own transportation.'
                        : 'Choose your preferred boarding point or self transportation.'}
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
                    const isDisabled = Boolean(opt.isFull || (publicConfig.busRegistrationClosed && opt.id !== 'self'));

                    return (
                        <label
                            key={opt.id}
                            className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-150 ${
                                isDisabled
                                    ? 'bg-stone-100/80 border-stone-200 text-stone-400 cursor-not-allowed opacity-75'
                                    : isSelected
                                        ? 'bg-primary-light/40 border-primary/40 text-primary cursor-pointer hover:border-primary/60'
                                        : `bg-white border-stone-200 text-stone-700 cursor-pointer hover:bg-stone-50/50 hover:border-stone-300 ${
                                            error ? 'border-red-400' : ''
                                        }`
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <input
                                    type="radio"
                                    id={`pickup-${opt.id}`}
                                    name="pickup-point"
                                    value={opt.name}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => !isDisabled && onChange(opt.name)}
                                    className={`w-4 h-4 border-stone-300 shrink-0 ${
                                        isDisabled
                                            ? 'cursor-not-allowed accent-stone-400 opacity-50'
                                            : 'text-primary focus:ring-primary accent-primary cursor-pointer'
                                    }`}
                                />
                                <span className={`text-sm font-bold block select-none truncate ${
                                    isDisabled
                                        ? 'text-stone-400 line-through decoration-stone-300'
                                        : isSelected
                                            ? 'text-primary'
                                            : 'text-stone-850'
                                }`}>
                                    {opt.name}
                                </span>
                            </div>

                            {isDisabled && (
                                <span
                                    className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider bg-stone-200/80 text-stone-500 px-2 py-0.5 rounded-md border border-stone-300/50">
                                    Full
                                </span>
                            )}
                            {publicConfig.busRegistrationClosed && !isDisabled && opt.id === 'self' && (
                                <span
                                    className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                                    Available
                                </span>
                            )}
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
