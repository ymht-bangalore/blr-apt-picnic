'use client';

import React, {useState, useEffect} from 'react';
import {registerMahatmas, Mahatma} from '@/lib/db';
import {publicConfig} from '@/lib/publicConfig';
import {ArrowRight20Filled, Location20Filled} from '@fluentui/react-icons';

// Import Components
import RegistrationHeader from './components/RegistrationHeader';
import MahatmasForm from './components/MahatmasForm';
import PaymentSection from './components/PaymentSection';
import UploadSection from './components/UploadSection';
import SuccessView from './components/SuccessView';
import Stepper from './components/Stepper';
import PickupPointSelector from './components/PickupPointSelector';

export default function RegistrationPage() {
    // Form States
    const [people, setPeople] = useState<Mahatma[]>([{name: '', mobile: '', ageGroup: ''}]);
    const [pickupPoint, setPickupPoint] = useState<string>('');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [isReviewing, setIsReviewing] = useState<boolean>(false);

    const calculateTotalAmount = (peopleList: Mahatma[]) => {
        return peopleList.reduce((acc, person) => {
            if (person.ageGroup === 'less-8') return acc + Math.round(publicConfig.picnicFare / 2);
            if (person.ageGroup === 'more-8') return acc + publicConfig.picnicFare;
            return acc;
        }, 0);
    };

    const totalAmount = calculateTotalAmount(people);

    // Custom Navigation Helper with Browser History integration
    const navigateTo = (targetStep: 1 | 2, targetIsReviewing: boolean, action: 'push' | 'replace' | 'none' = 'push') => {
        setStep(targetStep);
        setIsReviewing(targetIsReviewing);
        if (typeof window !== 'undefined') {
            if (action === 'push') {
                window.history.pushState({step: targetStep, isReviewing: targetIsReviewing}, '');
            } else if (action === 'replace') {
                window.history.replaceState({step: targetStep, isReviewing: targetIsReviewing}, '');
            }
        }
    };

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.state) {
            window.history.back();
        } else {
            // Fallback if history state isn't available
            if (step === 2) {
                setStep(1);
                setIsReviewing(true);
            } else if (isReviewing) {
                setIsReviewing(false);
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize history state on mount
            window.history.replaceState({step: 1, isReviewing: false}, '');

            const handlePopState = (event: PopStateEvent) => {
                // Prevent Next.js router from intercepting our step transition, preventing page re-mount and state loss
                event.stopImmediatePropagation();

                if (event.state) {
                    const {step: targetStep, isReviewing: targetIsReviewing} = event.state;
                    setStep(targetStep);
                    setIsReviewing(targetIsReviewing);
                } else {
                    setStep(1);
                    setIsReviewing(false);
                }
            };

            window.addEventListener('popstate', handlePopState, true);
            return () => {
                window.removeEventListener('popstate', handlePopState, true);
            };
        }
    }, []);

    // Load form data from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('blr_picnic_registration_form');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setPeople(parsed);
                    }
                } catch (e) {
                    console.error('Failed to parse saved form details', e);
                }
            }
            const savedPickup = sessionStorage.getItem('blr_picnic_pickup_point');
            if (savedPickup) {
                setPickupPoint(savedPickup);
            }
        }
    }, []);

    // Save form data to sessionStorage when changes occur
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('blr_picnic_registration_form', JSON.stringify(people));
        }
    }, [people]);

    // Save pickup point to sessionStorage when changes occur
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('blr_picnic_pickup_point', pickupPoint);
        }
    }, [pickupPoint]);

    // Validation States
    const [errors, setErrors] = useState<Array<{ name?: string; mobile?: string; ageGroup?: string }>>([]);
    const [pickupPointError, setPickupPointError] = useState<string>('');
    const [screenshotError, setScreenshotError] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');

    // Submission States
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionResult, setSubmissionResult] = useState<{
        registrationId: string;
        isDemo: boolean;
        people: Mahatma[];
        amount: number;
        pickupPoint: string;
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

    const validatePickupPoint = (): boolean => {
        if (!pickupPoint || !pickupPoint.trim()) {
            setPickupPointError('Please select a pickup point.');
            return false;
        }
        setPickupPointError('');
        return true;
    };

    const validateAttendees = (): boolean => {
        let isValid = true;
        const newErrors = people.map((person, index) => {
            const errorRow: { name?: string; mobile?: string; ageGroup?: string } = {};

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

            // Age Group validation
            if (!person.ageGroup) {
                errorRow.ageGroup = 'Please select an age group.';
                isValid = false;
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
        const isPickupValid = validatePickupPoint();
        const isAttendeesValid = validateAttendees();
        if (isPickupValid && isAttendeesValid) {
            navigateTo(1, true, 'push');
            setTimeout(() => {
                const element = document.getElementById('registration-form');
                if (element) {
                    element.scrollIntoView({behavior: 'smooth', block: 'start'});
                }
            }, 100);
        } else {
            // Scroll to first error field
            setTimeout(() => {
                const firstErrorEl = document.querySelector('.border-red-400') || document.querySelector('.border-red-500');
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 100);
        }
    };

    const handleStepClick = (targetStep: 1 | 2) => {
        if (targetStep === 1) {
            if (step === 2 || isReviewing) {
                handleBack();
            }
        } else if (targetStep === 2) {
            const isPickupValid = validatePickupPoint();
            const isAttendeesValid = validateAttendees();
            if (isPickupValid && isAttendeesValid) {
                if (!isReviewing) {
                    navigateTo(1, true, 'push');
                    setTimeout(() => {
                        const element = document.getElementById('registration-form');
                        if (element) {
                            element.scrollIntoView({behavior: 'smooth', block: 'start'});
                        }
                    }, 100);
                } else {
                    navigateTo(2, true, 'push');
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            } else {
                // Scroll to first error field
                setTimeout(() => {
                    const firstErrorEl = document.querySelector('.border-red-400') || document.querySelector('.border-red-500');
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

        const isPickupValid = validatePickupPoint();
        const isAttendeesValid = validateAttendees();
        if (!isPickupValid || !isAttendeesValid) {
            setStep(1);
            setTimeout(() => {
                const firstErrorEl = document.querySelector('.border-red-400') || document.querySelector('.border-red-500');
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 100);
            return;
        }

        if (step === 1) {
            navigateTo(2, true, 'push');
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
            const result = await registerMahatmas(people, amount, pickupPoint, screenshot);

            if (result.success && result.registrationId) {
                setSubmissionResult({
                    registrationId: result.registrationId,
                    isDemo: result.isDemo,
                    people: result.people || [...people],
                    amount,
                    pickupPoint: pickupPoint
                });

                // Clear sessionStorage
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('blr_picnic_registration_form');
                    sessionStorage.removeItem('blr_picnic_pickup_point');
                }

                // Reset form states so that they are empty if the user revisits
                setPeople([{name: '', mobile: '', ageGroup: ''}]);
                setPickupPoint('');
                setScreenshot(null);
                setErrors([]);
                setPickupPointError('');
                setScreenshotError('');
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
        setPeople([{name: '', mobile: '', ageGroup: ''}]);
        setPickupPoint('');
        setScreenshot(null);
        setErrors([]);
        setPickupPointError('');
        setScreenshotError('');
        setGeneralError('');
        setSubmissionResult(null);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('blr_picnic_registration_form');
            sessionStorage.removeItem('blr_picnic_pickup_point');
        }
        navigateTo(1, false, 'replace');
    };

    // Success view display
    if (submissionResult) {
        return (
            <div className="flex-1 w-full py-8 px-4 sm:px-6 lg:px-8">
                <SuccessView
                    registrationId={submissionResult.registrationId}
                    people={submissionResult.people}
                    amount={submissionResult.amount}
                    pickupPoint={submissionResult.pickupPoint}
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

                <form id="registration-form" onSubmit={handleSubmit} className="space-y-6 scroll-mt-6">
                    {step === 1 ? (
                        isReviewing ? (
                            <>
                                {/* Review/Confirm Attendee Details View */}
                                <div
                                    className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6 animate-scale-up">
                                    <div className="border-b border-stone-100 pb-4 mb-6">
                                        <h2 className="text-xl font-bold text-stone-900">Confirm Registration
                                            Details</h2>
                                        <p className="text-sm text-stone-600 mt-1">Please review the attendee details
                                            below before proceeding to payment.</p>
                                    </div>

                                    {/* Selected Pickup Point Summary */}
                                    <div
                                        className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary-light flex items-center justify-between gap-3 animate-scale-up">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                                                <Location20Filled className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <p className="text-xs text-primary font-bold uppercase tracking-wider">Selected
                                                    Pickup Point</p>
                                                <p className="text-sm font-extrabold text-stone-900">{pickupPoint}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendees List cards */}
                                    <div className="space-y-3">
                                        {people.map((person, index) => {
                                            const ageLabel = person.ageGroup === 'less-8'
                                                ? 'Age less than 8 (Half Price)'
                                                : 'Age 8 and above (Full Price)';
                                            const personFare = person.ageGroup === 'less-8'
                                                ? Math.round(publicConfig.picnicFare / 2)
                                                : publicConfig.picnicFare;

                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-stone-50 transition-all gap-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-xl bg-primary-light text-primary font-bold text-sm flex items-center justify-center shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-stone-900">
                                                                {person.name} {index === 0 && <span
                                                                className="text-xs text-primary font-bold">(You)</span>}
                                                            </p>
                                                            <p className="text-xs text-stone-500 font-mono mt-0.5">{person.mobile || '—'}</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-stone-200 pt-2 sm:pt-0">
                                                        <span
                                                            className="text-xs font-semibold bg-stone-200/60 text-stone-750 px-2 py-0.5 rounded-md">
                                                            {ageLabel}
                                                        </span>
                                                        <span
                                                            className="text-sm font-extrabold text-stone-900 font-mono">
                                                            ₹{personFare}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Total Fare calculation summary */}
                                    <div
                                        className="mt-6 pt-5 border-t border-dashed border-stone-200 flex justify-between items-center">
                                        <div>
                                            <span className="text-stone-600 font-bold text-xs uppercase block">Total Amount</span>
                                            <span className="text-xs text-stone-500">
                                                Based on age group pricing ({people.length} {people.length === 1 ? 'person' : 'people'})
                                            </span>
                                        </div>
                                        <span className="text-2xl font-black text-stone-950 font-mono">
                                            ₹{totalAmount.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-stone-50 text-stone-750 font-bold text-sm border border-stone-200 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigateTo(2, true, 'push');
                                            window.scrollTo({top: 0, behavior: 'smooth'});
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer animate-pulse"
                                    >
                                        Proceed to Payment
                                        <ArrowRight20Filled className="shrink-0 w-5 h-5"/>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Pickup Point Selector - Mandatory, At the start */}
                                <PickupPointSelector
                                    value={pickupPoint}
                                    onChange={(val) => {
                                        setPickupPoint(val);
                                        if (pickupPointError) {
                                            setPickupPointError('');
                                        }
                                    }}
                                    error={pickupPointError}
                                />

                                {/* Step 1: Attendee Details Form */}
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
                                        Proceed to Review
                                        <ArrowRight20Filled className="shrink-0"/>
                                    </button>
                                </div>
                            </>
                        )
                    ) : (
                        <>
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
                                    onClick={handleBack}
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
