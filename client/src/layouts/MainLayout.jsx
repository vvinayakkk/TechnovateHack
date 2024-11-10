import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import User from '../components/User';
import Navbar2 from '@/components/Navbar2';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200">
      <Navbar />
      <header className="mb-5 lg:mb-1 pr-4 pt-3 flex justify-between items-center">
        <h1 className="text-2xl"></h1>
        <div className="flex justify-around">
          <ThemeToggle />
          <User />
        </div>
      </header>
      <main >
        <div className="ml-0 mr-0 md:ml-[15%] md:mr-[2%] lg:ml-[15%] lg:mr-[2%]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout