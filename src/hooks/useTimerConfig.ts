import { useState, useEffect, useCallback } from 'react';

export interface TimerConfig {
  id: string;
  name: string;
  duration: number; // in seconds
  isDefault?: boolean;
}

const DEFAULT_TIMERS: TimerConfig[] = [
  { id: 'work', name: 'Focus', duration: 25 * 60, isDefault: true },
  { id: 'shortBreak', name: 'Short Break', duration: 5 * 60, isDefault: true },
  { id: 'longBreak', name: 'Long Break', duration: 15 * 60, isDefault: true },
  { id: 'lunchBreak', name: 'Lunch Break', duration: 60 * 60, isDefault: true },
];

const STORAGE_KEY = 'pomodoro-timers';

export function useTimerConfig() {
  const [timers, setTimers] = useState<TimerConfig[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure default timers always exist
        const defaultIds = DEFAULT_TIMERS.map(t => t.id);
        const customTimers = parsed.filter((t: TimerConfig) => !defaultIds.includes(t.id));
        // Update default timer durations if user modified them
        const mergedDefaults = DEFAULT_TIMERS.map(def => {
          const stored = parsed.find((t: TimerConfig) => t.id === def.id);
          return stored ? { ...def, duration: stored.duration } : def;
        });
        return [...mergedDefaults, ...customTimers];
      }
    } catch (err) {
      console.warn('Failed to load timers from localStorage:', err);
    }
    return DEFAULT_TIMERS;
  });

  // Persist to localStorage whenever timers change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    } catch (err) {
      console.warn('Failed to save timers to localStorage:', err);
    }
  }, [timers]);

  const addTimer = useCallback((name: string, duration: number) => {
    const id = `custom-${Date.now()}`;
    setTimers(prev => [...prev, { id, name, duration }]);
    return id;
  }, []);

  const updateTimer = useCallback((id: string, updates: Partial<Pick<TimerConfig, 'name' | 'duration'>>) => {
    setTimers(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  const deleteTimer = useCallback((id: string) => {
    setTimers(prev => {
      const timer = prev.find(t => t.id === id);
      // Don't allow deleting default timers
      if (timer?.isDefault) return prev;
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setTimers(DEFAULT_TIMERS);
  }, []);

  const getTimer = useCallback((id: string) => {
    return timers.find(t => t.id === id);
  }, [timers]);

  return {
    timers,
    addTimer,
    updateTimer,
    deleteTimer,
    resetToDefaults,
    getTimer,
  };
}
