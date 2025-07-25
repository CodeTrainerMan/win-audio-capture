# Windows 音频捕获

一个使用FFmpeg和DirectShow在Windows系统上捕获桌面音频的JavaScript库。

## 语言切换

- [English](README.md) - 英文文档
- [中文](README.zh-CN.md) - 中文文档

---

## 功能特性

- 🎵 **桌面音频捕获**：实时捕获系统音频输出
- 🔧 **设备检测**：自动检测和推荐音频设备
- 📊 **实时处理**：通过回调流式处理音频数据
- 🎯 **智能设备选择**：自动选择最佳音频设备
- 💾 **多种格式**：支持可配置参数的WAV格式
- 🔌 **易于集成**：Node.js应用程序的简单API

## 安装

```bash
# 使用 npm
npm install win-audio-capture

# 使用 yarn
yarn add win-audio-capture
```

> **注意**: 此包直接包含源代码。用户可以在 `src/` 目录中查看和修改源代码。

## 前置要求

- **Windows操作系统**：此库专为Windows系统设计
- **FFmpeg**：必须安装并在PATH中可用
- **Node.js**：版本14或更高

### 安装FFmpeg

1. 从 [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html) 下载FFmpeg
2. 解压到文件夹（例如：`C:\ffmpeg`）
3. 添加到PATH：`C:\ffmpeg\bin`
4. 验证安装：`ffmpeg -version`

## 快速开始

```javascript
const { WinAudioCapture } = require('win-audio-capture');

async function captureAudio() {
  const audioCapture = new WinAudioCapture();
  
  // 获取可用设备
  const devices = await audioCapture.getDevices();
  const selectedDevice = audioCapture.getRecommendedDevice(devices);
  
  // 开始捕获
  await audioCapture.startCapture({
    device: selectedDevice.name,
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    onData: (chunk) => {
      // 实时处理音频数据
      console.log('收到音频数据块:', chunk.length, '字节');
    }
  });
  
  // 10秒后停止
  setTimeout(async () => {
    await audioCapture.stopCapture();
    console.log('捕获完成');
  }, 10000);
}

captureAudio().catch(console.error);
```

## API 参考

### WinAudioCapture 类

#### 构造函数
```javascript
const audioCapture = new WinAudioCapture();
```

#### 方法

##### `getDevices()`
获取可用的音频设备。

```javascript
const devices = await audioCapture.getDevices();
// 返回：设备对象数组
```

##### `getRecommendedDevice(devices)`
从列表中获取推荐的音频设备。

```javascript
const devices = await audioCapture.getDevices();
const recommended = audioCapture.getRecommendedDevice(devices);
// 返回：推荐的设备对象或null
```

##### `startCapture(options)`
开始音频捕获。

```javascript
await audioCapture.startCapture({
  device: '设备名称',              // 音频设备名称
  sampleRate: 16000,             // 采样率（Hz）
  channels: 1,                   // 声道数
  bitDepth: 16,                  // 位深度
  outputPath: 'output.wav',      // 可选：保存到文件
  onData: (chunk) => {           // 可选：实时回调
    // 处理音频数据块
  }
});
```

##### `stopCapture()`
停止音频捕获。

```javascript
await audioCapture.stopCapture();
```

##### `getCapturedData()`
获取所有捕获的音频数据。

```javascript
const audioData = audioCapture.getCapturedData();
// 返回：包含WAV音频数据的Buffer
```

##### `saveToFile(filePath)`
保存捕获的音频到文件。

```javascript
await audioCapture.saveToFile('output.wav');
```

##### `getAudioInfo()`
获取捕获音频的信息。

```javascript
const info = audioCapture.getAudioInfo();
// 返回：{ size: number, duration: number, format: string }
```

##### `isCapturing()`
检查是否正在捕获。

```javascript
const isCapturing = audioCapture.isCapturing();
// 返回：boolean
```

## 设备类型

库会自动对音频设备进行分类：

- **立体声混音**：桌面音频捕获的推荐设备
- **麦克风**：语音录制的输入设备
- **其他**：特殊用途设备

## 阿里云ASR集成

此库可以与阿里云的实时自动语音识别（ASR）服务集成。

### 基本ASR集成

```javascript
const { WinAudioCapture } = require('win-audio-capture');
const Nls = require('alibabacloud-nls');

const audioCapture = new WinAudioCapture();

// 初始化ASR会话
const st = new Nls.SpeechTranscription({
  url: "wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1",
  appkey: "your_appkey",
  token: "your_token"
});

// 开始捕获并发送到ASR
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

### 快速ASR设置

```bash
# 设置环境变量
export ALIYUN_AK_ID=your_access_key_id
export ALIYUN_AK_SECRET=your_access_key_secret

# 运行ASR演示
yarn example:aliyun
```

## 示例

### 基本使用
```bash
yarn example:basic
```

### 高级使用
```bash
yarn example:advanced
```

### 阿里云ASR演示
```bash
yarn example:aliyun
```

## 错误处理

库提供全面的错误处理：

```javascript
try {
  await audioCapture.startCapture(options);
} catch (error) {
  if (error.message.includes('No audio devices found')) {
    console.log('请检查您的音频设备');
  } else if (error.message.includes('FFmpeg not found')) {
    console.log('请安装FFmpeg');
  }
}
```

## 故障排除

### 常见问题

1. **未找到音频设备**
   - 在Windows音频设置中启用"立体声混音"
   - 检查音频驱动
   - 验证FFmpeg安装

2. **未找到FFmpeg**
   - 安装FFmpeg并添加到PATH
   - 使用 `ffmpeg -version` 验证

3. **未捕获到音频数据**
   - 确保系统有音频输出
   - 检查是否正在播放音频
   - 验证设备选择

### 诊断工具

```bash
# 运行音频设备诊断
yarn diagnose:audio

# 测试音频捕获
yarn test:audio
```

## 开发

### 构建
```bash
yarn build
```

### 开发模式
```bash
yarn dev
```

### 测试
```bash
yarn test
```

## 许可证

MIT许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 如果适用，添加测试
5. 提交拉取请求

## 支持

对于问题和疑问：
- 在GitHub上创建issue
- 查看故障排除部分
- 查看examples目录

## 更新日志

### v1.0.0
- 初始版本
- 基本音频捕获功能
- 设备检测和推荐
- 实时音频处理
- 阿里云ASR集成 