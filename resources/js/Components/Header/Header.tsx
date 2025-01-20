const Header = () => {
    return (
        <header className="bg-brown text-cream py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Knitted With Love</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/" className="hover:text-pink-400">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:text-pink-400">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/shop" className="hover:text-pink-400">
                                Shop
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
