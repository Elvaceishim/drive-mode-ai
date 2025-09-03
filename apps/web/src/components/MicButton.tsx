import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '../store/useVoice';
import { AudioRecorder } from '../lib/audioUtils';
import { stt, parse } from '../lib/api';
import { tts } from '../lib/tts';

const MicButton: React.FC = () => {
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
    <button 
      onClick={handleClick}
      style={{
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        backgroundColor: isRecording ? '#dc2626' : '#2563eb',
        border: 'none',
        cursor: 'pointer',
        animation: isRecording ? 'pulse 2s infinite' : 'none'
      }}
    >
      {isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
      <span className="sr-only">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </span>
    </button>
  );
};

export default MicButton;
