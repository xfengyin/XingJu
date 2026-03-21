# XingJu 星聚 v2.0

<div align="center">

🎵🎬📖📚 多平台聚合应用

赛博朋克风格 | Rust + Tauri + React

</div>

---

## ✨ 功能特性

- 🎵 **音乐聚合** - 多平台音乐搜索与播放
- 🎬 **视频聚合** - 多平台视频搜索与观看
- 📖 **小说阅读** - 小说搜索与阅读
- 📚 **漫画浏览** - 漫画搜索与阅读
- 🌃 **赛博朋克 UI** - 霓虹风格的视觉体验

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Rust 1.70+
- Tauri CLI v2

### 开发运行

```bash
# 安装依赖
npm install

# 开发模式
npm run tauri dev

# 构建发布
npm run tauri build
```

## 📁 项目结构

```
XingJu/
├── src/                    # React 前端
│   ├── components/         # UI 组件
│   ├── services/          # API 服务
│   ├── store/             # 状态管理
│   └── styles/            # 样式
│
├── src-tauri/             # Rust 后端
│   └── src/
│       ├── api/           # Tauri commands
│       ├── database/      # 数据库模块
│       └── lib.rs         # 入口
│
└── .github/workflows/     # CI/CD
```

## 🔧 技术栈

| 层级 | 技术 |
|-----|------|
| 前端 | React 18 + TypeScript + Vite |
| 后端 | Rust + Tauri v2 |
| 数据库 | SQLite (sqlx) |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS |

## 📦 构建产物

| 平台 | 文件 |
|------|------|
| Windows | `XingJu.exe`, NSIS/MSI 安装包 |
| Linux | AppImage, Deb 包 |
| macOS | App Bundle, DMG |

## 📄 许可证

MIT License

---

<div align="center">
Made with ❤️ by xfengyin
</div>