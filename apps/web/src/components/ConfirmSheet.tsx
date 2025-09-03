import React, { useState, useEffect } from 'react';
import { useVoice } from '../store/useVoice';
import { gmailDraft, gmailSend, calendarCreate } from '../lib/api';
import { tts } from '../lib/tts';
import { voiceConfirmationHandler, ConfirmationResult } from '../lib/voiceConfirmation';

const ConfirmSheet: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const { action, showConfirm, setShowConfirm, isListeningForConfirmation, setListeningForConfirmation, reset } = useVoice();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  // Start voice confirmation when sheet appears
  useEffect(() => {
    if (showConfirm && action && !isProcessing && !isListeningForConfirmation) {
      startVoiceConfirmation();
    }
  }, [showConfirm, action, isProcessing, isListeningForConfirmation]);

  const startVoiceConfirmation = async () => {
    setListeningForConfirmation(true);
    setConfirmationText('Listening for your response...');

    try {
      const result: ConfirmationResult = await voiceConfirmationHandler.startListening(15000); // 15 second timeout
      
      setConfirmationText(`I heard: "${result.text}"`);
      
      if (result.type === 'confirm' && result.confidence > 0.6) {
        await handleConfirm();
      } else if (result.type === 'cancel') {
        await handleCancel();
      } else {
        // Unclear response, ask again with more guidance
        if (result.text.includes('timeout')) {
          setConfirmationText('No response detected. You can use voice or buttons below.');
          await tts.speak('I didn\'t hear a response. You can say "yes" to confirm, "no" to cancel, or use the buttons below.');
        } else {
          setConfirmationText('I didn\'t understand. Please say "yes" to confirm or "no" to cancel.');
          await tts.speak('I didn\'t understand. Please say "yes" to confirm or "no" to cancel, or use the buttons below.');
          // Retry once more after a brief pause
          setTimeout(() => {
            if (showConfirm && !isProcessing) { // Only retry if still in confirmation state
              startVoiceConfirmation();
            }
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Voice confirmation error:', error);
      setConfirmationText('Voice confirmation failed. Please use the buttons below.');
      await tts.speak('I couldn\'t hear you clearly. Please use the buttons below to confirm or cancel.');
    } finally {
      setListeningForConfirmation(false);
    }
  };

  const handleConfirm = async () => {
    if (!action) return;
    
    setIsProcessing(true);
    
    try {
      let result;
      let successMessage = '';

      if (action.action === 'email') {
        const { to, subject, body, send } = action.email;
        
        if (send) {
          // Send email immediately
          result = await gmailSend({ to, subject, body });
          successMessage = `Email sent to ${to}`;
        } else {
          // Create draft
          result = await gmailDraft({ to, subject, body });
          successMessage = `Draft created for ${to}`;
        }
      } else if (action.action === 'calendar') {
        const { title, datetime, durationMin, attendees } = action.calendar;
        result = await calendarCreate({ title, datetime, durationMin, attendees });
        successMessage = `Calendar event "${title}" created`;
      } else {
        throw new Error('Unsupported action type');
      }

      // Speak success message
      await tts.speak(successMessage);
      
      console.log('Action completed:', result);
      
      // Reset and close
      reset();
      setShowConfirm(false);
      onConfirm();
      
    } catch (error) {
      console.error('Action failed:', error);
      await tts.speak('Sorry, there was an error completing that action.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    await tts.speak('Action cancelled');
    reset();
    setShowConfirm(false);
    setListeningForConfirmation(false);
    onCancel();
  };

  if (!showConfirm || !action) return null;

  return (
    <div      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, #1a1a1a, #2a2a2a)',
        padding: '24px',
        borderTop: '2px solid #333',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 50
      }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0, marginBottom: '12px', fontSize: '20px', color: '#fff' }}>
          {isListeningForConfirmation ? '🎤 Confirm with Voice' : '✋ Confirm Action'}
        </h3>
        <p style={{ margin: 0, color: '#ccc', fontSize: '16px', lineHeight: '1.5', marginBottom: '8px' }}>
          {action.action === 'email' && (
            `${action.email.send ? 'Send' : 'Draft'} email to ${action.email.to}: "${action.email.subject}"`
          )}
          {action.action === 'calendar' && (
            `Create calendar event: "${action.calendar.title}"`
          )}
        </p>
        {isListeningForConfirmation && (
          <p style={{ margin: 0, color: '#fbbf24', fontSize: '14px', fontStyle: 'italic' }}>
            Say "yes" to confirm or "no" to cancel
          </p>
        )}
        {confirmationText && (
          <p style={{ margin: '8px 0', color: '#60a5fa', fontSize: '14px' }}>
            {confirmationText}
          </p>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Voice confirmation indicator */}
        {isListeningForConfirmation && (
          <div style={{ 
            textAlign: 'center', 
            padding: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              animation: 'pulse 2s infinite',
              marginRight: '8px'
            }} />
            <span style={{ color: '#60a5fa', fontSize: '14px' }}>Listening for voice confirmation...</span>
          </div>
        )}
        
        {/* Fallback buttons - always visible but less prominent when voice listening */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px',
          opacity: isListeningForConfirmation ? 0.5 : 1,
          transition: 'opacity 0.3s'
        }}>
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{
              padding: '16px 32px',
              background: isProcessing ? '#666' : 'linear-gradient(45deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              minWidth: '120px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            {isProcessing ? '⏳ Processing...' : '✓ Yes, Do It'}
          </button>
          <button 
            onClick={handleCancel}
            disabled={isProcessing}
            style={{
              padding: '16px 32px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              minWidth: '120px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            ✗ Cancel
          </button>
        </div>
        
        {/* Voice retry button */}
        {!isListeningForConfirmation && !isProcessing && (
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={startVoiceConfirmation}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#60a5fa',
                border: '1px solid #60a5fa',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎤 Use Voice Confirmation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmSheet;
