#!/usr/bin/env node

/**
 * 项目设置脚本
 * 自动安装依赖并配置环境
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🎵 Win Audio Capture 项目设置\n');

async function setup() {
  try {
    // 1. 检查yarn是否安装
    console.log('📋 1. 检查包管理工具...');
    try {
      execSync('yarn --version', { stdio: 'pipe' });
      console.log('✅ Yarn 已安装');
    } catch (error) {
      console.error('❌ Yarn 未安装，请先安装 Yarn');
      console.log('💡 安装命令: npm install -g yarn');
      return;
    }

    // 2. 安装项目依赖
    console.log('\n📦 2. 安装项目依赖...');
    execSync('yarn install', { stdio: 'inherit' });
    console.log('✅ 项目依赖安装完成');

    // 3. 安装阿里云SDK（可选）
    console.log('\n🔧 3. 安装阿里云语音识别SDK...');
    try {
      execSync('yarn add alibabacloud-nls', { stdio: 'inherit' });
      console.log('✅ 阿里云SDK安装完成');
    } catch (error) {
      console.log('⚠️  阿里云SDK安装失败，可以稍后手动安装');
      console.log('💡 手动安装命令: yarn add alibabacloud-nls');
    }

    // 4. 构建项目
    console.log('\n🔨 4. 构建项目...');
    try {
      execSync('yarn build', { stdio: 'inherit' });
      console.log('✅ 项目构建完成');
    } catch (error) {
      console.log('⚠️  项目构建失败，可能需要手动构建');
    }

    // 5. 运行测试
    console.log('\n🧪 5. 运行基本测试...');
    try {
      execSync('yarn test', { stdio: 'inherit' });
      console.log('✅ 基本测试通过');
    } catch (error) {
      console.log('⚠️  测试失败，请检查环境配置');
    }

    console.log('\n🎉 项目设置完成！');
    console.log('\n📚 可用的命令:');
    console.log('  yarn demo                    # 运行演示');
    console.log('  yarn example:basic          # 基本使用示例');
    console.log('  yarn example:advanced       # 高级使用示例');
    console.log('  yarn example:aliyun-test    # 阿里云ASR测试');
    console.log('  yarn example:aliyun         # 阿里云ASR完整demo');
    console.log('  yarn build                   # 构建项目');
    console.log('  yarn dev                     # 开发模式');

    console.log('\n💡 提示:');
    console.log('  - 如果要使用阿里云ASR，请配置 examples/aliyun-config.js');
    console.log('  - 详细说明请查看 README.md 和 examples/ALIYUN-SETUP.md');

  } catch (error) {
    console.error('❌ 设置过程中出现错误:', error.message);
  }
}

// 运行设置
if (require.main === module) {
  setup();
}

module.exports = { setup }; 