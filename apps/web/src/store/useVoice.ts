import { create } from 'zustand';

interface VoiceState {
  isRecording: boolean;
  transcript: string;
  confidence: number;
  action: any | null;
  isProcessing: boolean;
  showConfirm: boolean;
  isListeningForConfirmation: boolean;
  waveformData: number[];
  setRecording: (rec: boolean) => void;
  setTranscript: (text: string, confidence?: number) => void;
  setAction: (action: any) => void;
  setProcessing: (processing: boolean) => void;
  setShowConfirm: (show: boolean) => void;
  setListeningForConfirmation: (listening: boolean) => void;
  setWaveformData: (data: number[]) => void;
  reset: () => void;
}

export const useVoice = create<VoiceState>((set) => ({
  isRecording: false,
  transcript: '',
  confidence: 1,
  action: null,
  isProcessing: false,
  showConfirm: false,
  isListeningForConfirmation: false,
  waveformData: [],
  setRecording: (rec) => set({ isRecording: rec }),
  setTranscript: (text, confidence = 1) => set({ transcript: text, confidence }),
  setAction: (action) => set({ action }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setShowConfirm: (show) => set({ showConfirm: show }),
  setListeningForConfirmation: (listening) => set({ isListeningForConfirmation: listening }),
  setWaveformData: (data) => set({ waveformData: data }),
  reset: () => set({ 
    transcript: '', 
    action: null, 
    isProcessing: false, 
    showConfirm: false,
    isListeningForConfirmation: false,
    waveformData: []
  }),
}));
