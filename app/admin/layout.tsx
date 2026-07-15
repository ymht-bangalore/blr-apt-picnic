import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Manage registrations and verification status.",
};

export default function AdminLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
