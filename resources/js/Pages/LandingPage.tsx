import MainLayout from "@/Layouts/MainLayout";
import Home from "./Home/Home";
import GalleryPreview from "./Home/GalleryPreview";
import Contact from "./Home/Contact";
import About from "./Home/About";
const Dashboard = ({ message }: { message: string }) => {
    return (
        <div className="flex min-w-full text-green">
            {/* Render Home Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <Home message={message} />
            </section>

            <section className="flex-shrink-0 w-screen snap-center">
                <About />
            </section>
            {/* Render Home Component */}
            <section className="flex flex-shrink-0 w-screen snap-center">
                <GalleryPreview />
            </section>

            {/* Render Contact Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <Contact />
            </section>
        </div>
    );
};

// Attach the layout
Dashboard.layout = (page: React.ReactNode) => (
    <MainLayout title="Dashboard" children={page} />
);

export default Dashboard;
