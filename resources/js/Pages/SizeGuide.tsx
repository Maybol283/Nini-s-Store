import MainLayout from "@/Layouts/MainLayout";

const SizeGuide = () => {
    return (
        <div className="bg-cream flex flex-col items-center justify-center min-h-screen min-w-full p-8">
            <h1 className="text-6xl mb-8">Size Guide</h1>

            {/* Size Guide Tables */}
            <div className="text-4xl grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
                {/* Sweaters Table */}
                <div>
                    <h2 className="mb-4">Sweaters</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="text-4xl bg-gray-100">
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
                        <tbody className="text-2xl">
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    Chest (inches)
                                </td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    Length (inches)
                                </td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Skirts Table */}
                <div>
                    <h2 className="mb-4">Skirts</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
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
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    Waist (inches)
                                </td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    Length (inches)
                                </td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Hats Table */}
                <div>
                    <h2 className="mb-4">Hats</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
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
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    Head Circumference (inches)
                                </td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                                <td className="border border-gray-300 p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;

SizeGuide.layout = (page: React.ReactNode) => (
    <MainLayout title="Size Guide" children={page} />
);
