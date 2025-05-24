import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { useTrail, useSpring, animated } from "@react-spring/web";

export default function Home({ message }: { message: string }) {
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
        <div className="flex items-center justify-center h-screen bg-cream font-thin">
            <Head title="About" />
            <div className="text-center ">
                <h1 className="text-7xl md:text-9xl xl:text-xxl mb-4">
                    {trail1.map((style, index) => (
                        //@ts-ignore I have no idea why typescript cannot understand this
                        <animated.span
                            key={`t1-${index}`}
                            style={
                                {
                                    ...style,
                                    display: "inline-block",
                                } as any
                            }
                            className=" text-green"
                        >
                            {letters1[index]}
                        </animated.span>
                    ))}
                </h1>
                <h1 className="text-7xl md:text-9xl xl:text-xxl mb-4">
                    {trail2.map((style, index) => (
                        //@ts-ignore
                        <animated.span
                            key={`t2-${index}`}
                            style={{
                                ...style,
                                display: "inline-block",
                            }}
                            className=" text-green"
                        >
                            {letters2[index]}
                        </animated.span>
                    ))}
                </h1>
            </div>
        </div>
    );
}
