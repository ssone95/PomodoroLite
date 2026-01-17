import { TimerConfig } from '../hooks/useTimerConfig';
import './Timer.css';

interface TimerProps {
  timers: TimerConfig[];
  selectedTimerId: string;
  formattedTime: string;
  progress: number;
  sessions: number;
  isRunning: boolean;
  isWakeLockActive: boolean;
  isWakeLockSupported: boolean;
  wasPausedBySystem: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSelectTimer: (timerId: string) => void;
  onOpenSettings: () => void;
}

// Map timer IDs to background gradient classes
const getTimerClass = (timerId: string): string => {
  if (timerId === 'work' || timerId.includes('focus')) return 'work';
  if (timerId === 'shortBreak') return 'shortBreak';
  if (timerId === 'longBreak') return 'longBreak';
  if (timerId === 'lunchBreak') return 'lunchBreak';
  return 'custom';
};

export function Timer({
  timers,
  selectedTimerId,
  formattedTime,
  progress,
  sessions,
  isRunning,
  isWakeLockActive,
  isWakeLockSupported,
  wasPausedBySystem,
  onStart,
  onPause,
  onReset,
  onSelectTimer,
  onOpenSettings,
}: TimerProps) {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const timerClass = getTimerClass(selectedTimerId);

  return (
    <div className={`timer timer--${timerClass}`}>
      <div className="timer__header">
        <div className="timer__status">
          {isWakeLockSupported && (
            <span className={`timer__status-indicator ${isWakeLockActive ? 'timer__status-indicator--active' : ''}`}>
              {isWakeLockActive ? '☀️ Screen Active' : '💤 Screen can sleep'}
            </span>
          )}
        </div>
        <button className="timer__settings-btn" onClick={onOpenSettings}>
          ⚙️
        </button>
      </div>

      <div className="timer__modes">
        {timers.map((timer) => (
          <button
            key={timer.id}
            className={`timer__mode-btn ${selectedTimerId === timer.id ? 'timer__mode-btn--active' : ''}`}
            onClick={() => onSelectTimer(timer.id)}
          >
            {timer.name}
          </button>
        ))}
      </div>

      {wasPausedBySystem && (
        <div className="timer__alert">
          Timer paused — you left the page
        </div>
      )}

      <div className="timer__display">
        <svg className="timer__svg" viewBox="0 0 260 260">
          <circle
            className="timer__circle-bg"
            cx="130"
            cy="130"
            r="120"
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="timer__circle-progress"
            cx="130"
            cy="130"
            r="120"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 130 130)"
          />
        </svg>
        <div className="timer__time">{formattedTime}</div>
      </div>

      <div className="timer__controls">
        {!isRunning ? (
          <button className="timer__btn timer__btn--start" onClick={onStart}>
            Start
          </button>
        ) : (
          <button className="timer__btn timer__btn--pause" onClick={onPause}>
            Pause
          </button>
        )}
        <button className="timer__btn timer__btn--reset" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="timer__sessions">
        <span className="timer__sessions-count">{sessions}</span>
        <span className="timer__sessions-label">sessions completed</span>
      </div>
    </div>
  );
}
