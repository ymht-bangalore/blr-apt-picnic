import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Analytics} from "@vercel/analytics/next"
import {SpeedInsights} from "@vercel/speed-insights/next"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Picnic Registration Confirmation | Bangalore",
        template: "%s | BLR Picnic"
    },
    description: "Confirm your registration for the picnic with Aptaputra bhaio by paying the registration amount.",
    authors: [{name: "Divyansh Gemini"}],
    creator: "Divyansh Gemini",
    openGraph: {
        type: "website",
        locale: "en_US",
        title: "Picnic Registration Confirmation | Bangalore",
        description: "Confirm your registration for the picnic with Aptaputra bhaio by paying the registration amount.",
        siteName: "Craft",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Picnic Registration Confirmation | Bangalore",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Picnic Registration Confirmation | Bangalore",
        description: "Confirm your registration for the picnic with Aptaputra bhaio by paying the registration amount.",
        images: ["/og-image.jpg"],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Picnic Registration Confirmation | Bangalore",
    },
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <SpeedInsights/>

        <Analytics/>

        <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
