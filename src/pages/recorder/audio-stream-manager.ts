export class AudioStreamManager {
  private static instance: AudioStreamManager;
  private stream: MediaStream | null = null;
  private isInitialized = false;
  private listeners: Set<(stream: MediaStream | null) => void> = new Set();

  private constructor() {}

  static getInstance(): AudioStreamManager {
    if (!AudioStreamManager.instance) {
      AudioStreamManager.instance = new AudioStreamManager();
    }

    return AudioStreamManager.instance;
  }

  // 初始化并获取麦克风权限
  async initialize(): Promise<MediaStream> {
    if (this.stream && this.isInitialized && this.stream.active) {
      return this.stream;
    }

    try {
      this.stream = await navigator?.mediaDevices?.getUserMedia?.({ audio: true });
      if (!this.stream) {
        throw new Error("获取麦克风权限失败");
      }

      this.isInitialized = true;
      this.notifyListeners(this.stream);

      return this.stream;
    } catch (error) {
      this.isInitialized = false;
      this.notifyListeners(null);
      throw error;
    }
  }

  // 获取当前的 stream
  getStream(): MediaStream | null {
    return this.stream;
  }

  // 检查是否已初始化
  isReady(): boolean {
    return this.isInitialized && this.stream !== null;
  }

  // 添加 stream 状态变化监听器
  addListener(listener: (stream: MediaStream | null) => void): () => void {
    this.listeners.add(listener);
    // 立即通知当前状态
    listener(this.stream);

    // 返回取消监听的函数
    return () => {
      this.listeners.delete(listener);
    };
  }

  // 通知所有监听器
  private notifyListeners(stream: MediaStream | null) {
    this.listeners.forEach((listener) => {
      try {
        listener(stream);
      } catch (error) {
        console.error("AudioStreamManager listener error:", error);
      }
    });
  }

  // 停止并清理 stream
  destroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.isInitialized = false;
    this.notifyListeners(null);
  }

  // 重置 stream（用于重新申请权限）
  async reset(): Promise<MediaStream> {
    this.destroy();

    return this.initialize();
  }
}
