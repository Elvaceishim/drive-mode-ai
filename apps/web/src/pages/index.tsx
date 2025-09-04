import React, { useEffect } from 'react';
import DriveModeScreen from '../components/DriveModeScreen';
import AuthGate from './AuthGate';
import { useSession } from '../store/useSession';

const App: React.FC = () => {
  const { user, isLoading, checkAuthStatus } = useSession();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Drive Mode AI...</p>
        </div>
      </div>
    );
  }

  // Show AuthGate if user is not authenticated
  if (!user) {
    return <AuthGate />;
  }

  // Show main app if user is authenticated
  return <DriveModeScreen />;
};

export default App;
