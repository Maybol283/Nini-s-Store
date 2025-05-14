import ShopLayout from "@/Layouts/ShopLayout";
import { animated, useTrail, useInView } from "@react-spring/web";

export default function About() {
    const [ref, inView] = useInView({
        once: true, // Animation plays only once
        threshold: 0.1, // Triggers when 10% of element is visible
    } as any);

    const about_text =
        "Hi, I'm Nini. I love to crochet and I want to share the creations of my passion with the rest of the world";

    const about_text_array = about_text.split(" ");

    const trail = useTrail(about_text_array.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: {
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0px)" : "translateY(20px)",
        },
        config: { mass: 1, tension: 280, friction: 20 },
        delay: 100,
    });

    return (
        <div className="font-dynapuff grid grid-rows-2 md:flex items-center justify-center h-[90vh] w-screen bg-cream text-green -space-y-48 sm:space-y-0">
            <img
                src="/storage/Nini-Images/Nini-Final.webp"
                alt="blob"
                className="z-index-10 size-[clamp(300px,50vw,1000px)] justify-self-center"
            />
            <p
                className="text-center text-[clamp(2.5rem,4vw,3.75rem)] w-[90%] sm:w-[80%] md:w-[30%] justify-self-center "
                ref={ref}
            >
                {about_text_array.map((text, index) => (
                    <animated.span
                        key={index}
                        style={trail[index]}
                        className="inline-block mr-[0.3em]"
                    >
                        {text}
                    </animated.span>
                ))}
            </p>
        </div>
    );
}
