import React from "react";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Header/Footer";

function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh bg-cream flex flex-col">
            <Header />
            <main className="flex-grow overflow-auto scrollbar-bottom">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default ShopLayout;
