import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

const getRandomScales = (count: number) =>
  Array.from({ length: count }, () => Math.random() * 1.2); // scaleY: 0.5 ~ 2

const BarChartFromCenter: React.FC<{
  barCount?: number;
  className?: string;
  barColor?: string;
}> = ({ barCount = 15, className, barColor = '#FFFDE3' }) => {
  const [scales, setScales] = useState<number[]>(() =>
    getRandomScales(barCount)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setScales(getRandomScales(barCount));
    }, 200); // 每500ms变化一次

    return () => clearInterval(interval);
  }, [barCount]);

  return (
    <div
      className={cn(
        'flex h-7 items-center justify-center space-x-1',
        className
      )}
    >
      {scales.map((scale, i) => (
        <div
          className={cn('h-7 w-1')}
          key={i}
          style={{
            transform: `scaleY(${scale})`,
            transformOrigin: 'center',
            transition: 'transform 0.4s ease-in-out',
            borderRadius: 4,
            backgroundColor: barColor,
          }}
        />
      ))}
    </div>
  );
};

export default BarChartFromCenter;
