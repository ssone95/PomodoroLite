import { useRef, useState, useCallback, useEffect } from 'react';
import './ClockPicker.css';

// Haptic feedback helper
const vibrate = (duration: number = 10) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
};

interface ClockPickerProps {
  value: number; // in seconds
  onChange: (seconds: number) => void;
  maxMinutes?: number;
}

export function ClockPicker({ value, onChange, maxMinutes = 60 }: ClockPickerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastValueRef = useRef(value);

  const maxSeconds = maxMinutes * 60;
  const stepSeconds = 15; // 15-second increments

  // Convert seconds to angle (0 seconds = top = -90deg, clockwise)
  const secondsToAngle = (seconds: number): number => {
    return (seconds / maxSeconds) * 360 - 90;
  };

  // Convert angle to seconds, snapped to 15-second steps
  const angleToSeconds = (angle: number): number => {
    // Normalize angle to 0-360 (from -90 start)
    let normalizedAngle = angle + 90;
    if (normalizedAngle < 0) normalizedAngle += 360;
    if (normalizedAngle >= 360) normalizedAngle -= 360;

    const seconds = (normalizedAngle / 360) * maxSeconds;
    const snapped = Math.round(seconds / stepSeconds) * stepSeconds;
    return Math.max(stepSeconds, Math.min(maxSeconds, snapped)); // Min 15 seconds
  };

  const getAngleFromEvent = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return 0;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
  }, []);

  const handleInteraction = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const angle = getAngleFromEvent(e);
    const seconds = angleToSeconds(angle);
    
    // Haptic feedback when value changes (crosses a tick)
    if (seconds !== lastValueRef.current) {
      vibrate(10);
      lastValueRef.current = seconds;
    }
    
    onChange(seconds);
  }, [getAngleFromEvent, onChange, maxSeconds]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleInteraction(e);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handleInteraction(e);
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handleInteraction]);

  // Generate tick marks
  const ticks = [];
  for (let min = 0; min < maxMinutes; min += 1) {
    const angle = (min / maxMinutes) * 360 - 90;
    const isMajor = min % 15 === 0;
    const isMedium = min % 5 === 0 && !isMajor;
    
    const innerRadius = isMajor ? 75 : isMedium ? 80 : 85;
    const outerRadius = 90;

    const x1 = 100 + innerRadius * Math.cos((angle * Math.PI) / 180);
    const y1 = 100 + innerRadius * Math.sin((angle * Math.PI) / 180);
    const x2 = 100 + outerRadius * Math.cos((angle * Math.PI) / 180);
    const y2 = 100 + outerRadius * Math.sin((angle * Math.PI) / 180);

    ticks.push(
      <line
        key={min}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`clock-picker__tick ${isMajor ? 'clock-picker__tick--major' : isMedium ? 'clock-picker__tick--medium' : ''}`}
      />
    );

    // Add labels for major ticks (show 60 at the top instead of 0)
    if (isMajor) {
      const labelRadius = 62;
      const lx = 100 + labelRadius * Math.cos((angle * Math.PI) / 180);
      const ly = 100 + labelRadius * Math.sin((angle * Math.PI) / 180);
      const labelValue = min === 0 ? maxMinutes : min;
      ticks.push(
        <text
          key={`label-${min}`}
          x={lx}
          y={ly}
          className="clock-picker__label"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {labelValue}
        </text>
      );
    }
  }

  // Calculate handle position
  const handleAngle = secondsToAngle(value);
  const handleRadius = 70;
  const handleX = 100 + handleRadius * Math.cos((handleAngle * Math.PI) / 180);
  const handleY = 100 + handleRadius * Math.sin((handleAngle * Math.PI) / 180);

  // Calculate arc path for filled portion
  const arcAngle = secondsToAngle(value);
  const startAngle = -90;
  const arcRadius = 70;
  const startX = 100 + arcRadius * Math.cos((startAngle * Math.PI) / 180);
  const startY = 100 + arcRadius * Math.sin((startAngle * Math.PI) / 180);
  const endX = 100 + arcRadius * Math.cos((arcAngle * Math.PI) / 180);
  const endY = 100 + arcRadius * Math.sin((arcAngle * Math.PI) / 180);
  const largeArc = value > maxSeconds / 2 ? 1 : 0;

  const arcPath = value > 0
    ? `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${endX} ${endY}`
    : '';

  // Format display time
  const displayMinutes = Math.floor(value / 60);
  const displaySeconds = value % 60;
  const displayTime = `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;

  return (
    <div className="clock-picker">
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className={`clock-picker__svg ${isDragging ? 'clock-picker__svg--dragging' : ''}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          className="clock-picker__bg"
        />

        {/* Track circle */}
        <circle
          cx="100"
          cy="100"
          r="70"
          className="clock-picker__track"
        />

        {/* Filled arc */}
        {value > 0 && (
          <path
            d={arcPath}
            className="clock-picker__arc"
            fill="none"
          />
        )}

        {/* Tick marks */}
        {ticks}

        {/* Handle */}
        <circle
          cx={handleX}
          cy={handleY}
          r="12"
          className="clock-picker__handle"
        />
        <circle
          cx={handleX}
          cy={handleY}
          r="6"
          className="clock-picker__handle-inner"
        />

        {/* Center display */}
        <text
          x="100"
          y="95"
          className="clock-picker__time"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {displayTime}
        </text>
        <text
          x="100"
          y="115"
          className="clock-picker__time-label"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          minutes
        </text>
      </svg>
    </div>
  );
}
