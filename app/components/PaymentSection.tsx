'use client';

import React, {useState} from 'react';
import {
    Copy20Regular,
    Checkmark20Regular,
    QrCode24Regular,
    Warning24Filled,
    Info20Regular,
    Dismiss20Regular,
    ArrowDownload20Regular
} from '@fluentui/react-icons';
import {QRCodeSVG} from 'qrcode.react';
import {privateConfig} from '@/lib/privateConfig';
import Alert from './Alert';

interface PaymentSectionProps {
    amount: number;
    peopleCount: number;
    mainAttendeeName: string;
}

export default function PaymentSection({amount, peopleCount, mainAttendeeName}: PaymentSectionProps) {
    const [copied, setCopied] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setTimeout(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    };

    const upiId = privateConfig.upiId;
    const upiName = privateConfig.payeeName;

    // Format standard UPI payment link if configuration is present:
    const upiLink = upiId
        ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Picnic Registration by ${mainAttendeeName || 'Mahatma'}`)}`
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

    const handleDownloadQR = () => {
        const svgElement = document.getElementById('payment-qr-code-svg');
        if (!svgElement) return;

        try {
            // 1. Serialize the SVG to string
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            // 2. Create blob URL
            const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
            const URL = window.URL || window.webkitURL || window;
            const blobURL = URL.createObjectURL(svgBlob);

            // 3. Render into canvas for PNG download
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                // High-resolution scaled dimensions for mobile readability (1200 x 1600)
                canvas.width = 1200;
                canvas.height = 1600;
                const context = canvas.getContext('2d');
                if (context) {
                    // Helper to draw rounded rectangle
                    const drawRoundRect = (
                        ctx: CanvasRenderingContext2D,
                        x: number,
                        y: number,
                        w: number,
                        h: number,
                        r: number
                    ) => {
                        ctx.beginPath();
                        ctx.moveTo(x + r, y);
                        ctx.lineTo(x + w - r, y);
                        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                        ctx.lineTo(x + w, y + h - r);
                        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                        ctx.lineTo(x + r, y + h);
                        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                        ctx.lineTo(x, y + r);
                        ctx.quadraticCurveTo(x, y, x + r, y);
                        ctx.closePath();
                    };

                    // Draw base card background (warm background theme)
                    context.fillStyle = '#fdfbf7';
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw nice inner border frame (removed thick outer border)
                    context.strokeStyle = 'rgba(203, 75, 31, 0.08)';
                    context.lineWidth = 4;
                    context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

                    // Centering helper
                    context.textAlign = 'center';

                    // 1. Jai Satchitanand Badge
                    context.fillStyle = '#fef2ee';
                    drawRoundRect(context, canvas.width / 2 - 220, 80, 440, 70, 35);
                    context.fill();
                    context.strokeStyle = 'rgba(203, 75, 31, 0.15)';
                    context.lineWidth = 2;
                    drawRoundRect(context, canvas.width / 2 - 220, 80, 440, 70, 35);
                    context.stroke();

                    context.font = 'bold 28px sans-serif';
                    context.fillStyle = '#CB4B1F';
                    context.fillText('JAI SATCHITANAND', canvas.width / 2, 125);

                    // 2. Title
                    context.font = '900 64px sans-serif';
                    context.fillStyle = '#2d241d';
                    context.fillText('Picnic Payment QR', canvas.width / 2, 225);

                    // 3. Primary Contact / Payer name
                    context.font = 'bold 26px sans-serif';
                    context.fillStyle = '#8c827a';
                    context.fillText('PRIMARY REGISTRANT', canvas.width / 2, 305);

                    const displayName = mainAttendeeName
                        ? (mainAttendeeName.length > 26 ? mainAttendeeName.substring(0, 23) + '...' : mainAttendeeName)
                        : 'Mahatma';
                    context.font = '800 48px sans-serif';
                    context.fillStyle = '#2d241d';
                    context.fillText(displayName, canvas.width / 2, 365);

                    // 4. Amount Box
                    context.fillStyle = '#fef2ee';
                    drawRoundRect(context, 80, 420, canvas.width - 160, 160, 36);
                    context.fill();
                    context.strokeStyle = 'rgba(203, 75, 31, 0.2)';
                    context.lineWidth = 3;
                    drawRoundRect(context, 80, 420, canvas.width - 160, 160, 36);
                    context.stroke();

                    // Amount label
                    context.font = 'bold 24px sans-serif';
                    context.fillStyle = '#CB4B1F';
                    context.fillText('TOTAL AMOUNT TO TRANSFER', canvas.width / 2, 470);

                    // Amount value
                    context.font = '900 72px monospace';
                    context.fillStyle = '#2d241d';
                    context.fillText(`₹${amount.toLocaleString('en-IN')}`, canvas.width / 2, 545);

                    // 5. QR Code Card Container (Increased Size)
                    const qrSize = 720; // 360 * 2 (Increased size)
                    const qrX = (canvas.width - qrSize) / 2;
                    const qrY = 660;

                    context.fillStyle = '#ffffff';
                    drawRoundRect(context, qrX - 48, qrY - 48, qrSize + 96, qrSize + 96, 48);
                    context.fill();
                    context.strokeStyle = '#f0ebe6';
                    context.lineWidth = 4;
                    drawRoundRect(context, qrX - 48, qrY - 48, qrSize + 96, qrSize + 96, 48);
                    context.stroke();

                    // Draw the QR Code image
                    context.drawImage(image, qrX, qrY, qrSize, qrSize);

                    // Scan instruction under QR
                    context.font = 'bold 30px sans-serif';
                    context.fillStyle = '#8c827a';
                    context.fillText('SCAN WITH GPay, PHONEPE, PAYTM, OR BHIM', canvas.width / 2, qrY + qrSize + 95);

                    // 6. Footer Divider
                    context.strokeStyle = '#e5dfd9';
                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(80, 1510);
                    context.lineTo(canvas.width - 80, 1510);
                    context.stroke();

                    context.font = 'bold 24px sans-serif';
                    context.fillStyle = '#8c827a';
                    context.fillText('Upload transaction screenshot after paying to complete registration.', canvas.width / 2, 1550);

                    // Trigger direct PNG download
                    const pngUrl = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.href = pngUrl;
                    const cleanName = displayName.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
                    downloadLink.download = `picnic_payment_qr_₹${amount}_${cleanName}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }
                URL.revokeObjectURL(blobURL);
            };
            image.src = blobURL;
        } catch (error) {
            console.error('Failed to download QR code:', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <QrCode24Regular className="text-primary"/>
                    Payment Details
                </h2>
                <button
                    type="button"
                    onClick={() => setShowInstructions(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary-light/35 border border-primary/30 rounded-xl transition-all cursor-pointer focus:outline-none"
                >
                    <Info20Regular className="shrink-0 w-4 h-4"/>
                    How to Pay
                </button>
            </div>

            {/* Restructured Layout - Unified vertical flow */}
            <div className="space-y-5 max-w-lg mx-auto">
                {/* Price Calculation Badge */}
                <div className="bg-[#FDF7F0] border border-accent/30 rounded-xl p-4.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Calculated Total</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span
                                    className="text-3xl font-extrabold text-stone-900">₹{amount.toLocaleString('en-IN')}</span>
                                <span className="text-sm font-semibold text-stone-600">
                                    (for {peopleCount} {peopleCount === 1 ? 'person' : 'people'})
                                </span>
                            </div>
                        </div>
                        <span
                            className="text-[10px] font-bold text-accent-hover bg-white border border-accent/25 rounded-lg px-2.5 py-1 w-fit self-start sm:self-center shrink-0 shadow-sm">
                            Inclusive of transportation & food
                        </span>
                    </div>
                </div>

                <Alert
                    type="secondary"
                    message="Please note: The amount is non-refundable."
                />

                {/* Option 1: Pay via UPI ID */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-800">
                        Option 1: Pay via UPI ID
                    </label>
                    {upiId ? (
                        <div
                            className="flex items-stretch rounded-xl border border-stone-200 bg-stone-50/50 p-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                            <span
                                className="flex-1 flex items-center px-3 text-stone-900 font-mono font-bold text-sm select-all">
                              {upiId}
                            </span>
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className={`px-3.5 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer shrink-0 focus:outline-none ${
                                    copied
                                        ? 'bg-green-700 text-white animate-pulse'
                                        : 'bg-white text-stone-700 hover:text-stone-955 shadow-sm border border-stone-200 hover:bg-stone-50'
                                }`}
                                title={copied ? "Copied" : "Copy UPI ID"}
                            >
                                {copied ? (
                                    <Checkmark20Regular className="w-5 h-5 shrink-0"/>
                                ) : (
                                    <Copy20Regular className="w-5 h-5 shrink-0"/>
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

                {/* "or" Divider */}
                <div className="relative flex py-2 items-center">
                    <div className="grow border-t border-stone-200"></div>
                    <span
                        className="shrink mx-4 text-xs font-bold text-stone-400 uppercase tracking-widest bg-white px-2">or</span>
                    <div className="grow border-t border-stone-200"></div>
                </div>

                {/* Option 2: Scan QR Code */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-800">
                        Option 2: Scan QR Code
                    </label>
                    {upiId ? (
                        <button
                            type="button"
                            onClick={() => setShowQRModal(true)}
                            className="w-full flex items-center justify-between p-3.5 border border-stone-200 rounded-xl bg-stone-50/50 hover:bg-stone-100/70 hover:border-stone-300 cursor-pointer active:scale-[0.99] transition-all text-left focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
                                    <QrCode24Regular className="w-5 h-5"/>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-stone-900">Payment QR Code</h4>
                                    <p className="text-xs text-stone-500">Scan with any UPI app to pay</p>
                                </div>
                            </div>
                            <span className="text-stone-400 text-lg select-none pr-1">❯</span>
                        </button>
                    ) : (
                        <div
                            className="text-center flex flex-col items-center justify-center p-4 text-amber-800 bg-amber-50 rounded-2xl border border-amber-200">
                            <Warning24Filled className="text-amber-600 mb-2 shrink-0 animate-pulse"/>
                            <p className="text-xs font-bold uppercase tracking-wider">UPI Not Configured</p>
                        </div>
                    )}
                </div>

                {/* Small Help Tip */}
                {/*{upiId && (*/}
                {/*    <div*/}
                {/*        className="text-xs text-stone-600 bg-stone-50 border border-stone-150 rounded-xl p-3 flex items-start gap-2.5">*/}
                {/*        <Info20Regular className="text-stone-400 shrink-0 w-4 h-4 mt-0.5"/>*/}
                {/*        <span>*/}
                {/*            Make sure to verify the payee name is <strong>{upiName}</strong> and transfer exactly <strong>₹{amount}</strong>.*/}
                {/*        </span>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            {/* Payment Instructions Modal */}
            {showInstructions && (
                <div
                    onClick={() => setShowInstructions(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-all duration-300"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden transform scale-100 transition-all duration-300"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50">
                            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                                <Info20Regular className="text-primary"/>
                                How to Pay
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowInstructions(false)}
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 focus:outline-none transition-colors duration-155 cursor-pointer"
                                title="Close"
                            >
                                <Dismiss20Regular/>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {upiId ? (
                                <ol className="text-sm text-stone-700 space-y-3 list-decimal list-inside leading-relaxed">
                                    <li>
                                        Scan the <strong className="text-stone-900">QR code</strong> on the screen, or
                                        copy the <strong className="text-stone-900">UPI ID</strong> into your preferred
                                        UPI app (GPay, PhonePe, Paytm, BHIM, etc.).
                                    </li>
                                    <li>
                                        Verify the payee name shows as <strong
                                        className="text-stone-900">{upiName}</strong>.
                                    </li>
                                    <li>
                                        Enter and transfer the exact amount of <strong
                                        className="text-secondary font-extrabold">₹{amount}</strong>.
                                    </li>
                                    <li>
                                        Take a screenshot of the successful transaction page.
                                    </li>
                                    <li>
                                        Upload that screenshot in the next section to complete registration.
                                    </li>
                                </ol>
                            ) : (
                                <p className="text-sm text-stone-600 italic">
                                    Please wait for the site administrator to configure the payment destination
                                    coordinates.
                                </p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowInstructions(false)}
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && upiId && (
                <div
                    onClick={handleCloseQRModal}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-all duration-300"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-stone-200 overflow-hidden transform scale-100 transition-all duration-300"
                    >
                        {/* Modal Header */}
                        <div
                            className="flex items-center justify-between p-4.5 border-b border-stone-100 bg-stone-50/50">
                            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                                <QrCode24Regular className="text-primary w-5 h-5"/>
                                Scan to Pay
                            </h3>
                            <button
                                type="button"
                                onClick={handleCloseQRModal}
                                className="p-1 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 focus:outline-none transition-colors duration-150 cursor-pointer"
                                title="Close"
                            >
                                <Dismiss20Regular className="w-4 h-4"/>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex flex-col items-center justify-center bg-white">
                            <div className="bg-white p-4 rounded-xl shadow-md border border-stone-150">
                                <QRCodeSVG
                                    id="payment-qr-code-svg"
                                    value={upiLink}
                                    size={240}
                                    level="H"
                                    marginSize={0}
                                    className="mx-auto"
                                />
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-lg font-black text-stone-950 font-mono">₹{amount.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-64">
                                    Scan with GPay, PhonePe, Paytm, BHIM, or any banking app
                                </p>
                            </div>

                            {amount <= 2000 && (
                                <button
                                    type="button"
                                    onClick={handleDownloadQR}
                                    className="mt-4 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-955 bg-white hover:bg-stone-50 shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-xs font-bold active:scale-[0.98]"
                                >
                                    <ArrowDownload20Regular className="shrink-0 w-4 h-4 text-emerald-600"/>
                                    Download QR Code
                                </button>
                            )}

                            {/* Screenshot Submission Notice */}
                            <div
                                className="w-full mt-4 bg-amber-50 border border-amber-200/50 rounded-xl p-3 flex items-start gap-2.5 text-left animate-pulse-subtle">
                                <span className="text-lg leading-none shrink-0 select-none">📸</span>
                                <div>
                                    <h5 className="font-bold text-amber-900 text-xs">Screenshot Required!</h5>
                                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-medium">
                                        Please take a screenshot of the successful payment page and upload it in the
                                        next section to complete your registration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3.5 bg-stone-50/50 border-t border-stone-100 flex justify-center">
                            <button
                                type="button"
                                onClick={handleCloseQRModal}
                                className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
