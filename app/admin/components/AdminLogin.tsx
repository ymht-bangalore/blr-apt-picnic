'use client';

import React, {useState} from 'react';
import {LockShield24Regular, Eye24Regular, EyeOff24Regular} from '@fluentui/react-icons';

interface AdminLoginProps {
    onLoginSuccess: (password: string) => void;
}

export default function AdminLogin({onLoginSuccess}: AdminLoginProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!password.trim()) {
            setError('Please enter the admin password.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({password}),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                onLoginSuccess(password);
            } else {
                setError(data.error || 'Invalid password. Please try again.');
            }
        } catch (err: any) {
            setError('Connection error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div
                className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-150 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center text-center mb-8">
                    <div
                        className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-4 border border-primary/10 shadow-inner">
                        <LockShield24Regular className="w-8 h-8"/>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-stone-500 mt-2 max-w-xs">
                        Enter the common admin password to access registrations and screenshots
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-stone-700"
                        >
                            Password
                        </label>
                        <div className="relative rounded-2xl">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                                className="w-full pl-5 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:bg-white focus:ring-4 focus:ring-primary/15 focus:border-primary transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1.5 rounded-lg cursor-pointer"
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff24Regular className="w-5 h-5"/>
                                ) : (
                                    <Eye24Regular className="w-5 h-5"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl font-medium animate-pulse flex items-start gap-2">
                            <span className="font-bold shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 bg-primary text-white font-bold rounded-2xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                            loading
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-primary-hover hover:shadow-lg focus:ring-4 focus:ring-primary/20 active:scale-[0.98]'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Verifying password...
                            </>
                        ) : (
                            'Access Dashboard'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
