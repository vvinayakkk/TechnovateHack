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
import Map from './pages/Map';
import Donations from './pages/Donations';
import Analytics from './pages/Analytics';
import { Loader2 } from 'lucide-react';
import UserDataInput from './pages/UserDataInput';
import CustomSignUp from './pages/CustomSignUp';
import CustomSignIn from './pages/CustomSignIn';
import Products from "./pages/Products";

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
        <Route path="/signup" element={<CustomSignUp signUpForceRedirectUrl='/moredetails' />} />
        <Route path="/signin" element={<CustomSignIn signInForceRedirectUrl='/moredetails' />} />
        <Route path="/moredetails" element={<UserDataInput />} />

        {/* Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/map" element={<Map />} />
            <Route path="/donate" element={<Donations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/products" element={<Products />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};


export default App;