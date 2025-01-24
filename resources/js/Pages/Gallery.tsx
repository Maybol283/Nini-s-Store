import React, { useState, useEffect } from "react";
import { useInView, useTrail, animated } from "@react-spring/web";

function padToFour(num: number) {
    return String(num).padStart(3, "0");
}

// Generate gallery arrays...
const pictures = {
    gallery: Array.from({ length: 23 - 3 + 1 }, (_, index) => {
        const i = index + 3;
        return {
            url: `storage/gallery_images/IMG-20250123-WA0${padToFour(i)}.webp`,
            alt: `1${i}`,
        };
    }),
    gallery_mobile: Array.from({ length: 23 - 3 + 1 }, (_, index) => {
        const i = index + 3;
        return {
            url: `./app/storage/public/mobile_gallery_images/IMG-20250123-WA0${padToFour(
                i
            )}`,
            alt: `1${i}`,
        };
    }),
};

export default function Gallery() {
    const [currentGallery, setCurrentGallery] = useState(pictures.gallery);

    // Switch images based on screen width
    useEffect(() => {
        const updateGallery = () => {
            const isMobile = window.innerWidth <= 768;
            setCurrentGallery(
                isMobile ? pictures.gallery_mobile : pictures.gallery
            );
        };
        updateGallery();
        window.addEventListener("resize", updateGallery);
        return () => window.removeEventListener("resize", updateGallery);
    }, []);

    // We only want the first 8 images for this "featured" view
    const featuredImages = currentGallery.slice(0, 8);

    // Intersection Observer: container in view triggers the trail animation
    const [ref, inView] = useInView({
        rootMargin: "-100px",
        once: true,
    });

    // useTrail to create stagger for the items on this page (the featured 8)
    const trail = useTrail(featuredImages.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: {
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
        },
        delay: 200,
        config: { mass: 1, tension: 280, friction: 30 },
    });

    return (
        <div className="bg-cream min-h-screen p-2 md:py-10 text-center">
            <h2 className="text-lg md:text-2xl font-bold mb-4">
                Here is some of my work
            </h2>

            <div
                ref={ref}
                // 2 columns on small screens, 4 columns on md and above
                className="grid grid-cols-2 md:grid-cols-4 gap-2 place-content-center"
            >
                {trail.map((style, index) => {
                    const { url, alt } = featuredImages[index];
                    return (
                        <animated.div
                            key={index}
                            style={style}
                            // Give each cell a fixed height (e.g., 12rem via Tailwind's "h-48")
                            className="w-full h-80 xl:h-[30rem] overflow-hidden"
                        >
                            <img
                                src={url}
                                alt={alt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </animated.div>
                    );
                })}
            </div>

            {/* Button or link to view full gallery in a separate page */}
            <div className="mt-6 text-center">
                <a
                    href="/all-gallery" // or use React Router <Link to="/all-gallery">...</Link>
                    className="inline-block px-4 py-2 bg-brown hover:bg-green text-white rounded transition-transform hover:scale-105"
                >
                    View All Images
                </a>
            </div>
        </div>
    );
}
