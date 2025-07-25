const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class AudioCapture {
  constructor() {
    this.isCapturing = false;
    this.outputStream = null;
    this.ffmpegProcess = null;
    this.capturedData = [];
  }

  async getDevices() {
    return new Promise((resolve, reject) => {
      exec('ffmpeg -list_devices true -f dshow -i dummy', (error, stdout, stderr) => {
        // FFmpeg always returns error code, but stderr contains device information
        const devices = [];
        const lines = stderr.split('\n');
        let foundAudioSection = false;
        
        for (const line of lines) {
          // Find lines containing audio device information
          // Format: [dshow @ xxxxxxxx] "device_name" (audio)
          const audioDeviceMatch = line.match(/\[dshow @ [^\]]+\] "([^"]+)" \(audio\)/);
          if (audioDeviceMatch) {
            const deviceName = audioDeviceMatch[1];
            // Determine device type and recommendation level
            let deviceType = 'microphone';
            let isRecommended = false;
            let priority = 0;
            
            if (deviceName.includes('立体声混音') || deviceName.includes('Stereo Mix')) {
              deviceType = 'stereo_mix';
              isRecommended = true;
              priority = 1; // Highest priority
            } else if (deviceName.includes('麦克风') || deviceName.includes('Microphone')) {
              deviceType = 'microphone';
              priority = 2;
            } else if (deviceName.includes('default') || deviceName.includes('Default')) {
              deviceType = 'default';
              priority = 3;
            }
            
            const device = {
              name: deviceName,
              type: 'audio',
              deviceType: deviceType,
              id: deviceName,
              sampleRates: [44100, 48000, 96000],
              channels: [1, 2],
              bitDepths: [16, 24],
              isRecommended: isRecommended,
              priority: priority
            };
            devices.push(device);
            foundAudioSection = true;
          }
        }
        
        // If no devices found, provide fallback devices
        if (devices.length === 0) {
          
          devices.push({
            name: '立体声混音 (Realtek High Definition Audio)',
            type: 'audio',
            id: 'stereo_mix',
            sampleRates: [44100, 48000, 96000],
            channels: [1, 2],
            bitDepths: [16, 24],
            isDefault: true
          });
          devices.push({
            name: 'default',
            type: 'audio',
            id: 'default',
            sampleRates: [44100, 48000, 96000],
            channels: [1, 2],
            bitDepths: [16, 24],
            isDefault: true
          });
        }
        
        // Ensure all devices have necessary properties
        devices.forEach(device => {
          if (!device.sampleRates) device.sampleRates = [44100, 48000, 96000];
          if (!device.channels) device.channels = [1, 2];
          if (!device.bitDepths) device.bitDepths = [16, 24];
        });
        
        resolve(devices);
      });
    });
  }

  async start(options = {}) {
    if (this.isCapturing) {
      throw new Error('Audio capture is already running');
    }

    const {
      device = 'default',
      sampleRate = 44100,
      channels = 2,
      bitDepth = 16,
      outputPath = null,
      onData = null
    } = options;

    this.isCapturing = true;
    this.capturedData = [];

    return new Promise((resolve, reject) => {
      const ffmpegArgs = [
        '-f', 'dshow',
        '-i', `audio=${device}`,
        '-acodec', 'pcm_s16le',
        '-ar', sampleRate.toString(),
        '-ac', channels.toString(),
        '-f', 'wav',
        'pipe:1'
      ];

      this.ffmpegProcess = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

      this.ffmpegProcess.stdout.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          this.capturedData.push(chunk);
          if (outputPath) {
            if (!this.outputStream) {
              this.outputStream = fs.createWriteStream(outputPath);
            }
            this.outputStream.write(chunk);
          }
          // Call onData callback
          if (onData && typeof onData === 'function') {
            onData(chunk);
          }
        }
      });

      this.ffmpegProcess.stderr.on('data', (data) => {
        // Can output logs as needed
        // console.log('FFmpeg:', data.toString());
      });

      this.ffmpegProcess.on('error', (error) => {
        reject(error);
      });

      // Give FFmpeg a moment to start
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async stop() {
    if (!this.isCapturing) {
      return;
    }

    this.isCapturing = false;

    return new Promise((resolve) => {
      if (this.ffmpegProcess) {
        this.ffmpegProcess.kill('SIGTERM');
        this.ffmpegProcess = null;
      }

      if (this.outputStream) {
        this.outputStream.end();
        this.outputStream = null;
      }

      setTimeout(resolve, 500);
    });
  }

  getCapturedData() {
    // Ensure all data are Buffer type
    const validBuffers = this.capturedData.filter(chunk => Buffer.isBuffer(chunk));
    return Buffer.concat(validBuffers);
  }

  async saveToFile(filePath) {
    const data = this.getCapturedData();
    if (data.length === 0) {
      throw new Error('No audio data captured');
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getAudioInfo() {
    const data = this.getCapturedData();
    return {
      size: data.length,
      duration: this.calculateDuration(data),
      format: 'WAV'
    };
  }

  calculateDuration(audioData) {
    // WAV header is 44 bytes, sample rate is 44100, 2 channels, 16-bit
    const dataSize = audioData.length - 44;
    const bytesPerSecond = 44100 * 2 * 2; // sampleRate * channels * bytesPerSample
    return dataSize > 0 ? dataSize / bytesPerSecond : 0;
  }

  // Get recommended audio device
  getRecommendedDevice(devices) {
    if (!devices || devices.length === 0) {
      return null;
    }

    // Sort by priority
    const sortedDevices = devices.sort((a, b) => a.priority - b.priority);
    
    // Return first recommended device or first device
    const recommended = sortedDevices.find(device => device.isRecommended);
    if (recommended) {
      return recommended;
    }

    return sortedDevices[0];
  }
}

module.exports = AudioCapture; 