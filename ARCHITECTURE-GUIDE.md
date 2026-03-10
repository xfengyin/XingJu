# XingJu 星聚 v2.0 - 整体架构设计指南

**对标产品:** 太极 (TaiChi) - 应用虚拟化 + 模块管理  
**重构目标:** 赛博朋克风格聚合应用  
**架构方案:** Rust 容器化 + PyO3 + Electron

---

## 🏗️ 整体架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    XingJu v2.0                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Electron 前端 (赛博朋克 UI)              │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐   │   │
│  │  │  音乐模块 │  视频模块 │  小说模块 │  漫画模块 │   │   │
│  │  └──────────┴──────────┴──────────┴──────────┘   │   │
│  │                                                   │   │
│  │  状态管理：Zustand | 动画：Framer Motion         │   │
│  │  样式：Tailwind CSS (赛博朋克主题)                │   │
│  └──────────────────────────────────────────────────┘   │
│                           ↕ IPC                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PyO3 桥接层                          │   │
│  │     Python ↔ Rust 双向通信                        │   │
│  └──────────────────────────────────────────────────┘   │
│                           ↕                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Rust 容器化核心                       │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐   │   │
│  │  │ 音乐容器 │ 视频容器 │ 小说容器 │ 漫画容器 │   │   │
│  │  │ (Sandbox)│ (Sandbox)│ (Sandbox)│ (Sandbox)│   │   │
│  │  └──────────┴──────────┴──────────┴──────────┘   │   │
│  │                                                   │   │
│  │  容器管理 | 资源隔离 | 安全沙箱 | 模块热加载       │   │
│  └──────────────────────────────────────────────────┘   │
│                           ↕                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              数据持久化层                          │   │
│  │     SQLite (sqlx) + Redis (缓存)                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 核心设计理念

### 1. 应用虚拟化 (对标太极)

**太极核心特性:**
- ✅ 应用免安装直接运行
- ✅ 模块热插拔
- ✅ 沙箱隔离
- ✅ 资源动态加载

**XingJu 实现方案:**
```rust
// 容器化模块管理
pub struct ModuleContainer {
    id: String,
    name: String,
    sandbox: Sandbox,
    resources: ResourceManager,
    lifecycle: LifecycleManager,
}

// 模块热加载
impl ModuleContainer {
    pub fn load_module(&mut self, module_path: &str) -> Result<()> {
        // 1. 加载模块配置
        // 2. 创建沙箱环境
        // 3. 初始化资源
        // 4. 启动模块
    }
    
    pub fn unload_module(&mut self, module_id: &str) -> Result<()> {
        // 1. 停止模块
        // 2. 释放资源
        // 3. 清理沙箱
    }
}
```

### 2. 赛博朋克 UI 设计

**设计原则:**
- 🎨 **霓虹美学** - 高饱和度霓虹色
- 💎 **玻璃态** - 毛玻璃模糊效果
- ⚡ **科技感** - 电流动画/故障效果
- 🌐 **未来感** - 网格背景/全息效果

**配色方案:**
```css
:root {
  /* 霓虹主色 */
  --neon-blue: #00f3ff;
  --neon-pink: #ff00ff;
  --neon-purple: #bf00ff;
  --cyber-yellow: #ffe600;
  
  /* 背景色 */
  --dark-bg: #0a0a0f;
  --panel-bg: #12121a;
  
  /* 效果 */
  --neon-glow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue);
}
```

### 3. Rust 容器化

**容器特性:**
- 🔒 **安全沙箱** - 限制文件系统/网络访问
- 📦 **资源隔离** - 独立内存/CPU 配额
- 🔌 **热插拔** - 动态加载/卸载模块
- 📊 **性能监控** - 实时资源使用统计

**实现架构:**
```rust
pub struct Sandbox {
    // 文件系统隔离
    fs_namespace: FsNamespace,
    
    // 网络隔离
    net_namespace: NetNamespace,
    
    // 资源限制
    cgroups: Cgroups,
    
    // 安全策略
    seccomp: SeccompProfile,
}
```

