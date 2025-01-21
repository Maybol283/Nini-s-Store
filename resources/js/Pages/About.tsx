import MainLayout from "@/Layouts/MainLayout";

export default function About() {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-cream font-thin">
            Hello World
        </div>
    );
}

// Attach the layout
About.layout = (page: React.ReactNode) => (
    <MainLayout title="Dashboard" children={page} />
);
