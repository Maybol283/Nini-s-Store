import MainLayout from "@/Layouts/MainLayout";
import Home from "./Home";
import About from "./About";
import Gallery from "./Gallery";

const Dashboard = ({ message }: { message: string }) => {
    return (
        <div className="flex min-w-full text-cream">
            {/* Render Home Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <Home message={message} />
            </section>

            {/* Render About Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <About />
            </section>

            {/* Render Home Component */}
            <section className="flex-shrink-0 w-screen snap-center">
                <Gallery />
            </section>
        </div>
    );
};

// Attach the layout
Dashboard.layout = (page: React.ReactNode) => (
    <MainLayout title="Dashboard" children={page} />
);

export default Dashboard;
