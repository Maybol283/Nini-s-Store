import React, { FormEvent, useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

interface Props {
    token: string;
    email: string;
}

const ResetPassword = ({ token, email }: Props) => {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        password_confirmation?: string;
        token?: string;
    }>({});
    const [processing, setProcessing] = useState(false);
    const [emailInput, setEmailInput] = useState(email || "");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            "/reset-password",
            {
                token,
                email: emailInput,
                password,
                password_confirmation: passwordConfirmation,
            },
            {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-cream">
            <Head title="Reset Password" />

            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-green">
                    Reset Password
                </h1>

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
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                            required
                            readOnly={!!email}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirm New Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                            required
                        />
                    </div>

                    {errors.token && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
                            {errors.token}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green"
                    >
                        {processing ? "Resetting..." : "Reset Password"}
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
ResetPassword.layout = (page: React.ReactNode) => (
    <MainLayout title="Reset Password" children={page} />
);

export default ResetPassword;
