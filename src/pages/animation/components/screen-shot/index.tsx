import { Button } from 'antd-mobile';
import { useRef } from 'react';
import { snapdom } from '@zumer/snapdom';
export default function ScreenShot() {
  const screenShotEl = useRef<HTMLDivElement>(null);

  const handleScreenShot = async () => {
    if (!screenShotEl.current) return;
    const png = await snapdom.toPng(screenShotEl.current);
    document.body.appendChild(png);
  };

  return (
    <div className="w-full h-full">
      <Button onClick={handleScreenShot}>截图</Button>
      <div className="w-full h-[1000px] bg-red-500" ref={screenShotEl}>
        this is a screenshot area
      </div>
    </div>
  );
}
