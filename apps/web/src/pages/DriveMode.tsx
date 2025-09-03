import React from 'react';

const DriveMode: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Drive Mode AI</h1>
      {/* MicButton, TranscriptBar, ActionPreview, ConfirmSheet, TaskLogDrawer, Waveform will be added here */}
      <p>Welcome to Drive Mode. Speak your tasks while driving!</p>
    </div>
  );
};

export default DriveMode;
