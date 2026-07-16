'use client';

import React, {useRef, useEffect} from 'react';
import {Add20Regular, Delete20Regular, Person20Regular, Phone20Regular, Dismiss16Regular} from '@fluentui/react-icons';
import {Mahatma} from '@/lib/db';
import {publicConfig} from '@/lib/publicConfig';

interface MahatmasFormProps {
    people: Mahatma[];
    onChange: (updatedPeople: Mahatma[]) => void;
    errors: Array<{ name?: string; mobile?: string }>;
}

const toTitleCase = (str: string): string => {
    if (!str.trim()) return '';
    return str
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function MahatmasForm({people, onChange, errors}: MahatmasFormProps) {
    const lastItemRef = useRef<HTMLInputElement>(null);

    // Focus the name input of the last added person
    useEffect(() => {
        if (people.length > 1 && lastItemRef.current) {
            lastItemRef.current.focus();
        }
    }, [people.length]);

    const addPerson = () => {
        onChange([...people, {name: '', mobile: '', ageGroup: 'more-15'}]);
    };

    const removePerson = (index: number) => {
        if (people.length === 1) return; // Keep at least one person
        const updated = people.filter((_, idx) => idx !== index);
        onChange(updated);
    };

    const handleFieldChange = (index: number, field: keyof Mahatma, value: string) => {
        const updated = people.map((person, idx) => {
            if (idx === index) {
                if (field === 'mobile') {
                    // Allow only digits and limit to 10 characters
                    const cleanValue = value.replace(/\D/g, '').slice(0, 10);
                    return {...person, mobile: cleanValue} as Mahatma;
                }
                if (field === 'name') {
                    // Only allow alphabets (a-z, A-Z) and spaces
                    const cleanValue = value.replace(/[^a-zA-Z\s]/g, '');
                    return {...person, name: cleanValue} as Mahatma;
                }
                if (field === 'ageGroup') {
                    return {...person, ageGroup: value as 'less-7' | '7-15' | 'more-15'} as Mahatma;
                }
                return {...person, [field]: value} as Mahatma;
            }
            return person;
        });
        onChange(updated);
    };

    const handleNameBlur = (index: number, value: string) => {
        const titleCaseValue = toTitleCase(value);
        const updated = people.map((person, idx) => {
            if (idx === index) {
                return {...person, name: titleCaseValue} as Mahatma;
            }
            return person;
        });
        onChange(updated);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-stone-900">Mahatma Details</h2>
                    <p className="text-sm text-stone-600 mt-1">Enter the details of all attendees</p>
                </div>
                <span
                    className="bg-[#FDF1ED] text-primary text-xs font-bold px-2.5 py-1 rounded-md border border-primary/20">
          Total: {people.length} {people.length === 1 ? 'Person' : 'People'}
        </span>
            </div>

            <div className="space-y-6">
                {people.map((person, index) => {
                    const rowError = errors[index] || {};
                    const isLast = index === people.length - 1;

                    return (
                        <div
                            key={index}
                            className="relative p-4 sm:p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50/80 transition-colors duration-150"
                        >
                            {/* Row Header */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                                  Attendee #{index + 1} {index === 0 && '(You)'}
                                </span>

                                {people.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePerson(index)}
                                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 focus:outline-none transition-colors duration-150 cursor-pointer"
                                        title="Remove attendee"
                                    >
                                        <Delete20Regular/>
                                    </button>
                                )}
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor={`name-${index}`}
                                           className="block text-sm font-semibold text-stone-800 mb-1.5">
                                        Full Name <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                                            <Person20Regular/>
                                        </div>
                                        <input
                                            ref={isLast ? lastItemRef : null}
                                            type="text"
                                            id={`name-${index}`}
                                            name={`name-${index}`}
                                            value={person.name}
                                            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                            onBlur={(e) => handleNameBlur(index, e.target.value)}
                                            placeholder="e.g. Ramesh Patel"
                                            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-white text-stone-900 placeholder-stone-500 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                                                rowError.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-300'
                                            }`}
                                            required
                                        />
                                        {person.name && (
                                            <button
                                                type="button"
                                                onClick={() => handleFieldChange(index, 'name', '')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
                                                title="Clear Name"
                                            >
                                                <Dismiss16Regular/>
                                            </button>
                                        )}
                                    </div>
                                    {rowError.name && (
                                        <p className="mt-1 text-xs font-semibold text-red-650">{rowError.name}</p>
                                    )}
                                </div>

                                {/* Mobile Field */}
                                <div>
                                    <label htmlFor={`mobile-${index}`}
                                           className="block text-sm font-semibold text-stone-800 mb-1.5">
                                        Mobile Number {index === 0 ? (
                                        <span className="text-red-500 font-bold">*</span>
                                    ) : (
                                        <span className="text-stone-500 font-normal text-xs">(Optional)</span>
                                    )}
                                    </label>
                                    <div className="relative">
                                        <div
                                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                                            <Phone20Regular/>
                                        </div>
                                        <input
                                            type="tel"
                                            id={`mobile-${index}`}
                                            name={`mobile-${index}`}
                                            value={person.mobile}
                                            onChange={(e) => handleFieldChange(index, 'mobile', e.target.value)}
                                            placeholder="e.g. 9876543210"
                                            className={`w-full pl-10 pr-10 py-2.5 rounded-lg border bg-white text-stone-900 placeholder-stone-500 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                                                rowError.mobile ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-300'
                                            }`}
                                            required={index === 0}
                                        />
                                        {person.mobile && (
                                            <button
                                                type="button"
                                                onClick={() => handleFieldChange(index, 'mobile', '')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
                                                title="Clear Mobile"
                                            >
                                                <Dismiss16Regular/>
                                            </button>
                                        )}
                                    </div>
                                    {rowError.mobile && (
                                        <p className="mt-1 text-xs font-semibold text-red-650">{rowError.mobile}</p>
                                    )}
                                </div>

                                {/* Age Group Selection */}
                                <div className="sm:col-span-2 mt-2 space-y-2">
                                    <span id={`age-group-label-${index}`}
                                          className="block text-sm font-semibold text-stone-850">
                                        Age Group <span className="text-red-500 font-bold">*</span>
                                    </span>
                                    <div
                                        role="radiogroup"
                                        aria-labelledby={`age-group-label-${index}`}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                    >
                                        {/* Option 1: Less than 7 */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={person.ageGroup === 'less-7'}
                                            onClick={() => handleFieldChange(index, 'ageGroup', 'less-7')}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                                                person.ageGroup === 'less-7'
                                                    ? 'bg-primary-light border-primary text-primary shadow-sm ring-1 ring-primary/30 font-bold'
                                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50 hover:border-stone-300'
                                            }`}
                                        >
                                            <span className="text-sm block">Less than 7</span>
                                            <span className="text-[10px] opacity-90 mt-0.5 font-semibold">Free</span>
                                        </button>

                                        {/* Option 2: 7 to 15 */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={person.ageGroup === '7-15'}
                                            onClick={() => handleFieldChange(index, 'ageGroup', '7-15')}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                                                person.ageGroup === '7-15'
                                                    ? 'bg-primary-light border-primary text-primary shadow-sm ring-1 ring-primary/30 font-bold'
                                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50 hover:border-stone-300'
                                            }`}
                                        >
                                            <span className="text-sm block">7 to 15</span>
                                            <span
                                                className="text-[10px] opacity-90 mt-0.5 font-semibold">Half Price (₹{Math.round(publicConfig.picnicFare / 2)})</span>
                                        </button>

                                        {/* Option 3: More than 15 */}
                                        <button
                                            type="button"
                                            role="radio"
                                            aria-checked={person.ageGroup === 'more-15'}
                                            onClick={() => handleFieldChange(index, 'ageGroup', 'more-15')}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                                                person.ageGroup === 'more-15' || !person.ageGroup
                                                    ? 'bg-primary-light border-primary text-primary shadow-sm ring-1 ring-primary/30 font-bold'
                                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50/50 hover:border-stone-300'
                                            }`}
                                        >
                                            <span className="text-sm block">More than 15</span>
                                            <span
                                                className="text-[10px] opacity-90 mt-0.5 font-semibold">Full Price (₹{publicConfig.picnicFare})</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add More Button */}
            <div className="mt-5 border-t border-dashed border-stone-200 pt-5">
                <button
                    type="button"
                    onClick={addPerson}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-primary text-primary font-bold hover:border-primary-hover hover:text-primary-hover hover:bg-[#FDF1ED]/40 transition-all duration-150 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                    <Add20Regular className=" shrink-0 font-extrabold"/>
                    Add More Attendees
                </button>
            </div>
        </div>
    );
}
