import { useCallback, useRef } from 'react';

// Generate a simple beep sound using Web Audio API
function createBeepSound(audioContext: AudioContext): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAlarm = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;

      // Play 3 beeps
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createBeepSound(ctx);
        }, i * 600);
      }
    } catch (err) {
      console.warn('Could not play sound:', err);
    }
  }, []);

  return { playAlarm };
}
