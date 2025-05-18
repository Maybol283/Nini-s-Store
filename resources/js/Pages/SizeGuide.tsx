import MainLayout from "@/Layouts/MainLayout";
import { useState } from "react";

const adultSizeGuideData = [
    {
        title: "Sweaters",
        measurements: [
            {
                label: "Chest (inches)",
                sizes: ["36-38", "39-41", "42-44", "45-47"],
            },
            {
                label: "Length (inches)",
                sizes: ["25-26", "26-27", "27-28", "28-29"],
            },
            {
                label: "Sleeve (inches)",
                sizes: ["23-24", "24-25", "25-26", "26-27"],
            },
        ],
    },
    {
        title: "Dresses",
        measurements: [
            {
                label: "Bust (inches)",
                sizes: ["34-36", "37-39", "40-42", "43-45"],
            },
            {
                label: "Waist (inches)",
                sizes: ["26-28", "29-31", "32-34", "35-37"],
            },
            {
                label: "Hips (inches)",
                sizes: ["36-38", "39-41", "42-44", "45-47"],
            },
            {
                label: "Length (inches)",
                sizes: ["35-36", "36-37", "37-38", "38-39"],
            },
        ],
    },
    {
        title: "Hats",
        measurements: [
            {
                label: "Head Circumference (inches)",
                sizes: ["21-21.5", "22-22.5", "23-23.5", "24-24.5"],
            },
        ],
    },
    {
        title: "Gloves",
        measurements: [
            {
                label: "Hand Circumference (inches)",
                sizes: ["7-7.5", "8-8.5", "9-9.5", "10-10.5"],
            },
            {
                label: "Length (inches)",
                sizes: ["7-7.5", "7.5-8", "8-8.5", "8.5-9"],
            },
        ],
    },
    {
        title: "Scarves",
        measurements: [
            {
                label: "Width (inches)",
                sizes: ["8-10", "10-12", "12-14", "14-16"],
            },
            {
                label: "Length (inches)",
                sizes: ["60-65", "65-70", "70-75", "75-80"],
            },
        ],
    },
];

const babySizeGuideData = [
    {
        title: "Sweaters",
        measurements: [
            {
                label: "Chest (inches)",
                sizes: ["16-17", "17-18", "18-19", "19-20", "20-21"],
            },
            {
                label: "Length (inches)",
                sizes: ["10-11", "11-12", "12-13", "13-14", "14-15"],
            },
            {
                label: "Sleeve (inches)",
                sizes: ["7-8", "8-9", "9-10", "10-11", "11-12"],
            },
        ],
        sizeLabels: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
    },
    {
        title: "Dresses",
        measurements: [
            {
                label: "Chest (inches)",
                sizes: ["16-17", "17-18", "18-19", "19-20", "20-21"],
            },
            {
                label: "Waist (inches)",
                sizes: ["16-17", "17-18", "18-19", "19-20", "20-21"],
            },
            {
                label: "Length (inches)",
                sizes: ["14-15", "15-16", "16-17", "17-18", "18-19"],
            },
        ],
        sizeLabels: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
    },
    {
        title: "Hats",
        measurements: [
            {
                label: "Head Circumference (inches)",
                sizes: ["13-14", "14-15", "15-16", "16-17", "17-18"],
            },
        ],
        sizeLabels: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
    },
    {
        title: "Gloves/Mittens",
        measurements: [
            {
                label: "Hand Width (inches)",
                sizes: ["2.5-3", "3-3.5", "3.5-4", "4-4.5", "4.5-5"],
            },
            {
                label: "Length (inches)",
                sizes: ["3-3.5", "3.5-4", "4-4.5", "4.5-5", "5-5.5"],
            },
        ],
        sizeLabels: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
    },
    {
        title: "Scarves",
        measurements: [
            {
                label: "Width (inches)",
                sizes: ["3-4", "4-5", "5-6", "6-7", "7-8"],
            },
            {
                label: "Length (inches)",
                sizes: ["20-25", "25-30", "30-35", "35-40", "40-45"],
            },
        ],
        sizeLabels: ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"],
    },
];

const SizeGuide = () => {
    const [activeCategory, setActiveCategory] = useState<"adult" | "baby">(
        "adult"
    );

    return (
        <div className="overflow-auto bg-cream flex flex-col items-center justify-start min-h-screen min-w-full pt-8 xl:pt-16 text-green">
            <h1 className="text-4xl xl:text-6xl mb-8">Size Guide</h1>

            <div className="flex justify-center gap-6 mb-8">
                <button
                    className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                        activeCategory === "adult"
                            ? "bg-green text-white"
                            : "bg-white text-green hover:bg-green hover:bg-opacity-10"
                    }`}
                    onClick={() => setActiveCategory("adult")}
                >
                    Adult Sizes
                </button>
                <button
                    className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                        activeCategory === "baby"
                            ? "bg-pink text-white"
                            : "bg-white text-pink hover:bg-pink hover:bg-opacity-10"
                    }`}
                    onClick={() => setActiveCategory("baby")}
                >
                    Baby Sizes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-16 w-full max-w-7xl px-4">
                {(activeCategory === "adult"
                    ? adultSizeGuideData
                    : babySizeGuideData
                ).map((table, tableIndex) => (
                    <div key={tableIndex} className="mb-8">
                        <h2
                            className={`text-3xl xl:text-4xl mb-4 ${
                                activeCategory === "adult"
                                    ? "text-green"
                                    : "text-pink"
                            }`}
                        >
                            {table.title}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="text-md xl:text-lg w-full border-collapse border border-gray-300 text-green">
                                <thead>
                                    <tr
                                        className={
                                            activeCategory === "adult"
                                                ? "bg-green text-white"
                                                : "bg-pink text-white"
                                        }
                                    >
                                        <th className="border border-gray-300 p-2">
                                            Measurement
                                        </th>
                                        {activeCategory === "adult" ? (
                                            <>
                                                <th className="border border-gray-300 p-2">
                                                    S
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    M
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    L
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    XL
                                                </th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="border border-gray-300 p-2">
                                                    0-3M
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    3-6M
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    6-12M
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    12-18M
                                                </th>
                                                <th className="border border-gray-300 p-2">
                                                    18-24M
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.measurements.map(
                                        (measurement, measurementIndex) => (
                                            <tr
                                                key={measurementIndex}
                                                className={
                                                    measurementIndex % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }
                                            >
                                                <td className="border border-gray-300 p-2 font-medium">
                                                    {measurement.label}
                                                </td>
                                                {measurement.sizes.map(
                                                    (size, sizeIndex) => (
                                                        <td
                                                            key={sizeIndex}
                                                            className="border border-gray-300 p-2 text-center"
                                                        >
                                                            {size}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SizeGuide;

SizeGuide.layout = (page: React.ReactNode) => (
    <MainLayout title="Size Guide" children={page} />
);
