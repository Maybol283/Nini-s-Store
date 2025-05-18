import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

const VerifyEmail = () => {
    const [isResending, setIsResending] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const resendEmail = async () => {
        setIsResending(true);
        try {
            router.post(route("verification.send"));
            setStatus(
                "A new verification link has been sent to your email address."
            );
        } catch (error) {
            setStatus("Something went wrong. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-cream">
            <Head title="Email Verification" />

            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-green">
                    Verify your Email
                </h1>

                <div className="mb-6 text-center text-gray-600">
                    <p className="mb-4">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you?
                    </p>
                    <p>
                        If you didn't receive the email, we will gladly send you
                        another.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 rounded-md p-4 bg-green-50 border border-green-200 text-green-700">
                        {status}
                    </div>
                )}

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={resendEmail}
                        disabled={isResending}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        {isResending
                            ? "Resending..."
                            : "Resend Verification Email"}
                    </button>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="text-sm text-center text-gray-500 hover:text-gray-700"
                    >
                        Log Out
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Set the layout
VerifyEmail.layout = (page: React.ReactNode) => (
    <MainLayout title="Verify Email" children={page} />
);

export default VerifyEmail;
