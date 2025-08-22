import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

type Props = {
  duration: number; // seconds
  paused?: boolean;
  onTick?: (remainingSeconds: number) => void;
  onComplete?: () => void;
  height?: number;
  className?: string;
};

export default function CountdownProgress({
  duration,
  paused = false,
  onTick,
  onComplete,
  height = 8,
  className = '',
}: Props) {
  const [remaining, setRemaining] = useState(duration);
  const requestRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(performance.now());
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    setRemaining(duration);
    elapsedRef.current = 0;
    lastTickRef.current = performance.now();
  }, [duration]);

  useEffect(() => {
    function animate(now: number) {
      if (!paused && remaining > 0) {
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;
        elapsedRef.current += delta;

        const newRemaining = Math.max(duration - elapsedRef.current, 0);
        const prevRemaining = remaining;
        setRemaining(newRemaining);

        if (Math.floor(newRemaining) !== Math.floor(prevRemaining)) {
          onTick?.(Math.floor(newRemaining));
        }

        if (newRemaining <= 0) {
          onComplete?.();

          return;
        }
      } else {
        lastTickRef.current = now;
      }
      requestRef.current = requestAnimationFrame(animate);
    }

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [paused, duration, remaining, onTick, onComplete]);

  const progress = Math.max(0, (remaining / duration) * 100);

  return (
    <div
      className={`w-full overflow-hidden rounded-xl bg-[#4c310e] ${className}`}
      style={{ height }}
    >
      <div
        className={cn('h-full bg-[#4F6027]', {
          'bg-[#8C3B25]': progress < 30,
        })}
        style={{
          width: `${progress}%`,
          height: '100%',
          transition: 'width 0.05s linear',
        }}
      />
    </div>
  );
}
