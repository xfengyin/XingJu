# XingJu 星聚 v2.0 - 重构计划

**对标产品:** 太极聚合应用  
**目标定位:** 赛博朋克风格桌面聚合应用  
**重构方案:** Tauri + React + Rust 混合架构

---

## 📊 项目现状分析

### 当前状态

| 项目 | 状态 |
|------|------|
| **仓库** | https://github.com/xfengyin/XingJu |
| **语言** | Python (125KB) + TypeScript (37KB) |
| **功能** | 音乐/视频/小说/漫画聚合 |
| **平台** | Windows |
| **许可证** | MIT |

### 现有架构

```
XingJu/
├── .github/workflows/ci.yml
├── python/              # Python 后端
├── docs/API.md
├── package.json
└── 文档 (CODE_OPTIMIZATION, IMPLEMENTATION 等)
```

---

## 🎯 重构目标

### 功能对标太极

**太极核心功能:**
1. ✅ 多平台内容聚合 (音乐/视频/小说/漫画)
2. ✅ 统一搜索界面
3. ✅ 无缝切换源
4. ✅ 本地缓存管理
5. ✅ 播放历史记录
6. ✅ 收藏夹同步

**XingJu v2.0 增强功能:**
1. ✅ 赛博朋克 UI 风格
2. ✅ 跨平台支持 (Windows/Linux/macOS)
3. ✅ 高性能 Rust 后端
4. ✅ 实时数据同步
5. ✅ 插件系统
6. ✅ 主题自定义

---

## 🏗️ 架构设计

### 技术栈

**后端 (Rust):**
- Tauri - 桌面应用框架
- tokio - 异步运行时
- reqwest - HTTP 客户端
- serde - 序列化
- sqlx - 数据库 (SQLite)
- tokio-tungstenite - WebSocket

**前端 (TypeScript):**
- React 18 - UI 框架
- Vite - 构建工具
- Tailwind CSS - 样式
- Zustand - 状态管理
- Framer Motion - 动画
- Recharts - 图表

**UI 风格:**
- 赛博朋克主题
- 霓虹灯效果
- 玻璃态设计
- 动态粒子背景

---

## 📁 项目结构

```
XingJu v2.0/
├── src-tauri/              # Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       ├── main.rs         # 应用入口
│       ├── api/            # API 接口
│       │   ├── mod.rs
│       │   ├── music.rs    # 音乐源
│       │   ├── video.rs    # 视频源
│       │   ├── novel.rs    # 小说源
│       │   └── manga.rs    # 漫画源
│       ├── database/       # 数据库
│       │   ├── mod.rs
│       │   └── models.rs   # 数据模型
│       ├── cache/          # 缓存管理
│       │   ├── mod.rs
│       │   └── manager.rs  # 缓存管理器
│       └── utils/          # 工具函数
│
├── src/                    # React 前端
│   ├── components/
│   │   ├── Layout/         # 布局组件
│   │   │   ├── Sidebar.tsx      # 侧边栏
│   │   │   ├── Player.tsx       # 播放器
│   │   │   └── Header.tsx       # 头部
│   │   ├── Music/          # 音乐模块
│   │   ├── Video/          # 视频模块
│   │   ├── Novel/          # 小说模块
│   │   └── Manga/          # 漫画模块
│   ├── styles/
│   │   ├── cyberpunk.css   # 赛博朋克主题
│   │   └── globals.css     # 全局样式
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│   ├── icon.svg            # 应用图标
│   └── fonts/              # 字体文件
│
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎨 UI/UX 设计

### 赛博朋克风格

**配色方案:**
```css
/* 主色调 */
--neon-blue: #00f3ff;      /* 霓虹蓝 */
--neon-pink: #ff00ff;      /* 霓虹粉 */
--neon-purple: #bf00ff;    /* 霓虹紫 */
--cyber-yellow: #ffe600;   /* 赛博黄 */

/* 背景色 */
--dark-bg: #0a0a0f;        /* 深空黑 */
--panel-bg: #12121a;       /* 面板黑 */
--glass-bg: rgba(18,18,26,0.8); /* 玻璃态 */

