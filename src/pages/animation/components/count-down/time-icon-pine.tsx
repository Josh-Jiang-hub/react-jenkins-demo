import { useEffect, useRef, useState } from "react";

interface TimeIcon1Props {
  isCountdown?: boolean;
  time?: number;
  radius?: number;
  background?: string;
}

const TimeIcon1 = ({ isCountdown = false, time = 30, radius = 40, background }: TimeIcon1Props) => {
  const [process, setProcess] = useState(0);
  const maxCount = (time * 1000) / 30;
  const startX = radius;
  const startY = radius;
  const endX = startX + radius * Math.sin((process / maxCount) * 2 * Math.PI);
  const endY = startY - radius * Math.cos((process / maxCount) * 2 * Math.PI);
  const bigAngle = +(process > maxCount / 2);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewBox = `0 0 ${radius * 2} ${radius * 2}`;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProcess(0);
  }, [time, radius]);

  useEffect(() => {
    if (!isCountdown) {
      intervalRef.current = setInterval(() => {
        setProcess((prev) => {
          if (prev > maxCount) {
            return 0;
          }

          return prev + 1;
        });
      }, 30);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isCountdown]);

  return (
    <svg height={radius * 2} viewBox={viewBox} width={radius * 2}>
      <path
        d={`M${startX},${startY} L${endX},${endY} A${radius},${radius} 0 ${+!bigAngle} 1 ${radius},${0}Z`}
        fill={background ? background : "red"}
      />
    </svg>
  );
};

export default TimeIcon1;
