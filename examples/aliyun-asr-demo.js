const { WinAudioCapture } = require('../src/index');
const fs = require('fs');

/**
 * 阿里云实时语音识别 Demo
 * 基于阿里云官方示例代码
 */

class AliyunASRDemo {
  constructor() {
    this.audioCapture = new WinAudioCapture();
    this.isRecording = false;
    this.recognitionResults = [];
    this.tokenManager = null;
    
    // 阿里云配置 - 支持环境变量和配置文件
    this.aliyunConfig = {
      accessKeyId: '',
      accessKeySecret: '',
      appKey: '',
      endpoint: 'nls-gateway.cn-shanghai.aliyuncs.com',
      region: 'cn-shanghai',  // 优先使用环境变量
    };
  }

  /**
   * 初始化阿里云ASR客户端
   */
  async initAliyunASR() {
    try {
      // 动态导入阿里云SDK
      const Nls = await import('alibabacloud-nls');
      this.Nls = Nls;
      
      // 获取Token
      console.log('⏳ 获取阿里云Token...');
      const tokenResult = await this.getToken();
      
      if (!tokenResult.success) {
        console.error('❌ 获取Token失败:', tokenResult.error);
        return false;
      }

      this.aliyunConfig.token = tokenResult.token;
      console.log('✅ Token获取成功');
      console.log(`   过期时间: ${tokenResult.expireTime}`);
      
      console.log('✅ 阿里云ASR客户端初始化成功');
      return true;
    } catch (error) {
      console.error('❌ 阿里云ASR客户端初始化失败:', error.message);
      console.log('💡 请先安装阿里云SDK: yarn add alibabacloud-nls');
      console.log('💡 请确保已配置正确的阿里云访问密钥');
      return false;
    }
  }

