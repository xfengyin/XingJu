# 星聚 (XingJu) - Windows版多元内容聚合工具

> 🌟 一站式聚合音乐、视频、小说、漫画的Windows桌面应用

## 📋 项目信息

- **项目名称**: 星聚 (XingJu)
- **版本**: v1.0.0
- **平台**: Windows 10/11
- **技术栈**: Electron 25+ + Vue3 + TypeScript + Node.js 16+ + Python 3.9+ + SQLite 3+

## 🎯 核心功能

### 内容聚合
- 🎵 **音乐聚合** - 多平台音乐搜索、在线播放、本地缓存
- 🎬 **视频聚合** - 视频源整合、在线观看、下载管理
- 📚 **小说聚合** - 多源小说搜索、在线阅读、书架管理
- 🎨 **漫画聚合** - 漫画源整合、图片预加载、阅读记录

### 系统功能
- 🔍 **全局检索** - 跨内容类型统一搜索
- 💾 **本地缓存** - 智能缓存管理、离线访问
- 🔔 **系统托盘** - 常驻后台、快捷操作
- ⚙️ **个性化设置** - 主题、快捷键、下载路径
- 🔒 **合规安全** - 内容过滤、版权提示、安全更新

## 🏗️ 项目架构

```
XingJu/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 入口文件
│   │   ├── window.ts      # 窗口管理
│   │   ├── tray.ts        # 系统托盘
│   │   ├── menu.ts        # 应用菜单
│   │   └── ipc/           # IPC通信处理
│   ├── renderer/          # Vue3 渲染进程
│   │   ├── components/    # 公共组件
│   │   ├── views/         # 页面视图
│   │   ├── stores/        # Pinia状态管理
│   │   ├── api/           # API接口封装
│   │   └── utils/         # 工具函数
│   ├── python/            # Python后端服务
│   │   ├── api/           # API路由
│   │   ├── crawlers/      # 爬虫模块
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   └── assets/            # 静态资源
├── docs/                  # 项目文档
├── tests/                 # 测试文件
├── scripts/               # 构建脚本
└── .github/workflows/     # CI/CD配置
```

## 🚀 快速开始

### 环境要求
- Windows 10/11
- Node.js 16+
- Python 3.9+
- SQLite 3+

### 安装依赖
```bash
# 安装 Node.js 依赖
npm install

# 安装 Python 依赖
pip install -r requirements.txt
```

### 开发模式
```bash
# 启动开发服务器
npm run dev

# 启动 Python 服务
python src/python/main.py
```

### 构建打包
```bash
# Windows 打包
npm run build:win

# 便携版
npm run build:win:portable
```

## 👥 开发团队

| 角色 | 职责 | 成员 |
|------|------|------|
| 技术总监 | 架构设计、代码审查 | TD-01 |
| 前端开发 ×2 | Electron + Vue3 开发 | FE-01, FE-02 |
| 后端开发 ×2 | Python + 爬虫开发 | BE-01, BE-02 |
| 测试工程师 | 测试与质量保障 | QA-01 |
| DevOps工程师 | CI/CD与发布 | DO-01 |

## 📄 许可证

MIT License
