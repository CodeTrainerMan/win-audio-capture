# Windows Audio Capture

A JavaScript library for capturing desktop audio on Windows systems using FFmpeg and DirectShow.

## Language Switch

- [English](README.md) - English documentation
- [中文](README.zh-CN.md) - Chinese documentation

---

## Features

- 🎵 **Desktop Audio Capture**: Capture system audio output in real-time
- 🔧 **Device Detection**: Automatically detect and recommend audio devices
- 📊 **Real-time Processing**: Stream audio data with callbacks
- 🎯 **Smart Device Selection**: Automatically select the best audio device
- 💾 **Multiple Formats**: Support for WAV format with configurable parameters
- 🔌 **Easy Integration**: Simple API for Node.js applications

## Installation

```bash
# Using npm
npm install win-audio-capture

# Using yarn
yarn add win-audio-capture
```

## Prerequisites

- **Windows OS**: This library is designed for Windows systems
- **FFmpeg**: Must be installed and available in PATH
- **Node.js**: Version 14 or higher

### Installing FFmpeg

1. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add to PATH: `C:\ffmpeg\bin`
4. Verify installation: `ffmpeg -version`

## Quick Start

```javascript
const { WinAudioCapture } = require('win-audio-capture');

async function captureAudio() {
  const audioCapture = new WinAudioCapture();
  
  // Get available devices
  const devices = await audioCapture.getDevices();
  const selectedDevice = audioCapture.getRecommendedDevice(devices);
  
  // Start capture
  await audioCapture.startCapture({
    device: selectedDevice.name,
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    onData: (chunk) => {
      // Process audio data in real-time
      console.log('Received audio chunk:', chunk.length, 'bytes');
    }
  });
  
  // Stop after 10 seconds
  setTimeout(async () => {
    await audioCapture.stopCapture();
    console.log('Capture completed');
  }, 10000);
}

captureAudio().catch(console.error);
```

## API Reference

### WinAudioCapture Class

#### Constructor
```javascript
const audioCapture = new WinAudioCapture();
```

#### Methods

##### `getDevices()`
Get available audio devices.

```javascript
const devices = await audioCapture.getDevices();
// Returns: Array of device objects
```

##### `getRecommendedDevice(devices)`
Get the recommended audio device from a list.

```javascript
const devices = await audioCapture.getDevices();
const recommended = audioCapture.getRecommendedDevice(devices);
// Returns: Recommended device object or null
```

##### `startCapture(options)`
Start audio capture.

```javascript
await audioCapture.startCapture({
  device: 'device_name',           // Audio device name
  sampleRate: 16000,              // Sample rate (Hz)
  channels: 1,                    // Number of channels
  bitDepth: 16,                   // Bit depth
  outputPath: 'output.wav',       // Optional: Save to file
  onData: (chunk) => {            // Optional: Real-time callback
    // Process audio chunk
  }
});
```

##### `stopCapture()`
Stop audio capture.

```javascript
await audioCapture.stopCapture();
```

##### `getCapturedData()`
Get all captured audio data.

```javascript
const audioData = audioCapture.getCapturedData();
// Returns: Buffer containing WAV audio data
```

##### `saveToFile(filePath)`
Save captured audio to file.

```javascript
await audioCapture.saveToFile('output.wav');
```

##### `getAudioInfo()`
Get information about captured audio.

```javascript
const info = audioCapture.getAudioInfo();
// Returns: { size: number, duration: number, format: string }
```

##### `isCapturing()`
Check if currently capturing.

```javascript
const isCapturing = audioCapture.isCapturing();
// Returns: boolean
```

## Device Types

The library automatically categorizes audio devices:

- **Stereo Mix**: Recommended for desktop audio capture
- **Microphone**: Input devices for voice recording
- **Other**: Special purpose devices

## Integration with Alibaba Cloud ASR

This library can be integrated with Alibaba Cloud's real-time Automatic Speech Recognition (ASR) service.

### Basic ASR Integration

```javascript
const { WinAudioCapture } = require('win-audio-capture');
const Nls = require('alibabacloud-nls');

const audioCapture = new WinAudioCapture();

// Initialize ASR session
const st = new Nls.SpeechTranscription({
  url: "wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1",
  appkey: "your_appkey",
  token: "your_token"
});

// Start capture and send to ASR
await audioCapture.startCapture({
  device: 'your_device',
  sampleRate: 16000,
  channels: 1,
  bitDepth: 16,
  onData: (chunk) => {
    const pcmData = isFirstChunk ? chunk.slice(44) : chunk;
    st.sendAudio(pcmData);
  }
});
```

### Quick ASR Setup

```bash
# Set environment variables
export ALIYUN_AK_ID=your_access_key_id
export ALIYUN_AK_SECRET=your_access_key_secret

# Run ASR demo
yarn example:aliyun
```

## Examples

### Basic Usage
```bash
yarn example:basic
```

### Advanced Usage
```bash
yarn example:advanced
```

### Alibaba Cloud ASR Demo
```bash
yarn example:aliyun
```

## Error Handling

The library provides comprehensive error handling:

```javascript
try {
  await audioCapture.startCapture(options);
} catch (error) {
  if (error.message.includes('No audio devices found')) {
    console.log('Please check your audio devices');
  } else if (error.message.includes('FFmpeg not found')) {
    console.log('Please install FFmpeg');
  }
}
```

## Troubleshooting

### Common Issues

1. **No audio devices found**
   - Enable "Stereo Mix" in Windows audio settings
   - Check audio drivers
   - Verify FFmpeg installation

2. **FFmpeg not found**
   - Install FFmpeg and add to PATH
   - Verify with `ffmpeg -version`

3. **No audio data captured**
   - Ensure system has audio output
   - Check if audio is playing
   - Verify device selection

### Diagnostic Tools

```bash
# Run audio device diagnostic
yarn diagnose:audio

# Test audio capture
yarn test:audio
```

## Development

### Building
```bash
yarn build
```

### Development Mode
```bash
yarn dev
```

### Testing
```bash
yarn test
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the examples directory

## Changelog

### v1.0.0
- Initial release
- Basic audio capture functionality
- Device detection and recommendation
- Real-time audio processing
- Alibaba Cloud ASR integration 