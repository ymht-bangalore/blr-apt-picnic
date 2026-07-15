'use client';

import React from 'react';
import {Person20Regular, QrCode24Regular} from '@fluentui/react-icons';

interface StepperProps {
    currentStep: 1 | 2;
    onStepClick: (step: 1 | 2) => void;
}

export default function Stepper({currentStep, onStepClick}: StepperProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 mb-6">
            <div className="relative flex items-center justify-between max-w-lg mx-auto">
                {/* Background line connecting the steps */}
                <div className="absolute left-0 right-0 top-6 -translate-y-1/2 h-1 bg-stone-100 rounded-full z-0"/>

                {/* Active progress line indicator */}
                <div
                    className="absolute left-0 top-6 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out"
                    style={{width: currentStep === 1 ? '0%' : '100%'}}
                />

                {/* Step 1 Item */}
                <button
                    type="button"
                    onClick={() => onStepClick(1)}
                    disabled={currentStep === 1}
                    className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:cursor-default"
                >
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            currentStep === 1
                                ? 'bg-primary border-primary text-white ring-4 ring-primary-light shadow-md scale-110'
                                : 'bg-white border-primary text-primary shadow-sm group-hover:bg-primary-light'
                        }`}
                    >
                        {currentStep === 2 ? (
                            <span className="text-lg font-bold">✓</span>
                        ) : (
                            <Person20Regular className="w-5 h-5"/>
                        )}
                    </div>
                    <span
                        className={`text-xs font-bold transition-colors ${
                            currentStep === 1 ? 'text-primary font-extrabold' : 'text-stone-600 hover:text-primary'
                        }`}
                    >
                        1. Mahatma Details
                    </span>
                </button>

                {/* Step 2 Item */}
                <button
                    type="button"
                    onClick={() => onStepClick(2)}
                    disabled={currentStep === 2}
                    className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none disabled:cursor-default"
                >
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            currentStep === 2
                                ? 'bg-primary border-primary text-white ring-4 ring-primary-light shadow-md scale-110'
                                : 'bg-stone-50 border-stone-200 text-stone-400 group-hover:bg-stone-100 group-hover:border-stone-300'
                        }`}
                    >
                        <QrCode24Regular className="w-5 h-5"/>
                    </div>
                    <span
                        className={`text-xs font-bold transition-colors ${
                            currentStep === 2 ? 'text-primary font-extrabold' : 'text-stone-400 group-hover:text-stone-650'
                        }`}
                    >
                        2. Payment & Verification
                    </span>
                </button>
            </div>
        </div>
    );
}
