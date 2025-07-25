# 发布指南 - Publish Guide

本指南将帮助你将 Windows Audio Capture 库发布到 GitHub 和 npm。

## 📋 前置要求

### 1. GitHub 账户
- 创建 GitHub 账户
- 创建新的仓库：`win-audio-capture`

### 2. npm 账户
- 注册 npm 账户：https://www.npmjs.com/signup
- 验证邮箱地址

### 3. 本地环境
- 安装 Git
- 安装 Node.js 和 npm
- 安装 yarn

## 🚀 发布步骤

### 第一步：准备 GitHub 仓库

1. **创建新仓库**
```bash
# 在 GitHub 上创建新仓库：win-audio-capture
# 不要初始化 README，因为我们已经有了
```

2. **初始化本地仓库**
```bash
# 初始化 Git 仓库
git init

# 添加远程仓库
git remote add origin https://github.com/CodeTrainerMan/win-audio-capture.git

# 添加所有文件
git add .

# 提交初始版本
git commit -m "Initial commit: Windows Audio Capture library"

# 推送到 GitHub
git push -u origin main
```

### 第二步：配置 npm

1. **登录 npm**
```bash
npm login
# 输入你的 npm 用户名、密码和邮箱
```

2. **检查 npm 配置**
```bash
npm whoami 
# 应该显示你的 npm 用户名
```

### 第三步：构建项目

1. **安装依赖**
```bash
yarn install
```

2. **构建项目**
```bash
yarn build
```

3. **测试构建结果**
```bash
# 检查 dist 目录是否存在
ls dist/
# 应该看到 index.js 文件
```

### 第四步：发布到 npm

1. **检查 package.json**
确保以下字段正确：
```json
{
  "name": "win-audio-capture",
  "version": "1.0.0",
  "description": "Windows Desktop Audio Capture JavaScript Plugin Library",
  "main": "dist/index.js",
  "publishConfig": {
    "access": "public"
  }
}
```

2. **发布到 npm**
```bash
npm publish
```

### 第五步：创建 GitHub Release

1. **创建 Git 标签**
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

2. **在 GitHub 上创建 Release**
- 访问你的仓库页面
- 点击 "Releases"
- 点击 "Create a new release"
- 选择标签 `v1.0.0`
- 填写发布说明

## 🔧 使用发布脚本

### Linux/macOS
```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

### Windows
```cmd
scripts\publish.bat
```

## 📦 npm 包信息

### 包名
```
win-audio-capture
```

### 安装命令
```bash
npm install win-audio-capture
# 或
yarn add win-audio-capture
```

### 使用示例
```javascript
const { WinAudioCapture } = require('win-audio-capture');

const audioCapture = new WinAudioCapture();
const devices = await audioCapture.getDevices();
```

## 🌐 GitHub Pages

### 启用 GitHub Pages
1. 进入仓库设置
2. 找到 "Pages" 选项
3. 选择 "Deploy from a branch"
4. 选择 `gh-pages` 分支
5. 保存设置

### 访问地址
```
https://CodeTrainerMan.github.io/win-audio-capture/
```

## 📋 发布检查清单

### 发布前检查
- [ ] 所有代码已提交
- [ ] 构建成功 (`yarn build`)
- [ ] 测试通过 (`yarn test`)
- [ ] package.json 配置正确
- [ ] README 文档完整
- [ ] LICENSE 文件存在

### 发布后检查
- [ ] npm 包可以正常安装
- [ ] GitHub 仓库可以正常访问
- [ ] GitHub Pages 正常显示
- [ ] 文档链接正常工作

## 🔄 更新版本

### 1. 更新版本号
```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. 发布新版本
```bash
npm publish
```

### 3. 创建新的 GitHub Release
```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

## 🛠️ 故障排除

### npm 发布问题
```bash
# 检查 npm 配置
npm config list

# 检查包名是否可用
npm search win-audio-capture

# 强制发布（如果包名冲突）
npm publish --access public
```

### GitHub 推送问题
```bash
# 检查远程仓库
git remote -v

# 强制推送（谨慎使用）
git push -f origin main
```

## 📞 支持

如果遇到问题：
1. 检查错误信息
2. 查看 npm 和 GitHub 文档
3. 在仓库 Issues 中提问

## 🎯 成功发布后

你的包将可以通过以下方式使用：

### npm 安装
```bash
npm install win-audio-capture
```

### GitHub 克隆
```bash
git clone https://github.com/CodeTrainerMan/win-audio-capture.git
```

### 在线文档
```
https://CodeTrainerMan.github.io/win-audio-capture/
```

---

**恭喜！你的 Windows Audio Capture 库现在已经可供全世界使用了！** 🎉 