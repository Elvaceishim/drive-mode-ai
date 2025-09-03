// audioUtils.ts - Helper functions for audio capture and processing
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start();
    return stream;
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(new Blob());
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
      
      this.mediaRecorder.stop();
    });
  }
}

export function generateWaveformData(audioData: Float32Array): number[] {
  // Simplified waveform generation for visualization
  const samples = 50;
  const blockSize = Math.floor(audioData.length / samples);
  const waveform: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(audioData[i * blockSize + j] || 0);
    }
    waveform.push(sum / blockSize);
  }
  
  return waveform;
}
