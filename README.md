# XingJu 星聚 v2.0

[![Rust](https://img.shields.io/badge/rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Tauri](https://img.shields.io/badge/tauri-2.0+-24C8DB.svg)](https://tauri.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**赛博朋克风格聚合应用** - 音乐/视频/小说/漫画 一站式体验

> 🎨 **赛博朋克 UI** | 🚀 **跨平台** | ⚡ **高性能** | 🔌 **插件系统**

---

## ✨ 特性

- 🎵 **音乐聚合** - 网易云/QQ/酷狗等多平台
- 🎬 **视频聚合** - B 站/YouTube/优酷等
- 📚 **小说聚合** - 多书源无缝切换
- 📖 **漫画聚合** - 多平台实时更新
- 🎨 **赛博朋克 UI** - 霓虹灯/玻璃态/粒子效果
- 🚀 **跨平台** - Windows/Linux/macOS
- ⚡ **高性能** - Rust 后端
- 🔌 **插件系统** - 可扩展架构

---

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 桌面框架 | Tauri v2 |
| 后端语言 | Rust |
| 状态管理 | Zustand |
| 动画 | Framer Motion |
| 样式 | Tailwind CSS |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Rust 1.70+
- Tauri CLI v2

```bash
# 1. 克隆项目
git clone https://github.com/xfengyin/XingJu.git
cd XingJu

# 2. 安装依赖
npm install

# 3. 安装 Tauri CLI
npm install -D @tauri-apps/cli@^2.0

# 4. 开发模式
npm run tauri dev

# 5. 构建发布版
npm run tauri build
```

### 构建输出

构建成功后，exe 文件位于：

```
src-tauri/target/release/XingJu.exe        # 主程序
src-tauri/target/release/bundle/msi/       # MSI 安装包
src-tauri/target/release/bundle/nsis/      # NSIS 安装包
```

---

## ⚙️ CI/CD 构建

### GitHub Actions

项目包含自动化构建 workflow (`.github/workflows/release.yml`)：

```yaml
# 触发条件
on:
  push:
    tags:
      - "v*"    # 推送 v* 标签时触发
  workflow_dispatch  # 手动触发
```

### 构建问题排查

**问题: 构建成功但没有 exe 文件**

常见原因：

1. **Tauri 版本不匹配**
   - 确保 `package.json` 中 `@tauri-apps/cli` 和 `@tauri-apps/api` 版本一致
   - 推荐使用 v2.x 版本

2. **Rust 工具链未安装**
   - Windows: 确保安装 `x86_64-pc-windows-msvc` target
   - 运行: `rustup target add x86_64-pc-windows-msvc`

3. **前端构建失败**
   - 检查 `npm run build` 是否成功
   - 查看 `dist/` 目录是否有内容

4. **查看构建日志**
   - GitHub Actions 日志中 "Find exe files" 步骤会列出找到的 exe
   - 确保路径匹配: `src-tauri/target/release/`

### 本地构建命令

```bash
# 完整构建 (Debug)
npm run tauri build

# 指定目标平台
npm run tauri build -- --target x86_64-pc-windows-msvc

# 仅构建前端
npm run build
```

---

## 📁 项目结构

```
XingJu/
├── src/                    # React 前端源码
│   ├── components/        # UI 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── stores/            # Zustand 状态
│   ├── styles/            # 样式文件
│   └── App.tsx            # 主应用
├── src-tauri/             # Tauri 后端
│   ├── src/               # Rust 源码
│   ├── Cargo.toml         # Rust 依赖
│   ├── tauri.conf.json    # Tauri 配置
│   └── icons/             # 应用图标
├── dist/                  # 前端构建输出
├── package.json           # Node 依赖
└── vite.config.ts         # Vite 配置
```

---

## 🎨 UI 设计

**配色方案:**
```
霓虹蓝：#00f3ff
霓虹粉：#ff00ff
霓虹紫：#bf00ff
深空黑：#0a0a0f
```

**视觉元素:**
- 🔵 霓虹灯边框
- 💎 玻璃态面板
- 🌐 网格背景
- ⚡ 电流动画
- 🎆 粒子效果

---

## 📋 开发进度

| Phase | 任务 | 状态 |
|------|------|------|
| Phase 1 | 项目骨架 | ✅ 完成 |
| Phase 2 | 核心功能 | 🔄 开发中 |
| Phase 3 | UI 组件 | 🔄 开发中 |
| Phase 4 | 数据管理 | 🔄 开发中 |
| Phase 5 | 高级功能 | ⏳ 待开发 |
| Phase 6 | 打包发布 | 🔄 测试中 |

---

## 🔗 链接

- GitHub: https://github.com/xfengyin/XingJu
- Tauri 文档: https://tauri.app/v1/guides/
- Rust 文档: https://doc.rust-lang.org/

---

## 📄 许可证

MIT License

---

_XingJu v2.0 - 让聚合更炫酷_ ✨