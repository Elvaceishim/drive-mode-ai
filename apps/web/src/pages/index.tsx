import React from 'react';
import DriveModeScreen from '../components/DriveModeScreen';
import AuthGate from './AuthGate';
import { useSession } from '../store/useSession';

const App: React.FC = () => {
  const { user } = useSession();
  // TODO: Add session/auth logic to show AuthGate or DriveModeScreen
  // Temporarily show DriveModeScreen for development
  return <DriveModeScreen />;
};

export default App;
