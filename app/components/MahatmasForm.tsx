'use client';

import React, {useRef, useEffect} from 'react';
import {Add20Regular, Delete20Regular, Person20Regular, Phone20Regular, Dismiss16Regular} from '@fluentui/react-icons';
import {Mahatma} from '@/lib/db';

interface MahatmasFormProps {
    people: Mahatma[];
    onChange: (updatedPeople: Mahatma[]) => void;
    errors: Array<{ name?: string; mobile?: string }>;
}

export default function MahatmasForm({people, onChange, errors}: MahatmasFormProps) {
    const lastItemRef = useRef<HTMLInputElement>(null);

    // Focus the name input of the last added person
    useEffect(() => {
        if (people.length > 1 && lastItemRef.current) {
            lastItemRef.current.focus();
        }
    }, [people.length]);

    const addPerson = () => {
        onChange([...people, {name: '', mobile: ''}]);
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
                    return {...person, [field]: cleanValue};
                }
                return {...person, [field]: value};
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
                                        Full Name
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
                                        Mobile Number {index > 0 &&
                                        <span className="text-stone-500 font-normal text-xs">(Optional)</span>}
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