---

## 📋 各子任务架构指导

### 子任务 1: 架构设计 - 应用虚拟化方案

**核心职责:**
1. 设计容器化架构
2. 定义模块接口规范
3. 实现沙箱隔离机制

**关键接口:**
```rust
// 模块 trait
pub trait Module: Send + Sync {
    fn id(&self) -> &str;
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    
    // 生命周期
    fn init(&mut self) -> Result<()>;
    fn start(&mut self) -> Result<()>;
    fn stop(&mut self) -> Result<()>;
    fn cleanup(&mut self) -> Result<()>;
    
    // 资源管理
    fn get_resources(&self) -> ResourceUsage;
}

// 容器管理器
pub struct ContainerManager {
    containers: HashMap<String, ModuleContainer>,
    event_bus: EventBus,
}
```

**交付物:**
- [ ] 架构设计文档
- [ ] 模块接口定义
- [ ] 沙箱实现原型

---

### 子任务 2: 核心开发 - Rust 容器化 + PyO3

**核心职责:**
1. 实现 Rust 容器核心
2. PyO3 Python 绑定
3. 多平台 API 集成

**关键实现:**
```rust
// PyO3 绑定
#[pyclass]
pub struct PyModuleContainer {
    inner: ModuleContainer,
}

#[pymethods]
impl PyModuleContainer {
    #[new]
    fn new(module_id: &str) -> Self {
        Self {
            inner: ModuleContainer::new(module_id),
        }
    }
    
    fn load(&mut self, path: &str) -> PyResult<()> {
        self.inner.load_module(path)
            .map_err(|e| PyErr::new::<pyo3::exceptions::PyRuntimeError, _>(
                format!("Failed to load module: {}", e)
            ))
    }
    
    fn execute(&mut self, action: &str, params: &str) -> PyResult<String> {
        // 执行模块动作
    }
}
```

**API 集成:**
```rust
// 音乐源 API
pub async fn search_music(
    keyword: &str,
    source: &str,
) -> Result<MusicSearchResult> {
    match source {
        "netease" => netease::search(keyword).await,
        "qq" => qq_music::search(keyword).await,
        "kugou" => kugou::search(keyword).await,
        _ => Err(Error::UnknownSource),
    }
}
```

**交付物:**
- [ ] Rust 容器核心
- [ ] PyO3 绑定
- [ ] 音乐/视频/小说/漫画 API

---

### 子任务 3: UI 开发 - 赛博朋克 Electron 前端

**核心职责:**
1. 实现赛博朋克主题
2. 开发 4 大模块 UI
3. IPC 通信层

**组件架构:**
```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx      # 侧边栏导航
│   │   ├── Header.tsx       # 头部搜索
│   │   └── Player.tsx       # 播放器
│   ├── Music/
│   │   ├── MusicList.tsx    # 音乐列表
│   │   ├── MusicPlayer.tsx  # 播放器
│   │   └── SearchPanel.tsx  # 搜索面板
│   ├── Video/
│   ├── Novel/
│   └── Manga/
├── styles/
│   ├── cyberpunk.css        # 赛博朋克主题
│   └── globals.css
└── store/
    └── index.ts             # Zustand 状态管理
```

