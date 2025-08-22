import { cn } from '@/utils/cn';

interface TimeIconProps {
  color: string;
  isRunning: boolean;
}

export default function TimeIcon({ color, isRunning }: TimeIconProps) {
  return (
    <svg
      className={cn('h-[24px] w-[24px]')}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />

      <line stroke={color} strokeWidth="2" x1="12" x2="18" y1="12" y2="12" />
      <line
        stroke={color}
        strokeWidth="2"
        style={{
          transformOrigin: '12px 12px',
          transform: isRunning ? 'rotate(0deg)' : 'none',
          animation: isRunning ? 'spin-slow 2s linear infinite' : 'none',
        }}
        x1="12"
        x2="12"
        y1="12"
        y2="6"
      />
    </svg>
  );
}
