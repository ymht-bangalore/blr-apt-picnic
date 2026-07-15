'use client';

import React, {useState} from 'react';
import {registerMahatmas, Mahatma} from '@/lib/db';
import {publicConfig} from '@/lib/publicConfig';
import {ArrowRight20Filled} from '@fluentui/react-icons';

// Import Components
import RegistrationHeader from './components/RegistrationHeader';
import MahatmasForm from './components/MahatmasForm';
import PaymentSection from './components/PaymentSection';
import UploadSection from './components/UploadSection';
import SuccessView from './components/SuccessView';

export default function RegistrationPage() {
    // Form States
    const [people, setPeople] = useState<Mahatma[]>([{name: '', mobile: ''}]);
    const [screenshot, setScreenshot] = useState<File | null>(null);

    // Validation States
    const [errors, setErrors] = useState<Array<{ name?: string; mobile?: string }>>([]);
    const [screenshotError, setScreenshotError] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');

    // Submission States
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionResult, setSubmissionResult] = useState<{
        registrationId: string;
        isDemo: boolean;
        people: Mahatma[];
        amount: number;
    } | null>(null);

    // Real-time update handlers
    const handlePeopleChange = (updatedPeople: Mahatma[]) => {
        setPeople(updatedPeople);

        // Clear validation errors for index when values change
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleScreenshotChange = (file: File | null) => {
        setScreenshot(file);
        if (file) {
            setScreenshotError('');
        }
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = people.map((person) => {
            const errorRow: { name?: string; mobile?: string } = {};

            // Name validation
            if (!person.name.trim()) {
                errorRow.name = 'Please enter a name.';
                isValid = false;
            }

            // Mobile validation
            const cleanMobile = person.mobile.trim();
            if (!cleanMobile) {
                errorRow.mobile = 'Please enter a mobile number.';
                isValid = false;
            } else if (!/^\d{10}$/.test(cleanMobile)) {
                errorRow.mobile = 'Mobile number must be exactly 10 digits.';
                isValid = false;
            }

            return errorRow;
        });

        setErrors(newErrors);

        // Screenshot validation
        if (!screenshot) {
            setScreenshotError('Please upload a payment screenshot.');
            isValid = false;
        } else {
            setScreenshotError('');
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            // Scroll to first error field
            const firstErrorEl = document.querySelector('.border-red-400');
            if (firstErrorEl) {
                firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            return;
        }

        setIsSubmitting(true);
        const amount = people.length * publicConfig.picnicFare;

        try {
            const result = await registerMahatmas(people, amount, screenshot);

            if (result.success && result.registrationId) {
                setSubmissionResult({
                    registrationId: result.registrationId,
                    isDemo: result.isDemo,
                    people: [...people],
                    amount
                });
            } else {
                setGeneralError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err: any) {
            setGeneralError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setPeople([{name: '', mobile: ''}]);
        setScreenshot(null);
        setErrors([]);
        setScreenshotError('');
        setGeneralError('');
        setSubmissionResult(null);
    };

    // Success view display
    if (submissionResult) {
        return (
            <div className="flex-1 w-full py-8 px-4 sm:px-6 lg:px-8">
                <SuccessView
                    registrationId={submissionResult.registrationId}
                    people={submissionResult.people}
                    amount={submissionResult.amount}
                    isDemo={submissionResult.isDemo}
                    onReset={handleReset}
                />
            </div>
        );
    }

    return (
        <div className="flex-1 w-full flex flex-col min-h-screen">
            <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <RegistrationHeader/>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Attendee Details */}
                    <MahatmasForm
                        people={people}
                        onChange={handlePeopleChange}
                        errors={errors}
                    />

                    {/* Step 2: Payment Details */}
                    <PaymentSection peopleCount={people.length}/>

                    {/* Step 3: Screenshot & Submissions */}
                    <UploadSection
                        screenshot={screenshot}
                        onScreenshotChange={handleScreenshotChange}
                        error={screenshotError}
                    />

                    {/* Error Banner */}
                    {generalError && (
                        <div
                            className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 flex flex-col gap-1">
                            <span className="font-bold">Registration Error</span>
                            <span>{generalError}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-bold text-base shadow-md transition-all ${
                                isSubmitting
                                    ? 'bg-primary/70 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-hover hover:shadow-lg focus:ring-4 focus:ring-primary/20 active:scale-[0.98] cursor-pointer'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting Registration...
                                </>
                            ) : (
                                <>
                                    Submit Registration
                                    <ArrowRight20Filled className="shrink-0"/>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            {/* Warm Footer for Dada Bhagwan Mahatmas */}
            <footer className="bg-stone-100 border-t border-stone-200 py-8 px-4 text-center mt-12 print:hidden">
                <p className="text-sm font-semibold text-stone-700">Jai Satchitanand</p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
                    This registration form is dedicated for the picnic with Aptputra bhaio for all mahatmas of Bengaluru
                    center.
                    For registration assistance or general inquiries, please contact on the details mentioned at the
                    top.
                </p>
            </footer>
        </div>
    );
}