**赛博朋克效果实现:**
```tsx
// 霓虹灯按钮
const CyberButton = ({ children, onClick }) => (
  <button 
    className="cyber-button"
    onClick={onClick}
  >
    {children}
    <style jsx>{`
      .cyber-button {
        background: linear-gradient(135deg, #00f3ff, #bf00ff);
        border: 2px solid #00f3ff;
        box-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
        animation: pulse-neon 2s infinite;
      }
    `}</style>
  </button>
)
```

**交付物:**
- [ ] 赛博朋克主题系统
- [ ] 4 大模块 UI 组件
- [ ] IPC 通信层

---

### 子任务 4: 平台打包 - CI/CD + 多平台构建

**核心职责:**
1. GitHub Actions 工作流
2. 多平台打包配置
3. 自动发布流程

**工作流设计:**
```yaml
name: Build & Release

on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run tauri build
      - uses: actions/upload-artifact@v4
        with:
          name: windows-build
          path: target/release/bundle/

  build-linux:
    runs-on: ubuntu-22.04
    # ... 类似配置

  build-macos:
    runs-on: macos-latest
    # ... 类似配置

  create-release:
    needs: [build-windows, build-linux, build-macos]
    runs-on: ubuntu-22.04
    steps:
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            *.exe
            *.deb
            *.dmg
```

**交付物:**
- [ ] CI/CD 工作流
- [ ] 多平台安装包
- [ ] 自动发布流程

---

## 📊 开发进度追踪

| 子任务 | 负责人 | 状态 | 进度 | 预计完成 |
|--------|--------|------|------|----------|
| 架构设计 | Dev-Planner | ⚡ 执行中 | 20% | 2026-03-11 |
| 核心开发 | Dev-Coder | ⚡ 执行中 | 15% | 2026-03-13 |
| UI 开发 | Dev-Coder | ⚡ 执行中 | 25% | 2026-03-12 |
| 平台打包 | Dev-Coder | ⚡ 执行中 | 10% | 2026-03-14 |

**总进度:** 17.5%

---

## 🎯 关键里程碑

### M1: 项目骨架 (已完成 ✅)
- 时间：2026-03-10
- 交付：项目配置 + 赛博朋克 UI 框架

### M2: 核心功能 (进行中 ⚡)
- 时间：2026-03-11 ~ 2026-03-13
- 交付：Rust 容器 + PyO3 + API 集成

### M3: UI 完成 (计划中 📋)
- 时间：2026-03-12 ~ 2026-03-14
- 交付：4 大模块完整 UI

### M4: 打包发布 (计划中 📋)
- 时间：2026-03-14 ~ 2026-03-15
- 交付：多平台安装包 + GitHub Release

---

## 🔧 技术栈总览

| 层级 | 技术 | 用途 |
|------|------|------|
| **前端** | Electron + React | UI 框架 |
| **样式** | Tailwind CSS | 赛博朋克主题 |
| **状态** | Zustand | 状态管理 |
| **动画** | Framer Motion | 动效 |
| **后端** | Rust | 容器化核心 |
| **桥接** | PyO3 | Python 绑定 |
| **数据库** | SQLite + sqlx | 数据持久化 |
| **缓存** | Redis | 缓存管理 |
| **打包** | Tauri | 桌面应用打包 |

---

## 📞 协调机制

### 每日站会
- **时间:** 每天 09:00 UTC
- **内容:** 进度同步 + 问题讨论
- **参与:** 所有子 Agent

### 代码审查
- **频率:** 每次提交前
- **标准:** Rust clippy + ESLint
- **工具:** GitHub PR

### 文档更新
- **要求:** 功能完成即更新文档
- **位置:** `docs/` 目录
- **格式:** Markdown

---

## 🚀 下一步行动

### 立即执行 (各子任务)

1. **架构设计组:**
   - 完成容器化架构详细设计
   - 定义模块接口规范
   - 输出架构文档

2. **核心开发组:**
   - 实现 Rust 容器原型
   - 集成 PyO3 绑定
   - 开发音乐源 API

3. **UI 开发组:**
   - 完善赛博朋克主题
   - 开发音乐模块 UI
   - 实现 IPC 通信

4. **平台打包组:**
   - 配置 GitHub Actions
   - 测试多平台构建
   - 准备 Release 流程

---

**XingJu 星聚 v2.0 - 让聚合更炫酷!** ✨

_架构设计指导 v1.0 | 2026-03-10_
