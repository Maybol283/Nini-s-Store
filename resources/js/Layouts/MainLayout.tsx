import { Head } from "@inertiajs/react";
import React from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";

interface MainLayoutProps {
    title?: string;
    children: React.ReactNode;
}

export default function MainLayout({ title, children }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Page Title */}
            <Head title={title || "Default Title"} />

            {/* Header */}
            <Header />

            <main className="flex-grow flex overflow-x-auto snap-x snap-mandatory">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
