# 🚀 快速发布指南 - Quick Publish Guide

## 📋 你的项目信息

- **GitHub 用户名**: CodeTrainerMan
- **仓库名称**: win-audio-capture
- **npm 包名**: win-audio-capture

## 🎯 发布地址

### GitHub
```
https://github.com/CodeTrainerMan/win-audio-capture
```

### npm
```
https://www.npmjs.com/package/win-audio-capture
```

### GitHub Pages
```
https://CodeTrainerMan.github.io/win-audio-capture/
```

## ⚡ 快速发布步骤

### 1. 创建 GitHub 仓库
1. 访问: https://github.com/new
2. 仓库名: `win-audio-capture`
3. 描述: `Windows Desktop Audio Capture JavaScript Plugin Library`
4. 选择: Public
5. **不要** 勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 上传到 GitHub
```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/CodeTrainerMan/win-audio-capture.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Windows Audio Capture library"

# 推送到 GitHub
git push -u origin main
```

### 3. 发布到 npm
```bash
# 登录 npm（如果没有账户，先注册）
npm login

# 发布包
npm publish
```

### 4. 启用 GitHub Pages
1. 进入仓库设置: Settings
2. 找到 "Pages" 选项
3. Source 选择: "Deploy from a branch"
4. Branch 选择: `gh-pages`
5. 保存设置

## ✅ 发布检查清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] npm 账户已登录
- [ ] 包已发布到 npm
- [ ] GitHub Pages 已启用

## 🎉 发布完成！

发布后，任何人都可以通过以下方式使用你的库：

### 安装
```bash
npm install win-audio-capture
# 或
yarn add win-audio-capture
```

### 使用
```javascript
const { WinAudioCapture } = require('win-audio-capture');

const audioCapture = new WinAudioCapture();
const devices = await audioCapture.getDevices();
```

> **注意**: 此包直接包含源代码，用户可以在 `src/` 目录中查看和修改代码。

## 🚀 GitHub Actions 自动发布

### 设置自动发布
1. 按照 `GITHUB_ACTIONS_SETUP.md` 指南设置
2. 配置 npm token 到 GitHub secrets
3. 推送代码即可自动发布

### 版本管理
```bash
# 更新版本
yarn version:patch  # 1.0.0 -> 1.0.1
yarn version:minor  # 1.0.0 -> 1.1.0
yarn version:major  # 1.0.0 -> 2.0.0

# 推送触发自动发布
git add .
git commit -m "Bump version"
git push origin main
```

## 📞 支持

- **GitHub Issues**: https://github.com/CodeTrainerMan/win-audio-capture/issues
- **GitHub Discussions**: https://github.com/CodeTrainerMan/win-audio-capture/discussions
- **npm 页面**: https://www.npmjs.com/package/win-audio-capture
- **GitHub Actions**: https://github.com/CodeTrainerMan/win-audio-capture/actions

---

**恭喜！你的 Windows Audio Capture 库现在已经完全自动化了！** 🎉 