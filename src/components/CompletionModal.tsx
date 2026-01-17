import { useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import './CompletionModal.css';

interface CompletionModalProps {
  timerName: string;
  onRestart: () => void;
  onDismiss: () => void;
}

export function CompletionModal({ timerName, onRestart, onDismiss }: CompletionModalProps) {
  const { playAlarm } = useSound();

  useEffect(() => {
    playAlarm();
  }, [playAlarm]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__icon">🎉</div>
        <h2 className="modal__title">{timerName} complete!</h2>
        <p className="modal__subtitle">What would you like to do next?</p>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--restart" onClick={onRestart}>
            Restart Timer
          </button>
          <button className="modal__btn modal__btn--dismiss" onClick={onDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
