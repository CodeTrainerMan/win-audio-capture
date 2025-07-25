const AudioCapture = require('./audio-capture');
const AudioDevice = require('./audio-device');
const AudioProcessor = require('./audio-processor');

/**
 * Windows Desktop Audio Capture Library
 * @module WinAudioCapture
 */

/**
 * Audio Capture Class
 * @class AudioCapture
 */
class WinAudioCapture {
  constructor() {
    this.audioCapture = new AudioCapture();
    this.audioProcessor = new AudioProcessor();
  }

  /**
   * Get available audio devices
   * @returns {Promise<Array<AudioDevice>>} Audio device list
   */
  async getDevices() {
    return await this.audioCapture.getDevices();
  }

  /**
   * Start audio capture
   * @param {Object} options Capture options
   * @param {string} options.device Audio device name
   * @param {number} options.sampleRate Sample rate
   * @param {number} options.channels Number of channels
   * @param {number} options.bitDepth Bit depth
   * @param {string} options.outputPath Output file path
   * @param {Function} options.onData Data callback function
   * @returns {Promise<void>}
   */
  async startCapture(options = {}) {
    return await this.audioCapture.start(options);
  }

  /**
   * Stop audio capture
   * @returns {Promise<void>}
   */
  async stopCapture() {
    return await this.audioCapture.stop();
  }

  /**
   * Get captured audio data
   * @returns {Buffer} Audio data
   */
  getCapturedData() {
    return this.audioCapture.getCapturedData();
  }

  /**
   * Save audio to file
   * @param {string} filePath File path
   * @returns {Promise<void>}
   */
  async saveToFile(filePath) {
    return await this.audioCapture.saveToFile(filePath);
  }

  /**
   * Get audio information
   * @returns {Object} Audio information
   */
  getAudioInfo() {
    return this.audioCapture.getAudioInfo();
  }

  /**
   * Process audio data
   * @param {Buffer} audioData Audio data
   * @param {Object} options Processing options
   * @returns {Buffer} Processed audio data
   */
  processAudio(audioData, options = {}) {
    return this.audioProcessor.process(audioData, options);
  }

  /**
   * Check if currently capturing
   * @returns {boolean}
   */
  isCapturing() {
    return this.audioCapture.isCapturing;
  }

  /**
   * Get recommended audio device
   * @param {Array} devices Device list
   * @returns {Object|null} Recommended device
   */
  getRecommendedDevice(devices) {
    return this.audioCapture.getRecommendedDevice(devices);
  }
}

// 导出主要类和工具类
module.exports = {
  WinAudioCapture,
  AudioCapture,
  AudioDevice,
  AudioProcessor
};

// 默认导出
module.exports.default = WinAudioCapture; 