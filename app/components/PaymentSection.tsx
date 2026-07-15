'use client';

import React, {useState} from 'react';
import {Copy20Regular, Checkmark20Regular, QrCode24Regular, Warning24Filled} from '@fluentui/react-icons';
import {QRCodeSVG} from 'qrcode.react';
import {publicConfig} from '@/lib/publicConfig';
import {privateConfig} from '@/lib/privateConfig';

interface PaymentSectionProps {
    peopleCount: number;
}

export default function PaymentSection({peopleCount}: PaymentSectionProps) {
    const [copied, setCopied] = useState(false);

    const upiId = privateConfig.upiId;
    const upiName = privateConfig.payeeName;
    const amount = peopleCount * publicConfig.picnicFare;

    // Format standard UPI payment link if configuration is present:
    const upiLink = upiId
        ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Picnic Registration')}`
        : '';

    const copyToClipboard = async () => {
        if (!upiId) return;
        try {
            await navigator.clipboard.writeText(upiId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            <div className="xborder-b xborder-stone-100 xpb-4 mb-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <QrCode24Regular className="text-primary"/>
                    Payment Details
                </h2>
                {/*<p className="text-sm text-stone-655 mt-1">Pay securely via any UPI app</p>*/}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Summary & UPI Info */}
                <div className="space-y-6">
                    {/* Price Calculation Badge */}
                    <div className="bg-[#FDF7F0] border border-accent/30 rounded-xl p-5">
                        <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Calculated Total</span>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-extrabold text-stone-900">₹{amount}</span>
                            <span className="text-sm font-semibold text-stone-600">
                (₹{publicConfig.picnicFare} × {peopleCount} {peopleCount === 1 ? 'person' : 'people'})
              </span>
                        </div>
                    </div>

                    {/* UPI ID Copy Field */}
                    <div>
                        <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                            Pay via UPI ID
                        </label>
                        {upiId ? (
                            <div
                                className="flex items-stretch rounded-xl border border-stone-200 bg-stone-50/50 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="flex-1 flex items-center px-3 text-stone-900 font-mono text-sm select-all">
                  {upiId}
                </span>
                                <button
                                    type="button"
                                    onClick={copyToClipboard}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-150 ${
                                        copied
                                            ? 'bg-green-700 text-white'
                                            : 'bg-white text-stone-700 hover:text-stone-955 shadow-sm border border-stone-200 hover:bg-stone-50 cursor-pointer'
                                    }`}
                                    title="Copy UPI ID"
                                >
                                    {copied ? (
                                        <>
                                            <Checkmark20Regular className="shrink-0"/>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy20Regular className="shrink-0"/>
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div
                                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 font-mono">
                                Not Configured
                            </div>
                        )}
                    </div>

                    {/* Payment Steps */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Payment
                            Instructions:</h4>
                        {upiId ? (
                            <ol className="text-sm text-stone-700 space-y-2 list-decimal list-inside leading-relaxed">
                                <li>Scan the QR code, or copy the UPI ID into your UPI app.</li>
                                <li>Verify the payee name shows as <strong className="text-stone-900">{upiName}</strong>.
                                </li>
                                <li>Enter and transfer the exact amount of <strong
                                    className="text-secondary font-extrabold">₹{amount}</strong>.
                                </li>
                                <li>Save a screenshot of the successful transaction page.</li>
                            </ol>
                        ) : (
                            <p className="text-sm text-stone-600 italic">
                                Please wait for the site administrator to configure the payment destination coordinates.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side: QR Code Generator */}
                <div
                    className="flex flex-col items-center justify-center p-6 border border-stone-150 rounded-2xl bg-stone-50/50 min-h-65">
                    {upiId ? (
                        <>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 inline-block">
                                <QRCodeSVG
                                    value={upiLink}
                                    size={180}
                                    level="H"
                                    marginSize={0}
                                    className="mx-auto"
                                />
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-sm font-bold text-stone-900">Payment QR</p>
                                <p className="text-xs text-stone-655 mt-1 max-w-55">
                                    Scan with GPay, PhonePe, Paytm, or BHIM to pay instantly
                                </p>
                            </div>
                        </>
                    ) : (
                        <div
                            className="text-center flex flex-col items-center justify-center max-w-62.5 p-4 text-amber-800 bg-amber-50 rounded-2xl border border-amber-200">
                            <Warning24Filled className="text-amber-600 mb-2 shrink-0 animate-pulse"/>
                            <p className="text-xs font-bold uppercase tracking-wider">UPI Not Configured</p>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                                Set <code
                                className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-bold font-mono">NEXT_PUBLIC_UPI_ID</code> and <code
                                className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-bold font-mono">NEXT_PUBLIC_UPI_NAME</code> in
                                your <code
                                className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-bold font-mono">.env.local</code> to
                                activate the QR code.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
