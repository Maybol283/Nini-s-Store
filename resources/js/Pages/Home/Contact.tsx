import { Head, useForm } from "@inertiajs/react";
import { animated, useTrail, useInView } from "@react-spring/web";

export default function Contact() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        message: "",
    });

    const [ref, inView] = useInView({
        once: true,
        amount: 0.1,
    });

    const formFields = ["Name", "Email", "Message"];

    const trail = useTrail(formFields.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: {
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0px)" : "translateY(20px)",
        },
        delay: 200,
        config: { mass: 1, tension: 280, friction: 20 },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/contact", {
            onSuccess: () => {
                // Clear form
                setData({
                    name: "",
                    email: "",
                    message: "",
                });
                // Show success message
                alert("Message sent successfully!");
            },
            onError: () => {
                alert("Failed to send message. Please try again.");
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-cream font-thin p-8">
            <Head title="Contact" />
            <h1 className="text-6xl md:text-8xl text-center mb-24 md:mb-12">
                Contact Me
            </h1>

            <form
                ref={ref}
                onSubmit={handleSubmit}
                className="w-full max-w-lg space-y-8"
            >
                {trail.map((style, index) => (
                    //@ts-ignore
                    <animated.div key={index} style={style as any}>
                        {index === 2 ? (
                            <div className="space-y-2">
                                <label className="block text-4xl">
                                    {formFields[index]}
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    className="w-full h-32 bg-transparent border-b border-green focus:outline-none resize-none font-sans bg-beige rounded-md"
                                    placeholder="Enter your message..."
                                    required
                                />
                                {errors.message && (
                                    <div className="text-red-500">
                                        {errors.message}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-4xl">
                                    {formFields[index]}
                                </label>
                                <input
                                    type={index === 1 ? "email" : "text"}
                                    value={index === 0 ? data.name : data.email}
                                    onChange={(e) =>
                                        setData(
                                            index === 0 ? "name" : "email",
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-transparent border-b border-green focus:outline-none font-sans bg-beige rounded-md"
                                    placeholder={
                                        index === 1
                                            ? "Enter your email..."
                                            : "Enter your name..."
                                    }
                                    required
                                />
                                {errors[index === 0 ? "name" : "email"] && (
                                    <div className="text-red-500">
                                        {errors[index === 0 ? "name" : "email"]}
                                    </div>
                                )}
                            </div>
                        )}
                    </animated.div>
                ))}
                {/* @ts-ignore */}
                <animated.div style={trail[trail.length - 1] as any}>
                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-8 px-8 py-2 border border-green hover:bg-green hover:text-cream transition-colors duration-300 disabled:opacity-50"
                    >
                        {processing ? "Sending..." : "Send"}
                    </button>
                </animated.div>
            </form>
        </div>
    );
}
