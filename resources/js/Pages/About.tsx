import React from "react";
import { Head } from "@inertiajs/react";
import { useTrail, animated } from "@react-spring/web";

const About = ({ message }: { message: string }) => {
    const title = "Nini's Garments";

    const [t1, t2] = title.split(" ");

    const letters1 = t1.split("");
    const letters2 = t2.split("");

    //Create trail animation

    const trail1 = useTrail(letters1.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        delay: 200, // Delay before the animation starts
        config: { tension: 200, friction: 15 }, // Animation physics
    });

    const trail2 = useTrail(letters2.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        delay: 1000, // Add extra delay for the second word
        config: { tension: 200, friction: 15 },
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <Head title="About" />
            <div className="text-center">
                <h1 className="text-9xl mb-4">
                    {trail1.map((style, index) => (
                        <animated.span
                            key={`t1-${index}`}
                            style={{ ...style, display: "inline-block" }}
                            children={letters1[index]} // Pass children as a prop explicitly
                        />
                    ))}
                </h1>
                <h1 className="text-9xl mb-4">
                    {trail2.map((style, index) => (
                        <animated.span
                            key={`t2-${index}`}
                            style={{ ...style, display: "inline-block" }}
                        >
                            {letters2[index]}
                        </animated.span>
                    ))}
                </h1>
            </div>
        </div>
    );
};

export default About;
