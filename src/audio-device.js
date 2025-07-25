/**
 * Audio Device Class
 * @class AudioDevice
 */
class AudioDevice {
  constructor(id, name, type = 'audio') {
    this.id = id;
    this.name = name;
    this.type = type;
    this.isDefault = false;
    this.sampleRates = [44100, 48000, 96000];
    this.channels = [1, 2];
    this.bitDepths = [16, 24];
  }

  /**
   * Set default device
   * @param {boolean} isDefault Whether it's the default device
   */
  setDefault(isDefault) {
    this.isDefault = isDefault;
  }

  /**
   * Check if device supports specified sample rate
   * @param {number} sampleRate Sample rate
   * @returns {boolean}
   */
  supportsSampleRate(sampleRate) {
    return this.sampleRates.includes(sampleRate);
  }

  /**
   * Check if device supports specified number of channels
   * @param {number} channels Number of channels
   * @returns {boolean}
   */
  supportsChannels(channels) {
    return this.channels.includes(channels);
  }

  /**
   * Check if device supports specified bit depth
   * @param {number} bitDepth Bit depth
   * @returns {boolean}
   */
  supportsBitDepth(bitDepth) {
    return this.bitDepths.includes(bitDepth);
  }

  /**
   * Get device information
   * @returns {Object} Device information
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      isDefault: this.isDefault,
      supportedSampleRates: this.sampleRates,
      supportedChannels: this.channels,
      supportedBitDepths: this.bitDepths
    };
  }

  /**
   * Convert to string
   * @returns {string}
   */
  toString() {
    return `${this.name} (${this.id})`;
  }
}

module.exports = AudioDevice; 