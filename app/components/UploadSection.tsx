'use client';

import React, {useState, useRef} from 'react';
import {ArrowUpload24Regular, Delete20Regular} from '@fluentui/react-icons';

interface UploadSectionProps {
    screenshot: File | null;
    onScreenshotChange: (file: File | null) => void;
    error?: string;
}

export default function UploadSection({
                                          screenshot,
                                          onScreenshotChange,
                                          error
                                      }: UploadSectionProps) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onScreenshotChange(file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onScreenshotChange(e.target.files[0]);
        }
    };

    const clearFile = () => {
        onScreenshotChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-150 p-6 sm:p-8 mb-6">
            {/* Header */}
            <div className="border-b border-stone-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-stone-900">Upload Payment Screenshot</h2>
                <p className="text-sm text-stone-655 mt-1">Upload proof of payment to complete registration</p>
            </div>

            <div className="space-y-6">
                {/* Upload screenshot */}
                <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-2">
                        Payment Screenshot <span className="text-red-500">*</span>
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        id="screenshot-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {!screenshot ? (
                        /* Drag and Drop Zone */
                        <div
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 ${
                                dragActive
                                    ? 'border-primary bg-[#FDF1ED]/40'
                                    : error
                                        ? 'border-red-300 bg-red-50/10 hover:border-red-400'
                                        : 'border-stone-300 hover:border-primary/60 bg-stone-50/20 hover:bg-stone-50/50'
                            }`}
                        >
                            <div className="p-3 rounded-full bg-[#FDF1ED] text-primary mb-3">
                                <ArrowUpload24Regular/>
                            </div>
                            <p className="text-sm font-bold text-stone-800">
                                Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-stone-600 mt-1">
                                Supports PNG, JPG, or JPEG (Max 5MB)
                            </p>
                            {error && (
                                <p className="mt-3 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100">
                                    {error}
                                </p>
                            )}
                        </div>
                    ) : (
                        /* Selected File Preview Mode */
                        <div
                            className="border border-stone-200 rounded-2xl p-4 bg-stone-50/30 flex flex-col sm:flex-row items-center gap-4">
                            {/* Thumbnail */}
                            <div
                                className="w-20 h-20 rounded-xl border border-stone-200 overflow-hidden shrink-0 bg-white flex items-center justify-center relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={URL.createObjectURL(screenshot)}
                                    alt="Payment screenshot preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <p className="text-sm font-bold text-stone-800 truncate" title={screenshot.name}>
                                    {screenshot.name}
                                </p>
                                <p className="text-xs text-stone-600 mt-0.5">
                                    {formatFileSize(screenshot.size)}
                                </p>
                                <span
                                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-150">
                  Ready to upload
                </span>
                            </div>

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={clearFile}
                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-stone-600 hover:text-red-650 hover:bg-red-50 border border-stone-200 hover:border-red-200 bg-white transition-all shadow-sm cursor-pointer"
                            >
                                <Delete20Regular className="shrink-0"/>
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
