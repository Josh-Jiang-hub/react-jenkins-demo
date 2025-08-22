import { Button } from 'antd';
import { useState } from 'react';
import { useAudioRecorder } from './use-audio-recorder';

export default function Recorder() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    onRecordingComplete: (recording) => {
      setAudioUrl(recording.url);
    },
  });

  return (
    <div>
      <Button onClick={() => startRecording()}> 开始录音</Button>
      <div>{isRecording ? '录音中' : '录音结束'}</div>
      <Button onClick={() => stopRecording()}> 暂停</Button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
}
