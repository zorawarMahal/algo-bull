import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { useEffect } from 'react';
import axios from 'axios';
import { Toaster } from "./components/ui/sonner";
import { ProtectedRoute } from './components/ProtectedRoute';

const API_URL = 'https://algo-bull.onrender.com';

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          await axios.post(`${API_URL}/api/users/sync`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };
    // Only run syncUser if the loading process is finished.
    if (!isLoading) {
      syncUser();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // First, handle the initial loading state of the Auth0 SDK.
  // This prevents any routing decisions from being made prematurely.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute component={DashboardPage} />} 
          />
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </>
  );
}

export default App;
