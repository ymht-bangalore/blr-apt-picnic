'use client';

import React from 'react';
import {
    Info20Regular,
    Warning20Filled,
    CheckmarkCircle20Regular,
    DismissCircle20Regular
} from '@fluentui/react-icons';

interface AlertProps {
    type?: 'info' | 'warning' | 'error' | 'success' | 'secondary';
    message: string;
    className?: string;
}

export default function Alert({type = 'info', message, className = ''}: AlertProps) {
    const typeStyles = {
        info: {
            bg: 'bg-stone-50/80',
            border: 'border-stone-150',
            text: 'text-stone-700',
            iconColor: 'text-stone-500',
            Icon: Info20Regular
        },
        warning: {
            bg: 'bg-amber-50/70',
            border: 'border-amber-200/60',
            text: 'text-amber-800',
            iconColor: 'text-amber-600',
            Icon: Warning20Filled
        },
        secondary: {
            bg: 'bg-secondary-light',
            border: 'border-secondary/15',
            text: 'text-secondary-hover font-semibold',
            iconColor: 'text-secondary',
            Icon: Warning20Filled
        },
        error: {
            bg: 'bg-red-50/70',
            border: 'border-red-200/60',
            text: 'text-red-800',
            iconColor: 'text-red-600',
            Icon: DismissCircle20Regular
        },
        success: {
            bg: 'bg-green-50/70',
            border: 'border-green-200/60',
            text: 'text-green-800',
            iconColor: 'text-green-600',
            Icon: CheckmarkCircle20Regular
        }
    };

    const styles = typeStyles[type];
    const Icon = styles.Icon;

    return (
        <div
            className={`flex items-start gap-2.5 px-4 py-3 text-xs rounded-xl border leading-relaxed ${styles.bg} ${styles.border} ${styles.text} ${className}`}>
            <Icon className={`shrink-0 w-4.5 h-4.5 mt-0.5 ${styles.iconColor}`}/>
            <div className="flex-1">{message}</div>
        </div>
    );
}
