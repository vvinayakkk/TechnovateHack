import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import User from '../components/User';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200">
      <Navbar />
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl"></h1>
        <div className="flex justify-around">
          <ThemeToggle />
          <User />
        </div>
      </header>
      <main className="p-4">
        <div className="ml-0 mr-0 md:ml-[15%] md:mr-[2%] lg:ml-[15%] lg:mr-[2%]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout