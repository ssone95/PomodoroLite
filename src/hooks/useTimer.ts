import { useState, useEffect, useCallback, useRef } from 'react';
import { useWakeLock } from './useWakeLock';
import { usePageVisibility } from './usePageVisibility';
import { TimerConfig } from './useTimerConfig';

export function useTimer(timers: TimerConfig[]) {
  const [selectedTimerId, setSelectedTimerId] = useState(timers[0]?.id || 'work');
  const selectedTimer = timers.find(t => t.id === selectedTimerId) || timers[0];
  
  const [timeLeft, setTimeLeft] = useState(selectedTimer?.duration || 25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const wasRunningBeforeHidden = useRef(false);

  const wakeLock = useWakeLock();
  const isPageVisible = usePageVisibility();

  const totalTime = selectedTimer?.duration || 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Handle page visibility changes - stop timer when page hidden
  useEffect(() => {
    if (!isPageVisible && isRunning) {
      // Page became hidden while timer was running
      wasRunningBeforeHidden.current = true;
      setIsRunning(false);
      wakeLock.release();
    }
    // We intentionally don't auto-resume when page becomes visible again
    // User must manually restart
  }, [isPageVisible, isRunning, wakeLock]);

  // Manage wake lock based on timer state
  useEffect(() => {
    if (isRunning && isPageVisible) {
      wakeLock.request();
    } else {
      wakeLock.release();
    }
  }, [isRunning, isPageVisible, wakeLock]);

  // Haptic feedback for last 5 seconds
  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft <= 5) {
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  }, [isRunning, timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      // Count sessions for "work" or "Focus" type timers
      if (selectedTimer?.id === 'work' || selectedTimer?.name.toLowerCase().includes('focus')) {
        setSessions((prev) => prev + 1);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, selectedTimer]);

  const start = useCallback(() => {
    wasRunningBeforeHidden.current = false;
    setIsCompleted(false);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    wasRunningBeforeHidden.current = false;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    wasRunningBeforeHidden.current = false;
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(selectedTimer?.duration || 25 * 60);
  }, [selectedTimer]);

  const selectTimer = useCallback((timerId: string) => {
    const timer = timers.find(t => t.id === timerId);
    if (timer) {
      wasRunningBeforeHidden.current = false;
      setSelectedTimerId(timerId);
      setIsRunning(false);
      setIsCompleted(false);
      setTimeLeft(timer.duration);
    }
  }, [timers]);

  const dismissCompletion = useCallback(() => {
    setIsCompleted(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    selectedTimerId,
    selectedTimer,
    timeLeft,
    isRunning,
    sessions,
    progress,
    isCompleted,
    formattedTime: formatTime(timeLeft),
    isWakeLockActive: wakeLock.isActive,
    isWakeLockSupported: wakeLock.isSupported,
    wasPausedBySystem: wasRunningBeforeHidden.current && !isRunning,
    start,
    pause,
    reset,
    selectTimer,
    dismissCompletion,
  };
}
