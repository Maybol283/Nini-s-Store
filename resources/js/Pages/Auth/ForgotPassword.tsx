import React, { FormEvent, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

interface Props {
    status?: string;
}

const ForgotPassword = ({ status }: Props) => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            "/forgot-password",
            { email },
            {
                onSuccess: () => {
                    setProcessing(false);
                    setEmail(""); // Clear email after successful submission
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-cream">
            <Head title="Forgot Password" />

            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-green">
                    Forgot Password
                </h1>

                <div className="mb-6 text-center text-gray-600">
                    <p>
                        No problem. Just let us know your email address and we
                        will email you a password reset link.
                    </p>
                </div>

                {status && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded">
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        {processing
                            ? "Sending..."
                            : "Email Password Reset Link"}
                    </button>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link
                                href="/login"
                                className="text-green hover:underline"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Set the layout
ForgotPassword.layout = (page: React.ReactNode) => (
    <MainLayout title="Forgot Password" children={page} />
);

export default ForgotPassword;
