class AudioEngine {
  constructor() {
    this.ctx = null;
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.preservesPitch = false; // 关闭保调，降速时自然降调
    this.isPlaying = false;
  }

  init(fileUrl) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.source = this.ctx.createMediaElementSource(this.audioElement);
      
      // 创建低通滤波器（控制 X 轴的闷响感）
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 20000; // 默认全通无过滤

      // 链路连接：音频源 -> 滤波器 -> 扬声器
      this.source.connect(this.filter);
      this.filter.connect(this.ctx.destination);
    }

    this.audioElement.src = fileUrl;
  }

  togglePlay() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  // 基础参数响应：X 轴控制低通滤波器，Y 轴控制播放速度与音调
  updateParams(x, y) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // X 轴（0~8）：从 400Hz（极度沉闷）到 20000Hz（清晰原声）
    const minFreq = 400;
    const maxFreq = 20000;
    const freq = minFreq + (maxFreq - minFreq) * (x / 8);
    this.filter.frequency.setTargetAtTime(freq, now, 0.1);

    // Y 轴（0~8）：从 0.8x（慢速慵懒）到 1.2x（加速跳脱）
    const minRate = 0.8;
    const maxRate = 1.2;
    const rate = minRate + (maxRate - minRate) * (y / 8);
    this.audioElement.playbackRate = rate;
  }
}