  /**
   * 获取Token
   */
  async getToken() {
    try {
      const RPCClient = require('@alicloud/pop-core').RPCClient;
      
      const client = new RPCClient({
        accessKeyId: this.aliyunConfig.accessKeyId,
        accessKeySecret: this.aliyunConfig.accessKeySecret,
        endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
        apiVersion: '2019-02-28',
        timeout: 10000,  // 增加超时时间到10秒
        retry: 3         // 重试3次
      });

      const result = await client.request('CreateToken');
      
      return {
        token: result.Token.Id,
        expireTime: result.Token.ExpireTime,
        success: true
      };
    } catch (error) {
      console.error('❌ 获取Token失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 开始实时语音识别
   */
  async startRealTimeASR() {
    if (!this.Nls) {
      console.error('❌ 请先初始化阿里云ASR客户端');
      return;
    }

    console.log('🚀 开始实时语音识别...\n');

    try {
      // 获取音频设备
      console.log('📋 获取音频设备...');
      const devices = await this.audioCapture.getDevices();
      
      if (devices.length === 0) {
        console.error('❌ 未找到音频设备');
        return;
      }

      console.log('✅ 找到音频设备:', devices.map(d => d.name).join(', '));
      const selectedDevice = devices[0];

      // 启动ASR识别
      console.log('🎙️ 启动实时语音识别...');
      console.log('   设备:', selectedDevice.name);
      console.log('   采样率: 16kHz');
      console.log('   声道: 单声道');
      console.log('   格式: PCM');
      console.log('');

      let isFirstChunk = true;
      let pcmDataBuffer = Buffer.alloc(0);

      // 创建ASR会话
      const st = new this.Nls.SpeechTranscription({
        url: `wss://${this.aliyunConfig.endpoint}/ws/v1`,
        appkey: this.aliyunConfig.appKey,
        token: this.aliyunConfig.token
      });

      // 监听ASR事件
      st.on("started", (msg) => {
        console.log("✅ ASR会话已启动:", msg);
      });

      st.on("completed", (msg) => {
        console.log("🎯 识别完成:", JSON.stringify(msg, null, 2));
        let result = '未识别到内容';
        
        // 尝试不同的结果字段
        if (msg.payload && msg.payload.result) {
          result = msg.payload.result;
        } else if (msg.result) {
          result = msg.result;
        } else if (msg.payload && msg.payload.text) {
          result = msg.payload.text;
        } else if (msg.text) {
          result = msg.text;
        }
        
        this.recognitionResults.push({
          type: 'final',
          text: result,
          timestamp: new Date().toISOString()
        });
      });

      st.on("closed", () => {
        console.log("🔚 ASR会话已关闭");
      });

      st.on("failed", (msg) => {
        console.error("❌ ASR错误:", msg);
      });

      st.on("begin", (msg) => {
        // console.log("📝 开始识别:", msg);
      });
      
      st.on("end", (msg) => {
        console.log("🏁 识别结束:", JSON.parse(msg).payload.result);
        // console.log("🏁 识别结束:", JSON.stringify(msg, null, 2).payload.result);
      });

      // 启动ASR会话
      try {
        await st.start(st.defaultStartParams(), true, 6000);
        console.log('✅ ASR会话启动成功');
      } catch (error) {
        console.error('❌ 启动ASR会话失败:', error);
        return;
      }

      // 开始音频捕获
      await this.audioCapture.startCapture({
        device: selectedDevice.name,
        sampleRate: 16000,
        channels: 1,
        bitDepth: 16,
        onData: (chunk) => {
          if (this.isRecording) {
            // 处理音频数据
            if (isFirstChunk) {
              // 第一个chunk包含WAV头，需要去掉
              const pcmData = chunk.slice(44);
              pcmDataBuffer = Buffer.concat([pcmDataBuffer, pcmData]);
              isFirstChunk = false;
              console.log('📝 第一个数据块处理完成，去掉WAV头部，大小:', pcmData.length);
            } else {
              pcmDataBuffer = Buffer.concat([pcmDataBuffer, chunk]);
            }

            // 当累积足够的数据时发送给ASR
            if (pcmDataBuffer.length >= 3200) { // 200ms的数据 (16000 * 2 * 0.1)
              // console.log('📤 发送音频数据到ASR，大小:', pcmDataBuffer.length);
              this.sendAudioToASR(st, pcmDataBuffer);
              pcmDataBuffer = Buffer.alloc(0);
            }
          }
        }
      });

      this.isRecording = true;
      this.asrSession = st;
      console.log('⏳ 开始录音，请说话... (按 Ctrl+C 停止)');

    } catch (error) {
      console.error('❌ 启动实时语音识别失败:', error.message);
    }
  }

  /**
   * 发送音频数据到ASR
   */
  async sendAudioToASR(st, audioData) {
    if (st && this.isRecording) {
      try {
        if (!st.sendAudio(audioData)) {
          throw new Error("send audio failed");
        }
        // 添加小延迟，模拟实时发送
        await this.sleep(20);
      } catch (error) {
        console.error('❌ 发送音频数据失败:', error.message);
      }
    }
  }

  /**
   * 睡眠函数
   */
  sleep(waitTimeInMs) {
    return new Promise(resolve => setTimeout(resolve, waitTimeInMs));
  }

  /**
   * 停止录音和识别
   */
  async stop() {
    console.log('\n⏹️ 停止录音和识别...');
    
    this.isRecording = false;

    if (this.asrSession) {
      try {
        console.log("关闭ASR会话...");
        await this.asrSession.close();
      } catch (error) {
        console.error('关闭ASR会话失败:', error);
      }
    }

    if (this.audioCapture) {
      await this.audioCapture.stopCapture();
    }

    // 保存识别结果
    // this.saveResults();
    
    console.log('✅ 录音和识别已停止');
  }

  /**
   * 保存识别结果
   */
  saveResults() {
    if (this.recognitionResults.length > 0) {
      const filename = `asr_results_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      fs.writeFileSync(filename, JSON.stringify(this.recognitionResults, null, 2));
      console.log(`📄 识别结果已保存: ${filename}`);
      
      console.log('\n📊 识别统计:');
      console.log(`   总识别次数: ${this.recognitionResults.length}`);
      console.log(`   识别内容:`);
      this.recognitionResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.text}`);
      });
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🎵 阿里云实时语音识别 Demo\n');
  
  const demo = new AliyunASRDemo();
  
  // 初始化阿里云ASR（包含Token获取）
  const initialized = await demo.initAliyunASR();
  if (!initialized) {
    console.log('\n💡 配置说明:');
    console.log('1. 检查AccessKey配置是否正确');
    console.log('2. 确保网络连接正常');
    console.log('3. 检查阿里云账号权限');
    console.log('4. 运行: yarn example:aliyun');
    return;
  }

  // 启动实时语音识别
  await demo.startRealTimeASR();

  // 监听退出信号
  process.on('SIGINT', async () => {
    await demo.stop();
    process.exit(0);
  });

  // 5分钟后自动停止（可选）
  setTimeout(async () => {
    console.log('\n⏰ 5分钟时间到，自动停止...');
    await demo.stop();
    process.exit(0);
  }, 5 * 60 * 1000);
}

// 运行demo
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AliyunASRDemo; 