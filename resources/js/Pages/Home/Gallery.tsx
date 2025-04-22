import React, { useState, useEffect } from "react";
import { useInView } from "@react-spring/web";
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
            alt: `Gallery image ${i}`,
        };
    }),
    gallery_mobile: Array.from({ length: 23 - 3 + 1 }, (_, index) => {
        const i = index + 3;
        return {
            url: `./app/storage/public/mobile_gallery_images/IMG-20250123-WA0${padToFour(
                i
            )}`,
            alt: `Gallery image ${i}`,
        };
    }),
};

export default function Gallery() {
    const [currentGallery, setCurrentGallery] = useState(pictures.gallery);
    const [visible, setVisible] = useState(false);

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

    // Intersection Observer: container in view triggers the animation
    const [ref, inView] = useInView({
        rootMargin: "-100px",
        once: true,
    });

    // Handle visibility when in view
    useEffect(() => {
        if (inView) {
            setVisible(true);
        }
    }, [inView]);

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col">
            <h2 className="text-3xl font-semibold mb-6 text-center">Gallery</h2>
            <div
                ref={ref}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 flex-grow"
            >
                {featuredImages.map((image, index) => (
                    <div
                        key={index}
                        className={`group relative bg-white rounded-lg shadow overflow-hidden transition-all duration-700 transform ${
                            visible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-5"
                        }`}
                        style={{
                            transitionDelay: `${index * 100}ms`,
                        }}
                    >
                        <div className="aspect-square w-full overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.alt}
                                className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-90"
                                loading="lazy"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 md:mt-24 text-center">
                <Link
                    href="/"
                    className="inline-block bg-cream text-green border border-green px-6 py-3 rounded-md hover:bg-green hover:text-cream transition-colors duration-300 font-medium"
                >
                    View All Images
                </Link>
            </div>
        </div>
    );
}
