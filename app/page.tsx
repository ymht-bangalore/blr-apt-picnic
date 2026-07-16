'use client';

import React, {useState, useEffect} from 'react';
import {registerMahatmas, Mahatma} from '@/lib/db';
import {publicConfig} from '@/lib/publicConfig';
import {ArrowRight20Filled} from '@fluentui/react-icons';

// Import Components
import RegistrationHeader from './components/RegistrationHeader';
import MahatmasForm from './components/MahatmasForm';
import PaymentSection from './components/PaymentSection';
import UploadSection from './components/UploadSection';
import SuccessView from './components/SuccessView';
import Stepper from './components/Stepper';

export default function RegistrationPage() {
    // Form States
    const [people, setPeople] = useState<Mahatma[]>([{name: '', mobile: '', ageGroup: 'more-15'}]);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [step, setStep] = useState<1 | 2>(1);

    const calculateTotalAmount = (peopleList: Mahatma[]) => {
        return peopleList.reduce((acc, person) => {
            if (person.ageGroup === 'less-7') return acc + 0;
            if (person.ageGroup === '7-15') return acc + Math.round(publicConfig.picnicFare / 2);
            return acc + publicConfig.picnicFare;
        }, 0);
    };

    const totalAmount = calculateTotalAmount(people);

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

    // Scroll to payment details on step 2 transition
    useEffect(() => {
        if (step === 2) {
            setTimeout(() => {
                const element = document.getElementById('payment-details-section');
                if (element) {
                    element.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
            }, 100);
        }
    }, [step]);

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

    const validateAttendees = (): boolean => {
        let isValid = true;
        const newErrors = people.map((person, index) => {
            const errorRow: { name?: string; mobile?: string } = {};

            // Name validation
            const cleanName = person.name.trim();
            if (!cleanName) {
                errorRow.name = 'Please enter a name.';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(cleanName)) {
                errorRow.name = 'Name should only contain alphabets and spaces.';
                isValid = false;
            }

            // Mobile validation
            const cleanMobile = person.mobile.trim();
            if (index === 0) {
                if (!cleanMobile) {
                    errorRow.mobile = 'Please enter a mobile number.';
                    isValid = false;
                } else if (!/^\d{10}$/.test(cleanMobile)) {
                    errorRow.mobile = 'Mobile number must be exactly 10 digits.';
                    isValid = false;
                }
            } else {
                if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
                    errorRow.mobile = 'Mobile number must be exactly 10 digits.';
                    isValid = false;
                }
            }

            return errorRow;
        });

        setErrors(newErrors);
        return isValid;
    };

    const validateScreenshot = (): boolean => {
        if (!screenshot) {
            setScreenshotError('Please upload a payment screenshot.');
            return false;
        } else {
            setScreenshotError('');
            return true;
        }
    };
    const handleNextStep = () => {
        if (validateAttendees()) {
            setStep(2);
        } else {
            // Scroll to first error field
            setTimeout(() => {
                const firstErrorEl = document.querySelector('.border-red-400');
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 100);
        }
    };

    const handleStepClick = (targetStep: 1 | 2) => {
        if (targetStep === 1) {
            setStep(1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else if (targetStep === 2) {
            if (validateAttendees()) {
                setStep(2);
            } else {
                // Scroll to first error field
                setTimeout(() => {
                    const firstErrorEl = document.querySelector('.border-red-400');
                    if (firstErrorEl) {
                        firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                    }
                }, 100);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        const isAttendeesValid = validateAttendees();
        if (!isAttendeesValid) {
            setStep(1);
            setTimeout(() => {
                const firstErrorEl = document.querySelector('.border-red-400');
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 100);
            return;
        }

        if (step === 1) {
            setStep(2);
            return;
        }

        const isScreenshotValid = validateScreenshot();
        if (!isScreenshotValid) {
            setTimeout(() => {
                const screenshotErrorEl = document.querySelector('.border-red-300') || document.querySelector('#screenshot-upload');
                if (screenshotErrorEl) {
                    screenshotErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 100);
            return;
        }

        setIsSubmitting(true);
        const amount = totalAmount;

        try {
            const result = await registerMahatmas(people, amount, screenshot);

            if (result.success && result.registrationId) {
                setSubmissionResult({
                    registrationId: result.registrationId,
                    isDemo: result.isDemo,
                    people: result.people || [...people],
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
        setPeople([{name: '', mobile: '', ageGroup: 'more-15'}]);
        setScreenshot(null);
        setErrors([]);
        setScreenshotError('');
        setGeneralError('');
        setSubmissionResult(null);
        setStep(1);
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

                {/* Stepper Progress Indicator */}
                <Stepper currentStep={step} onStepClick={handleStepClick}/>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <>
                            {/* Step 1: Attendee Details */}
                            <MahatmasForm
                                people={people}
                                onChange={handlePeopleChange}
                                errors={errors}
                            />

                            {/* Proceed Button */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-bold text-base shadow-md transition-all bg-primary hover:bg-primary-hover hover:shadow-lg focus:ring-4 focus:ring-primary/20 active:scale-[0.98] cursor-pointer"
                                >
                                    Proceed to Payment
                                    <ArrowRight20Filled className="shrink-0"/>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Attendee Summary Card */}
                            <div className="bg-accent-light border border-accent/25 rounded-2xl p-5 mb-6">
                                <div className="flex items-center justify-between border-b border-accent/20 pb-3 mb-3">
                                    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Attendee Summary ({people.length} {people.length === 1 ? 'person' : 'people'})
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs font-bold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                                    >
                                        Edit Details
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-stone-900">
                                    {people.map((person, index) => (
                                        <div key={index}
                                             className="flex items-center gap-2.5 bg-white/70 px-3 py-2 rounded-xl border border-stone-200 shadow-sm">
                                            <span
                                                className="w-5 h-5 rounded-full bg-primary-light text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                                {index + 1}
                                            </span>
                                            <div className="truncate">
                                                <p className="font-semibold text-stone-900 truncate">
                                                    {person.name || 'Anonymous'}{index === 0 ? ' (You)' : ''}
                                                </p>
                                                <p className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                                                    <span>{person.mobile || 'No mobile'}</span>
                                                    <span>•</span>
                                                    <span className="text-primary font-bold">
                                                        {person.ageGroup === 'less-7' ? 'Under 7 (Free)' : person.ageGroup === '7-15' ? '7-15 (Half)' : '15+ (Full)'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Payment Details */}
                            <div id="payment-details-section" className="scroll-mt-6">
                                <PaymentSection
                                    amount={totalAmount}
                                    peopleCount={people.length}
                                    mainAttendeeName={people[0]?.name || ''}
                                />
                            </div>

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

                            {/* Navigation & Submit Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        window.scrollTo({top: 0, behavior: 'smooth'});
                                    }}
                                    className="px-6 py-4 rounded-2xl border-2 border-stone-300 text-stone-700 font-bold text-base hover:bg-stone-50 active:scale-[0.98] cursor-pointer transition-all duration-150 text-center"
                                >
                                    Back to Mahatma Details
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-bold text-base shadow-md transition-all ${
                                        isSubmitting
                                            ? 'bg-primary/70 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-hover hover:shadow-lg focus:ring-4 focus:ring-primary/20 active:scale-[0.98] cursor-pointer'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor"
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
                        </>
                    )}
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
