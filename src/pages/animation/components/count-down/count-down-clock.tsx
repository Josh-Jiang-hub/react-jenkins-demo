import { useEffect, useRef, useState } from 'react';
import TimeIconPine from './time-icon-pine';

interface CountdownProps {
  seconds: number;
  isRunning?: boolean;
  isPaused?: boolean;
  onEnd?: () => void;
  onSecondsChange?: (seconds: number) => void;
}

const CountDownClock: React.FC<CountdownProps> = ({
  seconds,
  isRunning = false,
  isPaused = false,
  onEnd,
  onSecondsChange,
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [color, setColor] = useState('#FFFDE3');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning || isPaused) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        onSecondsChange?.(prev - 1);

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (timeLeft <= 5) {
      setColor('#FF4343');
    } else {
      setColor('#FFFDE3');
    }

    if (timeLeft <= 0 && timerRef.current) {
      onEnd?.();
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    }
  }, [timeLeft]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
    },
    []
  );

  const formatTime = (time: number) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="flex h-[44px] w-[100px] items-center justify-center space-x-1 rounded-[100px] bg-[#4f3210]/90 py-2.5 pl-2.5 pr-3"
      style={timeLeft <= 5 ? { animation: 'clock-blink  1s infinite' } : {}}
    >
      <TimeIconPine
        background={timeLeft <= 5 ? '#FF4343' : '#D9D9D9'}
        isCountdown={!isRunning || isPaused || timeLeft <= 0}
        radius={8}
        time={seconds}
      />
      <span className="w-[50px] text-[18px] font-bold" style={{ color }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default CountDownClock;
