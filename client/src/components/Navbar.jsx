import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ShoppingCart,ChartArea ,Folder, FileText, BarChart, NotebookIcon, Atom, Menu, X, User2, Leaf, CalendarSearch, LayoutDashboard, Medal, Car, MessageSquareDot, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import User from './User';

const Navbar = () => {
    const location = useLocation();
    const path = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Function to close the mobile menu when a tab is clicked
    const closeMobileMenu = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex w-[14%] flex-col justify-between items-center h-screen fixed left-0 bg-white dark:bg-black shadow-lg pt-6 pb-3 transition-all">
                <Link to="/" className="flex space-x-2 items-center mb-10">
                    <div className="flex flex-col justify-center space-y-[-6px]">
                        <div className="flex">
                            <Leaf className="w-6 h-6 text-green-500 mr-2 motion-scale-in-[0.5] motion-rotate-in-[-10deg] motion-blur-in-[10px] motion-delay-[0.75s]/rotate motion-delay-[0.75s]/blur " />
                            <h1 className="text-xl md:text-2xl font-bold">CarbonTrace</h1>
                        </div>
                    </div>
                </Link>

                {/* Menu Items */}
                <div className="flex flex-col items-center space-y-6 w-[100%]">
                    {[
                        { to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, text: 'Dashboard' },
                        { to: '/events', icon: <CalendarSearch className="h-4 w-4 mr-2" />, text: 'Events' },
                        { to: '/leaderboard', icon: <Medal className="h-4 w-4 mr-2" />, text: 'Leaderboard' },
                        { to: '/map', icon: <Car className="h-4 w-4 mr-2" />, text: 'Car Pooling' },
                        { to: '/products', icon: <ShoppingCart className="h-4 w-4 mr-2" />, text: 'Products' },
                        { to: '/analytics', icon: <ChartArea className="h-4 w-4 mr-2" />, text: 'Analytics' },
                        { to: '/smart-insights', icon: <Clock className="h-4 w-4 mr-2" />, text: 'Smart Insights' }
                        
                    ].map(({ to, icon, text }) => (
                        <div key={to} className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                            <Link to={to} className="flex justify-start items-center" onClick={closeMobileMenu}>
                                {icon}
                                <p className="text-sm font-pop">{text}</p>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                    <Link to="/" className="flex justify-start items-center" onClick={closeMobileMenu}>
                        <User2 className="h-4 w-4 mr-2" />
                        <p className="text-sm font-pop">Account</p>
                    </Link>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-0 left-0 w-full bg-white dark:bg-black shadow-lg z-50">
                <div className="flex justify-between items-center p-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <Leaf className="w-6 h-6 text-green-500 mr-2 motion-scale-in-[0.5] motion-rotate-in-[-10deg] motion-blur-in-[10px] motion-delay-[0.75s]/rotate motion-delay-[0.75s]/blur " />
                        <h1 className="text-xl md:text-2xl font-bold">CarbonTrace</h1>
                    </Link>

                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        <button onClick={toggleMobileMenu} className="focus:outline-none">
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6 text-black dark:text-white" />
                            ) : (
                                <Menu className="h-6 w-6 text-black dark:text-white" />
                            )}
                        </button>
                        <User />
                    </div>
                </div>

                {/* Mobile Menu Items */}
                {isMobileMenuOpen && (
                    <div className="flex flex-col items-center space-y-4 pb-4 transition-all bg-white dark:bg-black">
                        {[
                            { to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, text: 'Dashboard' },
                            { to: '/events', icon: <CalendarSearch className="h-4 w-4 mr-2" />, text: 'Events' },
                            { to: '/leaderboard', icon: <Medal className="h-4 w-4 mr-2" />, text: 'Leaderboard' },
                            { to: '/map', icon: <Car className="h-4 w-4 mr-2" />, text: 'Car Pooling' },
                            { to: '/products', icon: <ShoppingCart className="h-4 w-4 mr-2" />, text: 'Products' },
                            { to: '/analytics', icon: <ChartArea className="h-4 w-4 mr-2" />, text: 'Analytics' }
                        ].map(({ to, icon, text }) => (
                            <Link
                                key={to}
                                to={to}
                                className="text-black flex items-center dark:text-white hover:font-semibold text-lg"
                                    onClick={closeMobileMenu}
                            >
                                {icon} {text}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
