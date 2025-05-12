import MainLayout from "@/Layouts/MainLayout";
import Home from "./Home/Home";
import Gallery from "./Home/Gallery";
import Contact from "./Home/Contact";

const Dashboard = ({ message }: { message: string }) => {
    return (
        <div className="flex min-w-full text-white">
            {/* Render Home Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <Home message={message} />
            </section>

            {/* Render Home Component */}
            <section className="flex flex-shrink-0 w-screen snap-center">
                <Gallery />
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
