// tts.ts - Text-to-Speech utilities
export class TTSManager {
  private synth = window.speechSynthesis;

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    this.synth.speak(utterance);
    
    return new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
    });
  }

  stop() {
    this.synth.cancel();
  }
}

export const tts = new TTSManager();
