// import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import LandingPage from '@/pages/LandingPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const username = user?.username || "Buddy";
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

  // Pass `username` as a prop if rendering `Dashboard`
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
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

      {/* Routes with Layout */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/" element={<Dashboard />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="calendar" element={<CalendarComponent />} />
          <Route path="events" element={<Eventcomp />} />
          <Route path="community" element={<Communities />} />
          <Route path="community/:communityId" element={<Doubts />} />
          <Route path="maps" element={<Maps />} /> */}
        </Route>
      </Route>
    </Routes>
    </div>
  );
};


export default App;