import { useState } from 'react';
import CountDownClock from './count-down-clock';
import CountdownProgress from './time-icon-bar';
import TimeIcon from './time-icon';

const defaultSeconds = 30;

export default function CountDown() {
  const [seconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  return (
    <div>
      <div className="mb-[20px] flex gap-[10px]">
        <button onClick={handleStart}>开始</button>
        <button onClick={handlePause}>暂停</button>
      </div>
      <div className="mb-[20px] flex flex-col gap-[10px]">
        <h3 className="w-fit">倒计时1</h3>
        <CountDownClock seconds={seconds} isRunning={isRunning} />
      </div>
      <div className="mb-[20px] flex flex-col gap-[10px]">
        <h3 className="w-fit">倒计时2</h3>
        <CountdownProgress paused={false} duration={30} />
      </div>

      <div className="mb-[20px] flex flex-col gap-[10px]">
        <h3 className="w-fit">倒计时3</h3>
        <TimeIcon color="#D9D9D9" isRunning={isRunning} />
      </div>
    </div>
  );
}
