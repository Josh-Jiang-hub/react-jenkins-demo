import { useAudioRecorder } from '@/pages/recorder/use-audio-recorder';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import VolumeChangeBar from './volume-change-bar';
import { Loader2 } from 'lucide-react';
import WaveButton from './wave-button';

export default function TestRecordBox() {
  const [recordingTestStatus, setRecordingTestStatus] = useState<
    'idle' | 'recording' | 'testing' | 'success' | 'fail' | 'empty' | 'retry'
  >('idle');

  const recordingUrlRef = useRef<string | null>(null);

  const { startRecording, stopRecording } = useAudioRecorder({
    onRecordingComplete: (record) => {
      recordingUrlRef.current = record.url;
      setRecordingTestStatus('success');
    },
    onRecordingError: async () => {
      setRecordingTestStatus('fail');
      //   const showRecordPermissionDialog = await isShowRecordPermissionDialog();
      //   if (showRecordPermissionDialog && error instanceof DOMException) {
      //     show(RecordPermissionDialog, {
      //       onCancel: () => {
      //         efJsBridge.goBack();
      //         hide(RecordPermissionDialog);
      //       },
      //       cancelButtonText: '我知道了',
      //     });

      //     return;
      //   }
      //   show(CommonDialog, {
      //     content: (
      //       <div className="flex w-full flex-col items-center justify-start gap-2 rounded-tl-xl rounded-tr-xl pb-6">
      //         <div className="flex flex-col items-center justify-center">
      //           <ErrorIcon />
      //         </div>
      //         <div className="text-center text-base font-bold leading-snug text-[#444444]">
      //           未获取录音权限，将退出模拟测试
      //         </div>
      //       </div>
      //     ),
      //     okText: '我知道了',
      //     onOk: () => {
      //       efJsBridge.goBack();
      //     },
      //     cancelText: null,
      //   });
    },
    onRecordingSuccessStart: () => {
      setRecordingTestStatus('recording');
    },
    recordingEmptyHandler: () => {
      setRecordingTestStatus('empty');
    },
  });

  const toggleRecording = () => {
    if (recordingTestStatus === 'success') {
      console.log('开始考试');

      return;
    }

    // 如果正在评分，则不进行录音
    if (
      recordingTestStatus === 'idle' ||
      recordingTestStatus === 'empty' ||
      recordingTestStatus === 'retry'
    ) {
      startRecording();

      return;
    }

    if (recordingTestStatus === 'recording') {
      setRecordingTestStatus('testing');
      stopRecording();

      return;
    }
  };

  const renderTipsText = () => {
    if (recordingTestStatus === 'recording') {
      return '再次点击，即可提交测试';
    }
    if (recordingTestStatus === 'testing') {
      return '检测中...';
    }

    if (recordingTestStatus === 'empty') {
      return '录音为空，请点击重新测试';
    }

    return '';
  };

  const renderText = () => {
    if (recordingTestStatus === 'testing') {
      return (
        <div className="flex h-full w-full items-center justify-center space-x-2">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      );
    }

    if (recordingTestStatus === 'recording') {
      return (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex h-full w-full items-center justify-center"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VolumeChangeBar
            barColor="#0DB5CC"
            className="items-center justify-center"
          />
        </motion.div>
      );
    }

    if (recordingTestStatus === 'success') {
      return (
        <span className="] text-base font-medium leading-snug text-[#0db5cc]">
          可以听到，开始考试
        </span>
      );
    }

    if (recordingTestStatus === 'retry') {
      return (
        <span className="text-base font-bold leading-snug text-[#0db5cc]">
          重新测试麦克风
        </span>
      );
    }

    return (
      <span className="text-base font-bold leading-snug text-[#0db5cc]">
        测试麦克风
      </span>
    );
  };

  return (
    <div className="inline-flex max-w-screen-tablet h-[400px]  z-[1000]  w-full flex-col items-center justify-center bg-[#0db5cc] px-[20px] pb-[8px] pt-[20px]">
      {recordingTestStatus === 'recording' && (
        <motion.div
          animate={{ opacity: 1 }}
          className="mb-[30px] text-lg font-bold leading-[28.80px] text-white"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          请读这段文字：一二三四五
        </motion.div>
      )}
      {recordingTestStatus === 'success' && recordingUrlRef.current && (
        <motion.div
          animate={{ opacity: 1 }}
          className="mb-[29px] h-[32px] w-full max-w-screen-tablet px-[30px] tablet:px-[100px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <WaveButton url={recordingUrlRef.current} />
        </motion.div>
      )}
      <div className="flex h-12 w-full max-w-screen-tablet space-x-2">
        <div
          className={`flex h-full items-center justify-center overflow-hidden rounded-[28px] border-2 border-white text-center font-sourceSans text-base font-medium leading-relaxed text-white backdrop-blur-[5px] transition-all duration-300 ease-in-out ${
            recordingTestStatus === 'success'
              ? 'w-[30%] opacity-100'
              : 'w-0 opacity-0'
          }`}
          onClick={() => {
            if (recordingTestStatus === 'success') {
              setRecordingTestStatus('retry');
            }
          }}
        >
          <span className="whitespace-nowrap">听不到</span>
        </div>
        <div
          className="flex  h-full w-full flex-1 items-center justify-center rounded-[999px] bg-white px-6 py-1.5 text-center"
          onClick={toggleRecording}
          style={{
            transition: 'all 1s ease-in-out',
          }}
        >
          {renderText()}
        </div>
      </div>
      <span className="mt-[4px] h-[19px] text-xs font-normal leading-[19px] text-white">
        {renderTipsText()}
      </span>
    </div>
  );
}
