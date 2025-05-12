import { Head } from "@inertiajs/react";
import React from "react";
import Header from "../Components/Header/Header";
import Footer from "../Components/Header/Footer";

interface MainLayoutProps {
    title?: string;
    children: React.ReactNode;
}

const handleHorizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    // Prevent default vertical scrolling
    e.preventDefault();

    // Scroll horizontally instead
    container.scrollBy({
        left: e.deltaY, // Use vertical scroll delta for horizontal scrolling
        behavior: "smooth",
    });
};

export default function MainLayout({ title, children }: MainLayoutProps) {
    return (
        <div className="bg-cream flex flex-col max-h-screen text-outline-green">
            {/* Page Title */}
            <Head title={title || "Default Title"} />

            {/* Header */}
            <Header />

            <main
                className="text-green flex-grow flex overflow-y-hidden overflow-x-auto snap-x snap-mandatory scrollbar-bottom"
                onWheel={handleHorizontalScroll}
            >
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
