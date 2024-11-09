// import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ClerkProvider, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import LandingPage from '@/pages/LandingPage';
import MainLayout from './layouts/MainLayout';
import Leaderboard from './pages/Leaderboard';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Analytics from './pages/Analytics';
import { Loader2 } from 'lucide-react';
import UserDataInput from './pages/UserDataInput';


const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const username = user?.username || "Buddy";
  console.log(user?.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/signup');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="dark:bg-black flex justify-center items-center">
        <Loader2 />
      </div>
    );
  }

  // // Pass `username` as a prop if rendering `Dashboard`
  return isSignedIn ? (
    <Outlet context={{ username }} />
  ) : null;
};

const App = () => {
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* Routes without Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp signInForceRedirectUrl='/dashboard' />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/moredetails" element={<UserDataInput />} />

        {/* Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donate" element={<Donations />} />
            <Route path="/analytics" element={<Analytics />} />

          </Route>
        </Route>
      </Routes>
    </div>
  );
};


export default App;