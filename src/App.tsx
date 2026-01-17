import { useState } from 'react';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { CompletionModal } from './components/CompletionModal';
import { useTimer } from './hooks/useTimer';
import { useTimerConfig } from './hooks/useTimerConfig';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const config = useTimerConfig();
  const timer = useTimer(config.timers);

  if (showSettings) {
    return (
      <Settings
        timers={config.timers}
        onAddTimer={config.addTimer}
        onUpdateTimer={config.updateTimer}
        onDeleteTimer={config.deleteTimer}
        onResetDefaults={config.resetToDefaults}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <>
      <Timer
        timers={config.timers}
        selectedTimerId={timer.selectedTimerId}
        formattedTime={timer.formattedTime}
        progress={timer.progress}
        sessions={timer.sessions}
        isRunning={timer.isRunning}
        isWakeLockActive={timer.isWakeLockActive}
        isWakeLockSupported={timer.isWakeLockSupported}
        wasPausedBySystem={timer.wasPausedBySystem}
        onStart={timer.start}
        onPause={timer.pause}
        onReset={timer.reset}
        onSelectTimer={timer.selectTimer}
        onOpenSettings={() => setShowSettings(true)}
      />
      {timer.isCompleted && timer.selectedTimer && (
        <CompletionModal
          timerName={timer.selectedTimer.name}
          onRestart={() => {
            timer.reset();
            timer.start();
          }}
          onDismiss={timer.dismissCompletion}
        />
      )}
    </>
  );
}

export default App;
