import React from 'react';
import AnimatedGradientMicButton from './AnimatedGradientMicButton';
import TranscriptBar from './TranscriptBar';
import ActionPreview from './ActionPreview';
import ConfirmSheet from './ConfirmSheet';
import TaskLogDrawer from './TaskLogDrawer';
import Waveform from './Waveform';
import { useVoice } from '../store/useVoice';
import { useSession } from '../store/useSession';

const DriveModeScreen: React.FC = () => {
  const { user, logout } = useSession();
  const { 
    isRecording, 
    transcript, 
    confidence, 
    action, 
    isProcessing, 
    showConfirm, 
    waveformData 
  } = useVoice();

  const handleDemoCommand = async () => {
    // Demo functionality that doesn't require microphone
    const { setTranscript, setAction, setProcessing, setShowConfirm } = useVoice.getState();
    
    setProcessing(true);
    setTranscript("Email Sarah about the project deadline being moved to Friday", 0.92);
    
    // Simulate API delay
    setTimeout(() => {
      setAction({
        action: "email",
        confidence: 0.85,
        email: {
          to: "Sarah",
          subject: "Project Deadline Update",
          body: "Hi Sarah,\n\nI wanted to let you know that the project deadline has been moved to Friday.\n\nBest regards",
          send: false
        }
      });
      setProcessing(false);
      setShowConfirm(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5 gap-6">
      {/* User header */}
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {user?.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-400">Drive Mode Active</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Drive Mode AI</h1>
        <p className="text-gray-400 mb-4">Press to speak your command</p>
        <p className="text-sm text-gray-500 mb-8">Fully hands-free experience - voice confirmations only</p>
      </div>

      <AnimatedGradientMicButton />

      {/* Demo button for testing without microphone */}
      <button 
        onClick={handleDemoCommand}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
      >
        Try Demo Command
      </button>

      {isRecording && (
        <div className="text-center">
          <p className="text-red-400 text-lg mb-3 animate-pulse">
            Listening...
          </p>
          <Waveform data={waveformData} />
        </div>
      )}

      {isProcessing && (
        <div className="text-center">
          <p className="text-yellow-400 text-lg animate-pulse">
            🤖 Processing your request...
          </p>
          <div className="mt-2 animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
        </div>
      )}

      {transcript && !isProcessing && (
        <TranscriptBar transcript={transcript} />
      )}

      {action && !isProcessing && (
        <ActionPreview action={action} />
      )}

      <ConfirmSheet 
        onConfirm={() => console.log('Action confirmed')}
        onCancel={() => console.log('Action cancelled')}
      />

      <TaskLogDrawer logs={[]} />
      
      <div className="fixed bottom-4 right-4 text-xs text-gray-500">
        <p>Confidence: {Math.round(confidence * 100)}%</p>
        <p>Backend: {isProcessing ? "🟡" : "🟢"} Connected</p>
      </div>
    </div>
  );
};

export default DriveModeScreen;
