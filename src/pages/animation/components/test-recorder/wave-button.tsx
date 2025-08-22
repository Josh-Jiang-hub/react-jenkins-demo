import { cn } from '@/utils/cn';
import { Howl } from 'howler';
import { useEffect, useRef, useState } from 'react';

interface WaveBtnProps {
  url?: string;
}

const WaveButton = (props: WaveBtnProps) => {
  const [progress, setProgress] = useState(0);

  const audioIns = useRef<Howl | null>(null);

  useEffect(() => {
    if (!props.url) {
      return;
    }

    audioIns.current = new Howl({
      src: [props.url || ''],
      format: ['mp3', 'wav', 'webm'],
      html5: true,
      onplay: () => {
        if (!audioIns.current) {
          return;
        }
        let updateRaf: number | undefined = undefined;
        // Define a function to be run on every animation frame
        const onAnimationFrame = () => {
          // If the howl is still playing
          if (audioIns.current?.playing()) {
            // Calculate the width
            const progress =
              audioIns.current.seek() / audioIns.current.duration();
            setProgress(progress);

            // Continue processing updates
            updateRaf = requestAnimationFrame(onAnimationFrame);
          } else {
            // Stop processing updates
            if (updateRaf) {
              cancelAnimationFrame(updateRaf);
            }
          }
        };

        // Start processing updates
        updateRaf = requestAnimationFrame(onAnimationFrame);
      },
      onend: () => {
        setProgress(0);
      },
    });

    return () => {
      if (audioIns.current) {
        audioIns.current.stop();
        audioIns.current = null;
      }
    };
  }, [props.url]);

  if (!props.url) {
    return (
      <div className="flex w-full flex-1 items-center justify-center font-bold">
        <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-white">
          <div>
            <svg
              fill="none"
              height="25"
              viewBox="0 0 24 25"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1.5C5.928 1.5 1 6.428 1 12.5C1 18.572 5.928 23.5 12 23.5C18.072 23.5 23 18.572 23 12.5C23 6.428 18.072 1.5 12 1.5ZM13.1 18H10.9V15.8H13.1V18ZM13.1 13.6H10.9V7H13.1V13.6Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="relative w-full">没有检测到语音上传哦~</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex w-full flex-1 items-center justify-center')}
      onClick={() => {
        if (audioIns.current?.playing()) {
          audioIns.current?.stop();
          audioIns.current?.play();
        } else {
          audioIns.current?.play();
        }
      }}
    >
      <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4">
        <div>
          <svg
            fill="none"
            height="32"
            viewBox="0 0 32 32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 13.3356V18.669C4 19.4023 4.6 20.0023 5.33333 20.0023H9.33333L13.72 24.389C14.56 25.229 16 24.629 16 23.4423V8.54898C16 7.36231 14.56 6.76231 13.72 7.60231L9.33333 12.0023H5.33333C4.6 12.0023 4 12.6023 4 13.3356ZM22 16.0023C22 13.6423 20.64 11.6156 18.6667 10.629V21.3623C20.64 20.389 22 18.3623 22 16.0023ZM18.6667 5.93564V6.20231C18.6667 6.70898 19 7.14898 19.4667 7.33564C22.9067 8.70898 25.3333 12.0823 25.3333 16.0023C25.3333 19.9223 22.9067 23.2956 19.4667 24.669C18.9867 24.8556 18.6667 25.2956 18.6667 25.8023V26.069C18.6667 26.909 19.5067 27.4956 20.28 27.2023C24.8 25.4823 28 21.1223 28 16.0023C28 10.8823 24.8 6.52231 20.28 4.80231C19.5067 4.49564 18.6667 5.09564 18.6667 5.93564Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="relative w-full">
          <div
            className="flex h-6 w-full flex-1 items-center justify-center bg-repeat-x"
            style={{
              opacity: progress > 0 ? 0.4 : 1,
              backgroundPositionY: 'center',
              backgroundImage:
                'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA3MCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNSIgeT0iNCIgd2lkdGg9IjMiIGhlaWdodD0iOCIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTAiIHk9IjUiIHdpZHRoPSIzIiBoZWlnaHQ9IjYiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjE1IiB5PSIyIiB3aWR0aD0iMyIgaGVpZ2h0PSIxMiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMjAiIHdpZHRoPSIzIiBoZWlnaHQ9IjE2IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyNSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMTIiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjMwIiB5PSI0IiB3aWR0aD0iMyIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIzNSIgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNDAiIHk9IjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjgiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjQ1IiB5PSIyIiB3aWR0aD0iMyIgaGVpZ2h0PSIxMiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNTAiIHdpZHRoPSIzIiBoZWlnaHQ9IjE2IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI1NSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMTIiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjYwIiB5PSI0IiB3aWR0aD0iMyIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI2NSIgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==")',
            }}
          />

          {progress > 0 && (
            <div
              className="absolute left-0 top-0 flex h-6 flex-1 items-center justify-center bg-repeat-x"
              style={{
                backgroundPositionY: 'center',
                width: `${progress * 100}%`,
                backgroundImage:
                  'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA3MCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNSIgeT0iNCIgd2lkdGg9IjMiIGhlaWdodD0iOCIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTAiIHk9IjUiIHdpZHRoPSIzIiBoZWlnaHQ9IjYiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjE1IiB5PSIyIiB3aWR0aD0iMyIgaGVpZ2h0PSIxMiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMjAiIHdpZHRoPSIzIiBoZWlnaHQ9IjE2IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIyNSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMTIiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjMwIiB5PSI0IiB3aWR0aD0iMyIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIzNSIgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNDAiIHk9IjQiIHdpZHRoPSIzIiBoZWlnaHQ9IjgiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjQ1IiB5PSIyIiB3aWR0aD0iMyIgaGVpZ2h0PSIxMiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNTAiIHdpZHRoPSIzIiBoZWlnaHQ9IjE2IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI1NSIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMTIiIHJ4PSIxLjUiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjYwIiB5PSI0IiB3aWR0aD0iMyIgaGVpZ2h0PSI4IiByeD0iMS41IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI2NSIgeT0iNSIgd2lkdGg9IjMiIGhlaWdodD0iNiIgcng9IjEuNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==")',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WaveButton;
