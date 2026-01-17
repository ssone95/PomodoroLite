import { useState, useEffect } from 'react';
import { TimerConfig } from '../hooks/useTimerConfig';
import { ClockPicker } from './ClockPicker';
import './TimerEditModal.css';

interface TimerEditModalProps {
  timer?: TimerConfig | null;
  isNew?: boolean;
  onSave: (name: string, duration: number) => void;
  onClose: () => void;
}

export function TimerEditModal({ timer, isNew, onSave, onClose }: TimerEditModalProps) {
  const [name, setName] = useState(timer?.name || '');
  const [duration, setDuration] = useState(timer?.duration || 25 * 60);

  useEffect(() => {
    if (timer) {
      setName(timer.name);
      setDuration(timer.duration);
    } else {
      setName('');
      setDuration(25 * 60);
    }
  }, [timer]);

  const handleSave = () => {
    if (name.trim() && duration > 0) {
      onSave(name.trim(), duration);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="timer-edit-modal__overlay" onClick={handleBackdropClick}>
      <div className="timer-edit-modal">
        <div className="timer-edit-modal__header">
          <h2 className="timer-edit-modal__title">
            {isNew ? 'Add New Timer' : 'Edit Timer'}
          </h2>
          <button className="timer-edit-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="timer-edit-modal__content">
          <div className="timer-edit-modal__field">
            <label className="timer-edit-modal__label">Timer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="timer-edit-modal__input"
              placeholder="e.g., Quick Focus"
              autoFocus
            />
          </div>

          <div className="timer-edit-modal__field">
            <label className="timer-edit-modal__label">Duration</label>
            <ClockPicker value={duration} onChange={setDuration} />
          </div>
        </div>

        <div className="timer-edit-modal__actions">
          <button
            className="timer-edit-modal__btn timer-edit-modal__btn--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="timer-edit-modal__btn timer-edit-modal__btn--save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {isNew ? 'Add Timer' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
