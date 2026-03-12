# XingJu v2.0 - 构建与发布指南

## 📦 构建版本

**版本号:** 2.0.0  
**构建日期:** 2026-03-12  
**提交哈希:** f43911c  
**构建类型:** Web + Tauri 多平台

---

## ✅ 构建状态

| 平台 | 类型 | 状态 | 文件 |
|------|------|------|------|
| **Web** | 生产构建 | ✅ 成功 | `dist/` |
| **Web** | 压缩包 | ✅ 成功 | `xingju-v2.0.0-web.tar.gz` |
| **Windows** | MSI/NSIS | ⚠️ 需 Rust | - |
| **macOS** | DMG/App | ⚠️ 需 Rust | - |
| **Linux** | DEB/AppImage | ⚠️ 需 Rust | - |

---

## 🚀 本地构建步骤

### 前置要求

#### Web 版本
```bash
Node.js >= 18.x
npm >= 9.x
```

#### Tauri 桌面版本
```bash
# Rust (必需)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Windows
# - Visual Studio C++ Build Tools
# - WebView2

# macOS
# - Xcode Command Line Tools

# Linux
sudo apt update
sudo apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### 构建命令

```bash
cd XingJu-v2

# 安装依赖
npm install

# 构建 Web 版本
npm run build

# 构建 Tauri 桌面应用
npm run tauri build
```

### 构建产物位置

```
XingJu-v2/
├── dist/                          # Web 生产版本
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
├── src-tauri/target/release/      # Tauri 构建产物
│   ├── XingJu                     # Linux 可执行文件
│   ├── XingJu.exe                 # Windows 可执行文件
│   ├── XingJu.app                 # macOS App
│   ├── bundle/
│   │   ├── deb/                   # Debian 安装包
│   │   ├── msi/                   # Windows MSI
│   │   ├── dmg/                   # macOS DMG
│   │   └── appimage/              # Linux AppImage
```

---

## 📊 构建统计

### Web 版本

| 文件 | 大小 | Gzip |
|------|------|------|
| index.html | 0.57 kB | 0.41 kB |
| index.css | 10.56 kB | 2.76 kB |
| index.js | 188.28 kB | 56.58 kB |
| **总计** | **199.41 kB** | **59.75 kB** |

### 性能指标

- ✅ 构建时间：1.31s
- ✅ 包大小：< 200KB (优秀)
- ✅ Gzip 压缩率：70%
- ✅ 模块数：54

---

## 🎯 构建验证清单

### Web 版本测试

```bash
# 1. 本地预览
npm run preview

# 2. 访问 http://localhost:4173

# 3. 验证项目
- [ ] 页面正常加载
- [ ] 样式正确渲染
- [ ] 动画流畅
- [ ] 模块切换正常
- [ ] 控制台无错误
```

### Tauri 版本测试

```bash
# 1. 开发模式测试
npm run tauri dev

# 2. 验证项目
- [ ] 应用正常启动
- [ ] 窗口大小正确
- [ ] 所有功能正常
- [ ] 无控制台错误
- [ ] 系统托盘正常 (如配置)
```

---

## 📝 发布到 GitHub

### 创建 Release

1. **访问:** https://github.com/xfengyin/XingJu/releases/new

2. **Tag version:** `v2.0.0`

3. **Release title:** `XingJu v2.0.0 - 前端界面重新设计`

4. **描述:**
```markdown
## ✨ 新特性

- 🎨 全新设计系统 - 高级赛博朋克风格
- 🌟 玻璃态面板 + 渐变文字 + 霓虹边框
- 🎬 流畅动画系统 - 6 种核心动画
- 📱 响应式布局 - 适配桌面/平板/移动
- 🎵 音乐模块 - 多平台聚合
- 🎬 视频模块 - 精选推荐 + 分类筛选
- 📚 小说模块 - 海量资源
- 📖 漫画模块 - 实时更新

## 📦 安装包

- Web 版本：`xingju-v2.0.0-web.tar.gz`
- Windows: `XingJu_2.0.0_x64.msi`
- macOS: `XingJu_2.0.0_x64.dmg`
- Linux: `xingju_2.0.0_amd64.deb`

## 🚀 快速开始

### Web 版本
```bash
tar -xzf xingju-v2.0.0-web.tar.gz
# 使用任意 HTTP 服务器托管 dist/ 目录
```

### 桌面版本
直接下载对应平台的安装包运行

## 📋 测试报告

详见：TEST-PLAN.md

## 🔗 链接

- 设计文档：DESIGN-REDESIGN.md
- 测试计划：TEST-PLAN.md
- 快速测试：QUICK-TEST.md
```

5. **上传文件:**
   - [ ] `xingju-v2.0.0-web.tar.gz`
   - [ ] `XingJu_2.0.0_x64.msi` (Windows)
   - [ ] `XingJu_2.0.0_x64.dmg` (macOS)
   - [ ] `xingju_2.0.0_amd64.deb` (Linux)
   - [ ] `XingJu_2.0.0_x86_64.AppImage` (Linux)

6. **发布:** 点击 "Publish release"

---

## 🐛 常见问题

### 问题 1: Rust 安装失败

**解决:**
```bash
# 使用国内镜像
export RUSTUP_DIST_SERVER=https://rsproxy.cn
export RUSTUP_UPDATE_ROOT=https://rsproxy.cn/rustup
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh
```

### 问题 2: Tauri 构建失败 - WebKit 依赖

**Linux 解决:**
```bash
sudo apt install libwebkit2gtk-4.0-dev
```

### 问题 3: Windows 构建失败

**解决:**
- 安装 Visual Studio 2022
- 安装 "C++ 桌面开发" 工作负载
- 安装 WebView2

### 问题 4: macOS 签名问题

**解决:**
```bash
# 开发版本可以跳过签名
# 生产版本需要 Apple Developer 证书
```

---

## 📈 构建优化建议

### 包大小优化

1. **代码分割** - 路由懒加载
2. **图片优化** - WebP 格式
3. **Tree Shaking** - 移除未使用代码
4. **压缩** - Brotli 替代 Gzip

### 构建速度优化

1. **缓存** - 启用 npm/cargo 缓存
2. **并行** - 多进程构建
3. **增量** - 仅构建变更部分

---

## 🔐 签名与公证

### Windows

```powershell
# 使用 SignTool 签名
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com XingJu.exe
```

### macOS

```bash
# 代码签名
codesign --deep --force --verify --verbose \
  --sign "Developer ID Application: Your Name" \
  XingJu.app

# 公证
xcrun notarytool submit XingJu.app --apple-id "your@apple.id" --password "app-password" --team-id "TEAM_ID"
```

### Linux

```bash
# DEB 包签名 (可选)
dpkg-sig --sign builder xingju_2.0.0_amd64.deb
```

---

## 📋 发布后检查

- [ ] GitHub Release 创建成功
- [ ] 所有安装包上传完成
- [ ] 下载链接有效
- [ ] README.md 更新版本号
- [ ] 更新日志编写完成
- [ ] 通知团队成员

---

_构建指南版本：v2.0_  
_最后更新：2026-03-12_
