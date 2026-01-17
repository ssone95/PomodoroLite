import { useState } from 'react';
import { TimerConfig } from '../hooks/useTimerConfig';
import { TimerEditModal } from './TimerEditModal';
import './Settings.css';

interface SettingsProps {
  timers: TimerConfig[];
  onAddTimer: (name: string, duration: number) => void;
  onUpdateTimer: (id: string, updates: Partial<Pick<TimerConfig, 'name' | 'duration'>>) => void;
  onDeleteTimer: (id: string) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export function Settings({
  timers,
  onAddTimer,
  onUpdateTimer,
  onDeleteTimer,
  onResetDefaults,
  onClose,
}: SettingsProps) {
  const [editingTimer, setEditingTimer] = useState<TimerConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSaveEdit = (name: string, duration: number) => {
    if (editingTimer) {
      onUpdateTimer(editingTimer.id, { name, duration });
    }
    setEditingTimer(null);
  };

  const handleSaveNew = (name: string, duration: number) => {
    onAddTimer(name, duration);
    setShowAddModal(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} min`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Timer Settings</h1>
        <button className="settings__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="settings__content">
        <section className="settings__section">
          <h2 className="settings__section-title">Your Timers</h2>
          <ul className="settings__timer-list">
            {timers.map((timer) => (
              <li key={timer.id} className="settings__timer-item">
                <div className="settings__timer-view">
                  <div className="settings__timer-info">
                    <span className="settings__timer-name">
                      {timer.name}
                      {timer.isDefault && (
                        <span className="settings__badge">Default</span>
                      )}
                    </span>
                    <span className="settings__timer-duration">
                      {formatDuration(timer.duration)}
                    </span>
                  </div>
                  <div className="settings__timer-actions">
                    <button
                      className="settings__btn settings__btn--edit"
                      onClick={() => setEditingTimer(timer)}
                    >
                      Edit
                    </button>
                    {!timer.isDefault && (
                      <button
                        className="settings__btn settings__btn--delete"
                        onClick={() => onDeleteTimer(timer.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="settings__section">
          <button
            className="settings__btn settings__btn--add"
            onClick={() => setShowAddModal(true)}
          >
            + Add Custom Timer
          </button>
        </section>

        <section className="settings__section">
          <button
            className="settings__btn settings__btn--reset"
            onClick={onResetDefaults}
          >
            Reset All to Defaults
          </button>
        </section>
      </div>

      {editingTimer && (
        <TimerEditModal
          timer={editingTimer}
          onSave={handleSaveEdit}
          onClose={() => setEditingTimer(null)}
        />
      )}

      {showAddModal && (
        <TimerEditModal
          isNew
          onSave={handleSaveNew}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
