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
        <div className="flex items-center justify-center h-screen w-screen bg-cream text-green font-thin">
            <p className="text-7xl w-[30%]" ref={ref}>
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

            <img
                src="storage/gallery_images/IMG-20250124-WA0001.jpg"
                className="size-[30%] object-contain"
            ></img>
        </div>
    );
}
