import React, { useState, useEffect } from "react";
import { useInView, useTrail, animated } from "@react-spring/web";
import { Link } from "@inertiajs/react";

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
        <div className="bg-cream h-screen flex flex-col xl:pt-8">
            <div
                ref={ref}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 overflow-hidden h-[75vh]"
            >
                {trail.map((style, index) => {
                    const { url, alt } = featuredImages[index];
                    return (
                        <animated.div
                            key={index}
                            style={style}
                            className="relative h-full"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={url}
                                    alt={alt}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </animated.div>
                    );
                })}
            </div>

            <div className="mt-2 py-2 text-center">
                <Link
                    href="/"
                    type="submit"
                    className="text-outline-green px-8 py-2 border border-green hover:bg-green hover:text-cream transition-colors duration-300"
                >
                    View All Images
                </Link>
            </div>
        </div>
    );
}
