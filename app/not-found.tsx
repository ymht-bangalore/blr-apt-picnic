import React from 'react';
import type {Metadata} from "next";
import NotFoundClient from './components/NotFoundClient';

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "Oops! The page you are looking for has taken a detour."
};

export default function NotFound() {
    return <NotFoundClient/>;
}
