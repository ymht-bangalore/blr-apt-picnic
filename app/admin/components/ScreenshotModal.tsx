'use client';

import React, {useState} from 'react';
import {Dismiss24Regular, ArrowDownload24Regular, ZoomIn24Regular, ZoomOut24Regular} from '@fluentui/react-icons';

interface ScreenshotModalProps {
    imageUrl: string;
    onClose: () => void;
    personName: string;
}

export default function ScreenshotModal({imageUrl, onClose, personName}: ScreenshotModalProps) {
    const [scale, setScale] = useState(1);
    const [hasError, setHasError] = useState(false);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setScale(1);

    // Check if it's a blob URL that might have expired
    const isBlobUrl = imageUrl.startsWith('blob:');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md animate-fade-in">
            <div
                className="absolute inset-0 cursor-zoom-out"
                onClick={onClose}
                title="Click outside to close"
            />

            <div
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col z-10 border border-stone-150 animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-stone-50/50">
                    <div>
                        <h3 className="font-bold text-stone-900 text-lg">Payment Screenshot</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Submitted by {personName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {!hasError && (
                            <>
                                <button
                                    type="button"
                                    onClick={zoomOut}
                                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                                    title="Zoom Out"
                                >
                                    <ZoomOut24Regular className="w-5 h-5"/>
                                </button>
                                <button
                                    type="button"
                                    onClick={zoomIn}
                                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                                    title="Zoom In"
                                >
                                    <ZoomIn24Regular className="w-5 h-5"/>
                                </button>
                                <a
                                    href={imageUrl}
                                    download={`screenshot_${personName.replace(/\s+/g, '_')}.png`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-stone-500 hover:bg-stone-100 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                                    title="Download Image"
                                >
                                    <ArrowDownload24Regular className="w-5 h-5"/>
                                </a>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-xl transition-all cursor-pointer border border-stone-200 bg-white"
                            title="Close Modal"
                        >
                            <Dismiss24Regular className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className="flex-1 overflow-auto p-6 bg-stone-100 min-h-[300px] flex items-center justify-center relative">
                    {hasError ? (
                        <div className="text-center p-8 max-w-sm">
                            <span className="text-5xl">🖼️</span>
                            <h4 className="font-bold text-stone-800 text-lg mt-4">Unable to display screenshot</h4>
                            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                                {isBlobUrl
                                    ? 'This demo session registration screenshot was stored in your local browser memory (Blob URL) and has expired. Refreshing/closing the tab removes blob references.'
                                    : 'The screenshot could not be loaded. It might have been deleted from Supabase storage or blockages in internet connection occurred.'}
                            </p>
                            {!isBlobUrl && (
                                <a
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-4 text-xs font-bold text-primary hover:underline"
                                >
                                    Open Direct Link
                                </a>
                            )}
                        </div>
                    ) : (
                        <div
                            className="transition-transform duration-200 ease-out max-w-full"
                            style={{transform: `scale(${scale})`}}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt={`Payment screenshot for ${personName}`}
                                className="max-h-[60vh] object-contain rounded-xl border border-stone-200 shadow-md bg-white select-none"
                                onError={() => setHasError(true)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="p-4 bg-stone-50 text-center text-xs text-stone-400 border-t border-stone-100">
                    Scroll to navigate around zoomed image. Double click outside to dismiss.
                </div>
            </div>
        </div>
    );
}
