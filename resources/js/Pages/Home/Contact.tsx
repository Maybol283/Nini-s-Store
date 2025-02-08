import { animated, useTrail, useInView } from "@react-spring/web";

export default function Contact() {
    const [ref, inView] = useInView({
        once: true,
        amount: 0.1,
    } as any);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-cream font-thin p-8">
            <h1 className="text-8xl text-center mb-8">Contact Me</h1>

            <form ref={ref} className="w-full max-w-lg space-y-8">
                {trail.map((style, index) => (
                    <animated.div key={index} style={style as any}>
                        {index === 2 ? (
                            <div className="space-y-2">
                                <label className="block text-4xl">
                                    {formFields[index]}
                                </label>
                                <textarea
                                    className="w-full h-32 bg-transparent border-b border-green focus:outline-none resize-none font-sans bg-beige rounded-md"
                                    placeholder="Enter your message..."
                                    required
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-4xl">
                                    {formFields[index]}
                                </label>
                                <input
                                    type={index === 1 ? "email" : "text"}
                                    className="w-full bg-transparent border-b border-green focus:outline-none font-sans bg-beige rounded-md"
                                    placeholder={
                                        index === 1
                                            ? "Enter your email..."
                                            : "Enter your name..."
                                    }
                                    required
                                />
                            </div>
                        )}
                    </animated.div>
                ))}
                <animated.div style={trail[trail.length - 1] as any}>
                    <button
                        type="submit"
                        className="mt-8 px-8 py-2 border border-green hover:bg-green hover:text-cream transition-colors duration-300"
                    >
                        Send
                    </button>
                </animated.div>
            </form>
        </div>
    );
}
