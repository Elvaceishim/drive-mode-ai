import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '../store/useVoice';
import { AudioRecorder } from '../lib/audioUtils';
import { stt, parse } from '../lib/api';
import { tts } from '../lib/tts';

const AnimatedGradientMicButton: React.FC = () => {
  const { 
    isRecording, 
    setRecording, 
    setTranscript, 
    setAction, 
    setProcessing,
    setShowConfirm,
    reset 
  } = useVoice();
  
  const [recorder] = useState(() => new AudioRecorder());

  const handleClick = async () => {
    if (isRecording) {
      // Stop recording
      setRecording(false);
      setProcessing(true);
      
      try {
        const audioBlob = await recorder.stopRecording();
        
        // Send to STT
        const sttResult = await stt(audioBlob);
        setTranscript(sttResult.text, sttResult.confidence);
        
        // Parse intent
        const parseResult = await parse(sttResult.text);
        setAction(parseResult);
        
        // Show confirmation if confidence is good
        if (parseResult.confidence > 0.6) {
          setShowConfirm(true);
          // Voice confirmation message - no need for manual button click
          await tts.speak(`I heard: ${sttResult.text}. Please say "yes" to confirm or "no" to cancel.`);
        } else {
          await tts.speak('I\'m not sure what you meant. Please try again.');
          reset();
        }
      } catch (error) {
        console.error('Voice processing error:', error);
        await tts.speak('Sorry, there was an error processing your request.');
        reset();
      } finally {
        setProcessing(false);
      }
    } else {
      // Start recording
      try {
        await recorder.startRecording();
        setRecording(true);
        reset();
      } catch (error) {
        console.error('Microphone access error:', error);
        await tts.speak('Please allow microphone access to use voice commands.');
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer animated gradient ring */}
      <div 
        className={`absolute rounded-full transition-all duration-500 ${
          isRecording 
            ? 'w-40 h-40' 
            : 'w-32 h-32'
        }`}
        style={{
          background: isRecording 
            ? 'conic-gradient(from 0deg, #ef4444 0%, #f97316 12%, #eab308 25%, #22c55e 37%, #06b6d4 50%, #3b82f6 62%, #8b5cf6 75%, #ec4899 87%, #ef4444 100%)'
            : 'conic-gradient(from 0deg, #3b82f6 0%, #8b5cf6 25%, #ec4899 50%, #06b6d4 75%, #3b82f6 100%)',
          filter: 'blur(6px)',
          opacity: isRecording ? 0.7 : 0.3
        }}
      />

      {/* Middle gradient ring */}
      <div 
        className={`absolute rounded-full transition-all duration-400 ${
          isRecording 
            ? 'w-32 h-32' 
            : 'w-28 h-28'
        }`}
        style={{
          background: isRecording 
            ? 'conic-gradient(from 180deg, #ec4899 0%, #f97316 20%, #22c55e 40%, #06b6d4 60%, #8b5cf6 80%, #ec4899 100%)'
            : 'conic-gradient(from 180deg, #8b5cf6 0%, #3b82f6 33%, #06b6d4 66%, #8b5cf6 100%)',
          filter: 'blur(3px)',
          opacity: isRecording ? 0.5 : 0.25
        }}
      />

      {/* Inner breathing glow */}
      <div 
        className={`absolute rounded-full transition-all duration-300 ${
          isRecording 
            ? 'w-28 h-28' 
            : 'w-24 h-24'
        }`}
        style={{
          background: isRecording 
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, rgba(6, 182, 212, 0.1) 70%, transparent 90%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 40%, rgba(6, 182, 212, 0.1) 70%, transparent 90%)',
          animation: isRecording ? 'breathe 1.5s ease-in-out infinite' : 'gentleBreathe 3s ease-in-out infinite'
        }}
      />

      {/* Core button with animated gradient border */}
      <div 
        className={`relative rounded-full p-0.5 transition-all duration-300 ${
          isRecording ? 'w-24 h-24' : 'w-20 h-20'
        }`}
        style={{
          background: isRecording 
            ? 'conic-gradient(from 0deg, #ef4444 0%, #f97316 25%, #eab308 50%, #ef4444 75%, #ec4899 100%)'
            : 'conic-gradient(from 0deg, #3b82f6 0%, #8b5cf6 33%, #06b6d4 66%, #3b82f6 100%)'
        }}
      >
        <button 
          onClick={handleClick}
          className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
            isRecording 
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-2xl shadow-red-500/50' 
              : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105'
          }`}
          style={{
            animation: isRecording ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
        >
          {/* Animated background gradient overlay */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: isRecording 
                ? 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0.1) 100%)'
                : 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.05) 100%)',
              animation: isRecording ? 'shimmer 2s linear infinite' : 'shimmer 6s linear infinite'
            }}
          />

          {/* Inner shimmer effect */}
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: isRecording 
                ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%)'
                : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
              animation: isRecording ? 'shimmer 1.5s ease-in-out infinite reverse' : 'shimmer 4s ease-in-out infinite'
            }}
          />

          {/* Icon with glow effect */}
          <div className="relative z-10">
            {isRecording ? (
              <MicOff 
                className="w-10 h-10 text-white" 
                style={{ 
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' 
                }} 
              />
            ) : (
              <Mic 
                className="w-10 h-10 text-white" 
                style={{ 
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))' 
                }} 
              />
            )}
          </div>
        </button>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </span>
    </div>
  );
};

export default AnimatedGradientMicButton;
