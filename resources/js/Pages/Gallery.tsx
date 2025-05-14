import React from "react";
import { Head } from "@inertiajs/react";
import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
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

    const trail = useTrail(images.length, {
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0 },
        config: { mass: 1, tension: 280, friction: 20 },
        delay: 100,
    });

    return (
        <ShopLayout>
            <Head title="Gallery" />

            <div className="flex-grow-0 min-h-screen pb-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-cream text-center mb-12">
                        Our Gallery
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {trail.map((props, index) => (
                            <animated.div
                                key={index}
                                style={{
                                    opacity: props.opacity,
                                    transform: props.y.to(
                                        (y) => `translateY(${y}px)`
                                    ),
                                }}
                                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(images[index])}
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
            <Transition appear show={!!selectedImage} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 hidden md:block"
                    onClose={() => setSelectedImage(null)}
                >
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-75" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="relative w-auto max-w-[90vw] transform overflow-hidden rounded-lg bg-pink p-8 shadow-xl transition-all">
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-cream hover:text-pink-400"
                                        onClick={() => setSelectedImage(null)}
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
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </ShopLayout>
    );
};

export default Gallery;
