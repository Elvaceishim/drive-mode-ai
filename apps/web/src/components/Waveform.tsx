import React from 'react';

const Waveform: React.FC<{ data: number[] }> = ({ data }) => {
  // Generate mock waveform data if none provided
  const waveformData = data.length > 0 ? data : Array.from({ length: 20 }, () => Math.random() * 0.8 + 0.2);
  
  return (
    <div className="flex items-center justify-center gap-1 h-12 bg-gray-800 rounded-lg px-4">
      {waveformData.map((value, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-full transition-all duration-150 animate-pulse"
          style={{ 
            height: `${Math.max(value * 40, 4)}px`,
            width: '3px',
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
