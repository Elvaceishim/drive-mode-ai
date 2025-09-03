import React from 'react';

const TranscriptBar: React.FC<{ transcript: string }> = ({ transcript }) => {
  return (
    <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">You said:</span>
      </div>
      <p className="text-lg text-white leading-relaxed">
        {transcript || 'Listening...'}
      </p>
    </div>
  );
};

export default TranscriptBar;