/* 文字色 */
--text-primary: #ffffff;
--text-secondary: #a0a0b0;
```

**视觉元素:**
- 🔵 霓虹灯边框
- 🌐 网格背景
- ⚡ 电流动画
- 💎 玻璃态面板
- 🎆 粒子效果
- 🔲 科技感字体

### 界面布局

```
┌─────────────────────────────────────────────┐
│  [Logo]  [搜索框━━━━━━━━━━━━]  [用户] [设置] │ ← 顶部导航
├─────────┬───────────────────────────────────┤
│         │                                   │
│ 🎵 音乐  │                                   │
│ 🎬 视频  │     主内容区                      │
│ 📚 小说  │     (搜索结果/播放列表/详情)       │
│ 📖 漫画  │                                   │
│         │                                   │
│ ⚙️ 设置  │                                   │
├─────────┴───────────────────────────────────┤
│  [◄◄] [◄] [▶/❚❚] [►] [►►]  [00:00━━━━━━04:30] │ ← 播放器
└─────────────────────────────────────────────┘
```

---

## 📋 重构阶段

### Phase 1: 项目骨架 (1 周)
- [ ] 初始化 Tauri 项目
- [ ] 配置 Rust 后端
- [ ] 配置 React 前端
- [ ] 设计赛博朋克主题
- [ ] 创建基础组件

### Phase 2: 核心功能 (2 周)
- [ ] 音乐源接口实现
- [ ] 视频源接口实现
- [ ] 小说源接口实现
- [ ] 漫画源接口实现
- [ ] 统一搜索功能

### Phase 3: UI 组件 (2 周)
- [ ] 侧边栏导航
- [ ] 播放器组件
- [ ] 搜索结果展示
- [ ] 列表/网格视图
- [ ] 详情页组件

### Phase 4: 数据管理 (1 周)
- [ ] SQLite 数据库
- [ ] 缓存管理
- [ ] 历史记录
- [ ] 收藏夹
- [ ] 数据同步

### Phase 5: 高级功能 (1 周)
- [ ] 插件系统
- [ ] 主题自定义
- [ ] 快捷键支持
- [ ] 全局搜索
- [ ] 通知系统

### Phase 6: 优化发布 (1 周)
- [ ] 性能优化
- [ ] 测试修复
- [ ] 文档完善
- [ ] 打包发布
- [ ] GitHub Release

**总计：8 周**

---

## 🔧 核心功能实现

### 1. 音乐模块

**功能:**
- 多平台搜索 (网易云/QQ/酷狗等)
- 在线播放
- 下载管理
- 歌单管理
- 歌词显示

**API 接口:**
```rust
#[tauri::command]
async fn search_music(
    keyword: String,
    source: String,
    page: i32,
) -> Result<MusicSearchResult, String> {
    // 调用各平台 API
}

#[tauri::command]
async fn get_music_url(
    id: String,
    source: String,
    quality: String,
) -> Result<String, String> {
    // 获取播放链接
}
```

### 2. 视频模块

**功能:**
- 多平台搜索 (B 站/YouTube/优酷等)
- 在线播放
- 弹幕支持
- 下载管理
- 播放历史

### 3. 小说模块

**功能:**
- 多书源搜索
- 章节阅读
- 书签管理
- 自动翻页
- 夜间模式

### 4. 漫画模块

**功能:**
- 多平台搜索
- 章节浏览
- 下载管理
- 收藏追踪
- 更新提醒

---

## 📊 性能目标

| 指标 | v1.0 | v2.0 目标 |
|------|------|----------|
| 启动时间 | ~3s | <0.5s |
| 内存占用 | ~200MB | <80MB |
| 搜索响应 | ~2s | <0.5s |
| 播放延迟 | ~1s | <0.2s |

---

## 🎯 赛博朋克 UI 实现

### Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          pink: '#ff00ff',
          purple: '#bf00ff',
          yellow: '#ffe600',
        },
        cyber: {
          dark: '#0a0a0f',
          panel: '#12121a',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(...)',
        'neon-glow': 'radial-gradient(...)',
      }
    }
  }
}
```

### CSS 效果

```css
/* 霓虹灯边框 */
.cyber-border {
  border: 2px solid #00f3ff;
  box-shadow: 
    0 0 10px #00f3ff,
    0 0 20px #00f3ff,
    inset 0 0 10px rgba(0,243,255,0.1);
}

/* 玻璃态面板 */
.glass-panel {
  background: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* 网格背景 */
.cyber-grid {
  background-image: 
    linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* 扫描线效果 */
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    rgba(0,0,0,0.1),
    rgba(0,0,0,0.1) 1px,
    transparent 1px,
    transparent 2px
  );
}
```

---

## 📦 交付物

### 代码
- ✅ Rust 后端
- ✅ React 前端
- ✅ Tauri 配置
- ✅ 完整测试

### 文档
- ✅ README.md
- ✅ 用户手册
- ✅ 开发者指南
- ✅ API 文档

### 安装包
- ✅ Windows (.msi/.exe)
- ✅ Linux (.deb/.AppImage)
- ✅ macOS (.dmg/.app)

---

## 🔗 参考资源

- [Tauri 文档](https://tauri.app/)
- [太极 GitHub](https://github.com/taiji)
- [赛博朋克设计](https://cyberpunk-design.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

_XingJu v2.0 - 让聚合更炫酷_ ✨
