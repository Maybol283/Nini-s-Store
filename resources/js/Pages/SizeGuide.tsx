import MainLayout from "@/Layouts/MainLayout";

const sizeGuideData = [
    {
        title: "Sweaters",
        measurements: [
            { label: "Chest (inches)", sizes: ["", "", "", ""] },
            { label: "Length (inches)", sizes: ["", "", "", ""] },
        ],
    },
    {
        title: "Skirts",
        measurements: [
            { label: "Waist (inches)", sizes: ["", "", "", ""] },
            { label: "Length (inches)", sizes: ["", "", "", ""] },
        ],
    },
    {
        title: "Hats",
        measurements: [
            { label: "Head Circumference (inches)", sizes: ["", "", "", ""] },
        ],
    },
    {
        title: "Gloves",
        measurements: [
            { label: "Hand Circumference (inches)", sizes: ["", "", "", ""] },
            { label: "Length (inches)", sizes: ["", "", "", ""] },
        ],
    },
];

const SizeGuide = () => {
    return (
        <div className="bg-cream flex flex-col items-center justify-start min-h-screen min-w-full pt-8 xl:pt-16 text-white">
            <h1 className="text-4xl xl:text-8xl mb-8">Size Guide</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-16 w-full max-w-7xl ">
                {sizeGuideData.map((table, tableIndex) => (
                    <div key={tableIndex}>
                        <h2 className="text-4xl xl:text-6xl mb-4">
                            {table.title}
                        </h2>
                        <table className="text-2xl xl:text-3xl w-full border-collapse border border-gray-300  text-outline-green">
                            <thead>
                                <tr className="bg-pink">
                                    <th className="border border-gray-300 p-2">
                                        Measurement
                                    </th>
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
                                </tr>
                            </thead>
                            <tbody>
                                {table.measurements.map(
                                    (measurement, measurementIndex) => (
                                        <tr key={measurementIndex}>
                                            <td className="border border-gray-300 p-2">
                                                {measurement.label}
                                            </td>
                                            {measurement.sizes.map(
                                                (size, sizeIndex) => (
                                                    <td
                                                        key={sizeIndex}
                                                        className="border border-gray-300 p-2"
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
                ))}
            </div>
        </div>
    );
};

export default SizeGuide;

SizeGuide.layout = (page: React.ReactNode) => (
    <MainLayout title="Size Guide" children={page} />
);
