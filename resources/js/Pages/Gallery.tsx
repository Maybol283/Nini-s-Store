import React from "react";
import { Head } from "@inertiajs/react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTrail, animated } from "@react-spring/web";

import ShopLayout from "@/Layouts/ShopLayout";

interface GalleryImage {
    src: string;
    alt: string;
}

interface Props {
    images: GalleryImage[];
}

const Gallery = ({ images }: Props) => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
        null
    );
    const [isOpen, setIsOpen] = useState(false);
    const trail = useTrail(images.length, {
        from: { opacity: 0, transform: "translateY(20px)" },
        to: { opacity: 1, transform: "translateY(0px)" },
        config: { tension: 200, friction: 20 },
    });

    const openModal = (image: GalleryImage) => {
        setSelectedImage(image);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <ShopLayout>
            <Head title="Gallery" />

            <div className="min-h-screen pb-4 px-4 sm:px-6 lg:px-8 flex-none overflow-y-hidden">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-green text-center my-12">
                        Gallery
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {trail.map((props, index) => (
                            //@ts-ignore
                            <animated.div
                                key={index}
                                style={props}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => openModal(images[index])}
                            >
                                <img
                                    src={images[index].src}
                                    alt={images[index].alt}
                                    className="w-full h-full object-cover"
                                />
                            </animated.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Modal */}

            <Dialog
                as="div"
                className="relative z-50 hidden md:block"
                onClose={closeModal}
                open={isOpen}
                transition
            >
                <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-75" />

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="
                            transition duration-300 ease-out
                            data-[closed]:opacity-0
                            data-[closed]:data-[enter]:scale-95
                            data-[closed]:data-[leave]:scale-95
                            relative w-auto rounded-lg bg-pink p-8 shadow-xl"
                        >
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-cream hover:text-green"
                                onClick={closeModal}
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            {selectedImage && (
                                <img
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    className="w-auto h-auto max-h-[80vh] max-w-[85vw] object-contain"
                                />
                            )}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </ShopLayout>
    );
};

export default Gallery;
