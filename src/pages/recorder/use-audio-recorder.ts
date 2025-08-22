import { useState, useCallback, useRef } from 'react';
import { AudioStreamManager } from './audio-stream-manager';

export function encodeWAV(
  samples: Float32Array,
  sampleRate: number,
  numChannels: number
): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(
  output: DataView,
  offset: number,
  input: Float32Array
) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
}

// 跨浏览器兼容的AudioContext创建函数
function createAudioContext(): AudioContext {
  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error('Web Audio API不受支持');
  }

  return new AudioContextClass();
}

interface UseAudioRecorder2Props {
  onVolumeChange?: (volume: number) => void;
  onRecordingComplete?: (recording: {
    url: string;
    blob: Blob;
    size: number;
    timestamp: number;
  }) => void;
  onRecordingError?: (error: Error) => void;
  onRecordingSuccessStart?: () => void;
  recordingEmptyHandler?: () => void;
}

export function useAudioRecorder(props: UseAudioRecorder2Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioChunks = useRef<Float32Array[]>([]);
  const analyserNode = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number>(0);

  const [volume, setVolume] = useState(0);

  const startRecording = useCallback(async () => {
    try {
      const audioStream = AudioStreamManager.getInstance();
      const stream = await audioStream.initialize();

      if (!stream) {
        throw new Error('获取麦克风权限失败');
      }

      // 使用跨浏览器兼容的方式创建 AudioContext
      try {
        audioContext.current = createAudioContext();
      } catch (err) {
        console.error('创建 AudioContext 失败：', err);
        throw err;
      }

      // Safari 需要先恢复 AudioContext 状态
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }

      const source = audioContext.current.createMediaStreamSource(stream);

      const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

      // 添加分析器节点
      analyserNode.current = audioContext.current.createAnalyser();
      analyserNode.current.fftSize = 256;

      // 连接音频节点：source -> analyser -> processor -> destination
      source.connect(analyserNode.current);
      analyserNode.current.connect(processor);
      processor.connect(audioContext.current.destination);

      // 分析音量
      const analyzeVolume = () => {
        if (!analyserNode.current) {
          return;
        }

        const dataArray = new Uint8Array(
          analyserNode.current.frequencyBinCount
        );
        analyserNode.current.getByteFrequencyData(dataArray);

        // 计算平均音量
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        // 转换为 0-100 的范围
        const volume = Math.round((average / 255) * 100);

        setVolume(volume);
        animationFrameId.current = requestAnimationFrame(analyzeVolume);
      };

      analyzeVolume();

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioChunks.current.push(new Float32Array(inputData));
      };

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      setIsRecording(true);
      props?.onRecordingSuccessStart?.();
    } catch (error) {
      console.error('Error starting recording:', error);

      props?.onRecordingError?.(error as Error);

      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            console.error('用户拒绝了麦克风权限');
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            console.error('未找到麦克风设备');
            break;
          case 'NotReadableError':
          case 'TrackStartError':
            console.error('麦克风被占用或无法使用');
            break;
          default:
            console.error('获取麦克风失败：', error);
        }
      } else {
        console.error('录音出错：', error);
      }
    }
  }, [props]);

  const stopRecording = ({
    retainStream = false,
  }: { retainStream?: boolean } = {}) => {
    setIsRecording(false);
    if (mediaRecorder.current && audioContext.current) {
      // 停止音量分析
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // 注意：如果使用传入的 stream，不要停止其轨道
      if (!retainStream) {
        // 只有当你使用 AudioStreamManager 的 stream 时才停止轨道
        mediaRecorder.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (mediaRecorder.current?.state !== 'inactive') {
        // 停止 MediaRecorder
        mediaRecorder.current.stop();
      }

      // 关闭 AudioContext 及其相关节点
      if (audioContext.current.state !== 'closed') {
        // 断开所有连接
        if (analyserNode.current) {
          analyserNode.current.disconnect();
        }
        audioContext.current.close().catch(function (error: Error) {
          console.error('Error closing AudioContext:', error);
        });
      }

      const numChannels = 1;
      const sampleRate = 16000;
      const audioFrameLength =
        (audioChunks.current.length * 4096 * sampleRate) /
        audioContext.current.sampleRate;
      if (audioFrameLength === 0) {
        props?.recordingEmptyHandler?.();

        return;
      }

      // 使用跨浏览器兼容的方式创建 OfflineAudioContext
      let resampler;
      try {
        const OfflineAudioContextClass =
          window.OfflineAudioContext ||
          (window as any).webkitOfflineAudioContext;
        resampler = new OfflineAudioContextClass(
          numChannels,
          audioFrameLength,
          sampleRate
        );
      } catch (err) {
        console.error('创建 OfflineAudioContext 失败：', err);

        return;
      }

      const source = resampler.createBufferSource();
      const audioBuffer = audioContext.current.createBuffer(
        numChannels,
        audioChunks.current.length * 4096,
        audioContext.current.sampleRate
      );

      for (let i = 0; i < audioChunks.current.length; i++) {
        audioBuffer.getChannelData(0).set(audioChunks.current[i], i * 4096);
      }

      source.buffer = audioBuffer;
      source.connect(resampler.destination);
      source.start();

      const handleRenderingComplete = (renderedBuffer: AudioBuffer) => {
        const wavBlob = encodeWAV(
          renderedBuffer.getChannelData(0),
          sampleRate,
          numChannels
        );
        const audioUrl = URL.createObjectURL(wavBlob);
        setAudioUrl(audioUrl);

        props?.onRecordingComplete?.({
          url: audioUrl,
          blob: wavBlob,
          size: wavBlob.size,
          timestamp: Date.now(),
        });
      };

      const handleRenderingError = (error: Event) => {
        props?.onRecordingError?.(
          error instanceof Error ? error : new Error('音频渲染失败')
        );
      };

      // iOS 14.x 兼容性处理：startRendering 可能不支持 Promise
      const renderingResult = resampler.startRendering();

      if (renderingResult && typeof renderingResult.then === 'function') {
        // 支持 Promise 的现代浏览器
        renderingResult
          .then(handleRenderingComplete)
          .catch(handleRenderingError);
      } else {
        // 旧版本浏览器使用事件监听器
        resampler.oncomplete = (event) => {
          handleRenderingComplete(event.renderedBuffer);
        };

        // 使用 addEventListener 来处理错误事件
        resampler.addEventListener('error', (event: Event) => {
          handleRenderingError(event);
        });
      }

      audioChunks.current = [];
    }
  };

  return { isRecording, audioUrl, volume, startRecording, stopRecording };
}
