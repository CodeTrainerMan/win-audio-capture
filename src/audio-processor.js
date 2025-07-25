/**
 * Audio Processor Class
 * @class AudioProcessor
 */
class AudioProcessor {
  constructor() {
    this.processors = new Map();
    this.registerDefaultProcessors();
  }

  /**
   * Register default processors
   */
  registerDefaultProcessors() {
    this.registerProcessor('normalize', this.normalize.bind(this));
    this.registerProcessor('trim', this.trim.bind(this));
    this.registerProcessor('fade', this.fade.bind(this));
    this.registerProcessor('convert', this.convert.bind(this));
  }

  /**
   * Register custom processor
   * @param {string} name Processor name
   * @param {Function} processor Processing function
   */
  registerProcessor(name, processor) {
    this.processors.set(name, processor);
  }

  /**
   * Process audio data
   * @param {Buffer} audioData Audio data
   * @param {Object} options Processing options
   * @returns {Buffer} Processed audio data
   */
  process(audioData, options = {}) {
    let processedData = audioData;

    for (const [name, processor] of this.processors) {
      if (options[name]) {
        processedData = processor(processedData, options[name]);
      }
    }

    return processedData;
  }

  /**
   * Audio normalization
   * @param {Buffer} audioData Audio data
   * @param {Object} options Options
   * @returns {Buffer} Normalized audio data
   */
  normalize(audioData, options = {}) {
    const { targetLevel = -3 } = options;
    const samples = this.bufferToSamples(audioData);

    // Find maximum amplitude
    let maxAmplitude = 0;
    for (let i = 0; i < samples.length; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(samples[i]));
    }

    if (maxAmplitude === 0) return audioData;

    // Calculate gain
    const targetAmplitude = Math.pow(10, targetLevel / 20);
    const gain = targetAmplitude / maxAmplitude;

    // Apply gain
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.max(-1, Math.min(1, samples[i] * gain));
    }

    return this.samplesToBuffer(samples);
  }

  /**
   * Audio trimming
   * @param {Buffer} audioData Audio data
   * @param {Object} options Options
   * @returns {Buffer} Trimmed audio data
   */
  trim(audioData, options = {}) {
    const { start = 0, end = 1 } = options;
    const samples = this.bufferToSamples(audioData);

    const startIndex = Math.floor(start * samples.length);
    const endIndex = Math.floor(end * samples.length);

    const trimmedSamples = samples.slice(startIndex, endIndex);
    return this.samplesToBuffer(trimmedSamples);
  }

  /**
   * Audio fade in/out
   * @param {Buffer} audioData Audio data
   * @param {Object} options Options
   * @returns {Buffer} Processed audio data
   */
  fade(audioData, options = {}) {
    const { fadeIn = 0, fadeOut = 0 } = options;
    const samples = this.bufferToSamples(audioData);

    if (fadeIn > 0) {
      const fadeInSamples = Math.floor(fadeIn * samples.length);
      for (let i = 0; i < fadeInSamples; i++) {
        const factor = i / fadeInSamples;
        samples[i] *= factor;
      }
    }

    if (fadeOut > 0) {
      const fadeOutSamples = Math.floor(fadeOut * samples.length);
      for (let i = 0; i < fadeOutSamples; i++) {
        const factor = (fadeOutSamples - i) / fadeOutSamples;
        const index = samples.length - fadeOutSamples + i;
        if (index >= 0 && index < samples.length) {
          samples[index] *= factor;
        }
      }
    }

    return this.samplesToBuffer(samples);
  }

  /**
   * 音频格式转换
   * @param {Buffer} audioData 音频数据
   * @param {Object} options 选项
   * @returns {Buffer} 转换后的音频数据
   */
  convert(audioData, options = {}) {
    const { sampleRate = 44100, channels = 2, bitDepth = 16 } = options;

    // 这里可以实现采样率转换、声道转换等
    // 简化实现，实际项目中可能需要更复杂的重采样算法
    return audioData;
  }

  /**
   * 将Buffer转换为样本数组
   * @param {Buffer} buffer 音频缓冲区
   * @returns {Array<number>} 样本数组
   */
  bufferToSamples(buffer) {
    const samples = [];
    for (let i = 44; i < buffer.length; i += 2) { // 跳过WAV头部
      const sample = buffer.readInt16LE(i);
      samples.push(sample / 32768); // 转换为-1到1的范围
    }
    return samples;
  }

  /**
   * 将样本数组转换为Buffer
   * @param {Array<number>} samples 样本数组
   * @returns {Buffer} 音频缓冲区
   */
  samplesToBuffer(samples) {
    const buffer = Buffer.alloc(44 + samples.length * 2);

    // 写入WAV头部
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + samples.length * 2, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(44100, 24);
    buffer.writeUInt32LE(44100 * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(samples.length * 2, 40);

    // 写入音频数据
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      buffer.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
    }

    return buffer;
  }

  /**
   * 获取音频分析信息
   * @param {Buffer} audioData 音频数据
   * @returns {Object} 分析信息
   */
  analyze(audioData) {
    const samples = this.bufferToSamples(audioData);

    let sum = 0;
    let rms = 0;
    let peak = 0;

    for (const sample of samples) {
      sum += sample;
      rms += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }

    const average = sum / samples.length;
    rms = Math.sqrt(rms / samples.length);

    return {
      duration: samples.length / 44100,
      average,
      rms,
      peak,
      dynamicRange: 20 * Math.log10(peak / (rms || 0.0001)),
    };
  }
}

module.exports = AudioProcessor;
