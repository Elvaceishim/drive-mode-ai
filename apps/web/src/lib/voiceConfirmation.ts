import { AudioRecorder } from './audioUtils';
import { stt } from './api';

export interface ConfirmationResult {
  type: 'confirm' | 'cancel' | 'unknown';
  confidence: number;
  text: string;
}

export class VoiceConfirmationHandler {
  private recorder: AudioRecorder;
  private isListening: boolean = false;
  private timeoutId: number | null = null;

  constructor() {
    this.recorder = new AudioRecorder();
  }

  async startListening(timeoutMs: number = 15000): Promise<ConfirmationResult> {
    if (this.isListening) {
      throw new Error('Already listening for confirmation');
    }

    this.isListening = true;

    return new Promise(async (resolve, reject) => {
      // Set timeout
      this.timeoutId = window.setTimeout(() => {
        this.stopListening();
        resolve({
          type: 'unknown',
          confidence: 0,
          text: 'Timeout - no response received'
        });
      }, timeoutMs);

      try {
        // Start recording
        await this.recorder.startRecording();

        // Wait for audio input (extended time for better recognition)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Stop recording and get audio
        const audioBlob = await this.recorder.stopRecording();

        // Clear timeout
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        // Convert to text
        const sttResult = await stt(audioBlob);
        const text = sttResult.text.toLowerCase().trim();

        // Analyze the response
        const result = this.analyzeConfirmation(text, sttResult.confidence);
        this.isListening = false;
        resolve(result);

      } catch (error) {
        this.isListening = false;
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        reject(error);
      }
    });
  }

  private analyzeConfirmation(text: string, confidence: number): ConfirmationResult {
    // Positive confirmation phrases
    const confirmPhrases = [
      'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'go ahead', 
      'do it', 'proceed', 'confirm', 'correct', 'right', 
      'absolutely', 'definitely', 'send it', 'create it'
    ];

    // Negative confirmation phrases
    const cancelPhrases = [
      'no', 'nope', 'cancel', 'stop', 'abort', 'never mind', 
      'nevermind', 'don\'t', 'wait', 'hold on', 'incorrect', 
      'wrong', 'not right', 'negative'
    ];

    // Check for exact matches first
    for (const phrase of confirmPhrases) {
      if (text.includes(phrase)) {
        return {
          type: 'confirm',
          confidence: confidence * 0.9, // Slightly reduce confidence for safety
          text
        };
      }
    }

    for (const phrase of cancelPhrases) {
      if (text.includes(phrase)) {
        return {
          type: 'cancel',
          confidence: confidence * 0.9,
          text
        };
      }
    }

    // If no clear match, return unknown
    return {
      type: 'unknown',
      confidence: 0,
      text
    };
  }

  stopListening(): void {
    this.isListening = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    // Note: We don't stop the recorder here as it might be in use
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Singleton instance
export const voiceConfirmationHandler = new VoiceConfirmationHandler();
