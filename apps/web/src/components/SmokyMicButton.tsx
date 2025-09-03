import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '../store/useVoice';
import { AudioRecorder } from '../lib/audioUtils';
import { stt, parse } from '../lib/api';
import { tts } from '../lib/tts';

const SmokyMicButton: React.FC = () => {
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
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    angle: number;
    color: string;
    life: number;
  }>>([]);

  // Generate particles for smoky effect
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setParticles(prev => {
          // Remove old particles
          const filtered = prev.filter(p => p.life > 0);
          
          // Add new particles with varied colors and properties
          const colors = ['from-blue-400', 'from-purple-500', 'from-cyan-400', 'from-indigo-500', 'from-violet-500'];
          const newParticles = Array.from({ length: 4 }, (_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 30, // Wider spread
            y: (Math.random() - 0.5) * 30,
            size: Math.random() * 12 + 6,
            opacity: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 1.5 + 0.5,
            angle: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0
          }));

          // Update existing particles with more complex movement
          const updated = filtered.map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle + Date.now() * 0.001) * p.speed * 0.3,
            y: p.y + Math.sin(p.angle + Date.now() * 0.001) * p.speed * 0.3,
            opacity: p.opacity * 0.98,
            size: p.size * 1.005,
            life: p.life - 0.02,
            angle: p.angle + 0.02 // Slight rotation
          }));

          return [...updated, ...newParticles].slice(0, 35); // More particles
        });
      }, 80); // Faster generation

      return () => clearInterval(interval);
    } else {
      // Fade out particles gradually when stopping
      const fadeInterval = setInterval(() => {
        setParticles(prev => {
          const fading = prev.map(p => ({
            ...p,
            opacity: p.opacity * 0.9,
            life: p.life - 0.05
          })).filter(p => p.opacity > 0.1);
          
          if (fading.length === 0) {
            clearInterval(fadeInterval);
          }
          
          return fading;
        });
      }, 50);

      return () => clearInterval(fadeInterval);
    }
  }, [isRecording]);

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
      {/* Ambient glow when idle */}
      {!isRecording && (
        <div 
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"
          style={{
            animation: 'gentleHover 4s ease-in-out infinite',
            filter: 'blur(8px)'
          }}
        />
      )}

      {/* Outer energy field */}
      <div 
        className={`absolute rounded-full transition-all duration-500 ${
          isRecording 
            ? 'w-56 h-56 bg-gradient-to-r from-blue-500/15 via-purple-500/15 via-cyan-500/15 to-indigo-500/15' 
            : 'w-32 h-32 bg-blue-500/8'
        }`}
        style={{
          animation: isRecording ? 'smokyPulse 3s ease-in-out infinite' : 'none',
          filter: 'blur(12px)'
        }}
      />

      {/* Middle energy ring */}
      <div 
        className={`absolute rounded-full transition-all duration-400 ${
          isRecording 
            ? 'w-40 h-40 bg-gradient-to-r from-cyan-400/25 via-blue-500/25 via-purple-600/25 to-pink-500/25' 
            : 'w-24 h-24 bg-blue-500/15'
        }`}
        style={{
          animation: isRecording ? 'smokyPulse 2s ease-in-out infinite reverse' : 'none',
          filter: 'blur(6px)'
        }}
      />

      {/* Inner energy core */}
      <div 
        className={`absolute rounded-full transition-all duration-300 ${
          isRecording 
            ? 'w-28 h-28 bg-gradient-to-r from-blue-400/40 via-purple-500/40 to-cyan-400/40' 
            : 'w-20 h-20 bg-blue-500/20'
        }`}
        style={{
          animation: isRecording ? 'smokyPulse 1.2s ease-in-out infinite' : 'none',
          filter: 'blur(3px)'
        }}
      />

      {/* Dynamic particle system */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(particle => (
            <div
              key={particle.id}
              className={`absolute rounded-full bg-gradient-to-r ${particle.color} to-transparent`}
              style={{
                left: `calc(50% + ${particle.x}px)`,
                top: `calc(50% + ${particle.y}px)`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                filter: 'blur(1px)',
                transform: `translate(-50%, -50%) rotate(${particle.angle}rad)`,
                animation: 'float 4s ease-in-out infinite',
                background: `radial-gradient(circle, ${
                  particle.color === 'from-blue-400' ? 'rgba(96, 165, 250, 0.8)' :
                  particle.color === 'from-purple-500' ? 'rgba(168, 85, 247, 0.8)' :
                  particle.color === 'from-cyan-400' ? 'rgba(34, 211, 238, 0.8)' :
                  particle.color === 'from-indigo-500' ? 'rgba(99, 102, 241, 0.8)' :
                  'rgba(139, 92, 246, 0.8)'
                } 0%, transparent 70%)`
              }}
            />
          ))}
        </div>
      )}

      {/* Core button */}
      <button 
        onClick={handleClick}
        className={`relative z-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
          isRecording 
            ? 'w-24 h-24 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 border-red-300 shadow-2xl shadow-red-500/60' 
            : 'w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-blue-300 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105'
        }`}
        style={{
          animation: isRecording ? 'coreBreath 1.5s ease-in-out infinite' : 'none'
        }}
      >
        {/* Inner glow layers */}
        <div 
          className={`absolute inset-1 rounded-full transition-all duration-300 ${
            isRecording 
              ? 'bg-gradient-to-r from-red-200/60 via-pink-200/60 to-red-200/60' 
              : 'bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-indigo-200/40'
          }`}
          style={{
            filter: 'blur(6px)',
            animation: isRecording ? 'innerGlow 1s ease-in-out infinite alternate' : 'none'
          }}
        />

        <div 
          className={`absolute inset-2 rounded-full transition-all duration-300 ${
            isRecording 
              ? 'bg-gradient-to-r from-red-300/40 to-pink-300/40' 
              : 'bg-gradient-to-r from-blue-300/30 to-purple-300/30'
          }`}
          style={{
            filter: 'blur(3px)',
            animation: isRecording ? 'innerGlow 0.7s ease-in-out infinite alternate-reverse' : 'none'
          }}
        />

        {/* Icon with enhanced glow */}
        <div className="relative z-10">
          {isRecording ? (
            <MicOff className="w-10 h-10 text-white drop-shadow-2xl" 
                     style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
          ) : (
            <Mic className="w-10 h-10 text-white drop-shadow-2xl" 
                 style={{ filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))' }} />
          )}
        </div>
      </button>

      {/* Screen reader text */}
      <span className="sr-only">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </span>
    </div>
  );
};

export default SmokyMicButton;
