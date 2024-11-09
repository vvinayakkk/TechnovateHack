import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Folder, FileText, BarChart, NotebookIcon, Atom, Menu, X, User2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import User from './User';

const Navbar = () => {
    const location = useLocation();
    const path = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="hidden md:flex w-[14%] flex-col justify-between items-center h-screen fixed left-0 bg-white dark:bg-black shadow-lg pt-6 pb-3">
                <Link to="/" className="flex space-x-2 items-center">
                    <div className="flex flex-col justify-center space-y-[-6px]">
                        <div className="flex">
                            <Atom className="h-6 text-black dark:text-white mr-2" />
                            <h1 className="text-xl font-semibold font-pop text-black dark:text-white mb-1 text-center">
                                EcoSphere
                            </h1>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 tracking-tight font-pop text-center">
                            Empowering Sustainability
                        </p>
                    </div>
                </Link>

                <div className="flex flex-col items-center space-y-2 w-[100%] mb-20">
                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/dashboard" className="flex justify-start items-center">
                            <Home className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Dashboard</p>
                        </Link>
                    </div>

                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/events" className="flex justify-start items-center">
                            <NotebookIcon className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Events</p>
                        </Link>
                    </div>

                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/leaderboard" className="flex justify-start items-center">
                            <Folder className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Leaderboard</p>
                        </Link>
                    </div>

                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/calendar" className="flex justify-start items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Calendar</p>
                        </Link>
                    </div>

                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/map" className="flex justify-start items-center">
                            <BarChart className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Car Pooling</p>
                        </Link>
                    </div>

                    <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                        <Link to="/community" className="flex justify-start items-center">
                            <BarChart className="h-4 w-4 mr-2" />
                            <p className="text-sm font-pop">Community</p>
                        </Link>
                    </div>
                </div>

                <div className="w-[85%] text-black dark:text-white py-2 px-4 rounded-lg transition duration-100 hover:bg-gray-300 dark:hover:bg-gray-700 hover:font-semibold">
                    <Link to="/" className="flex justify-start items-center">
                        <User2 className="h-4 w-4 mr-2" />
                        <p className="text-sm font-pop">Account</p>
                    </Link>
                </div>
            </nav>

            <nav className="md:hidden fixed top-0 left-0 w-full bg-white dark:bg-black shadow-lg z-50">
                <div className="flex justify-between items-center p-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <Atom className="h-6 text-black dark:text-white" />
                        <h1 className="text-xl font-semibold text-black dark:text-white">EcoSphere</h1>
                    </Link>

                    <div className="flex">
                        <ThemeToggle />
                        <button onClick={toggleMobileMenu} className="focus:outline-none mr-3">
                            {isMobileMenuOpen ? <X className="h-6 w-6 text-black dark:text-white" /> : <Menu className="h-6 w-6 text-black dark:text-white" />}
                        </button>
                        <User />
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="flex flex-col items-center space-y-4 pb-4">
                        <Link to="/dashboard" className="text-black dark:text-white hover:font-semibold">Dashboard</Link>
                        <Link to="/events" className="text-black dark:text-white hover:font-semibold">Events</Link>
                        <Link to="/leaderboard" className="text-black dark:text-white hover:font-semibold">Leaderboard</Link>
                        <Link to="/calendar" className="text-black dark:text-white hover:font-semibold">Calendar</Link>
                        <Link to="/maps" className="text-black dark:text-white hover:font-semibold">Maps</Link>
                        <Link to="/community" className="text-black dark:text-white hover:font-semibold">Community</Link>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
