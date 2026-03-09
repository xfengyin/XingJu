# XingJu (星聚) - 多元内容聚合工具

<div align="center">

![Version](https://img.shields.io/badge/version-v2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

**一站式多媒体内容聚合与管理平台**

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [安装指南](#-安装指南) • [文档](#-文档) • [贡献](#-贡献)

</div>

## 🌟 功能特性

- 🎵 **音乐聚合** - 支持多平台音乐源，智能推荐
- 📺 **视频聚合** - 聚合主流视频平台，一键下载
- 📚 **小说/漫画** - 在线阅读，自动更新
- 🔍 **智能搜索** - 跨平台内容检索
- 📥 **批量下载** - 支持批量下载，断点续传
- 🎨 **跨平台** - Windows / macOS / Linux 全平台支持

## 🚀 快速开始

### 前置要求

- Node.js >= 20.0
- Python >= 3.11
- npm >= 9.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/xfengyin/XingJu.git
cd XingJu

# 安装依赖
npm install
pip install -r backend/requirements.txt

# 启动开发服务器
npm run dev
```

### Docker 部署

```bash
# 拉取镜像
docker pull xfengyin/xingju:latest

# 运行容器
docker run -d -p 3000:3000 xfengyin/xingju
```

## 📖 文档

- [安装指南](./docs/INSTALL.md)
- [API 文档](./docs/API.md)
- [配置说明](./docs/CONFIG.md)
- [常见问题](./docs/FAQ.md)
- [贡献指南](./CONTRIBUTING.md)

## 🛠️ 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **UI 库**: Naive UI
- **构建工具**: Vite
- **桌面端**: Electron

### 后端
- **框架**: Python FastAPI
- **爬虫**: requests + BeautifulSoup
- **数据库**: SQLite

## 📁 项目结构

```
XingJu/
├── frontend/          # Vue3 前端
│   ├── src/
│   └── package.json
├── backend/           # Python 后端
│   ├── api/
│   ├── crawler/
│   └── requirements.txt
├── electron/          # Electron 桌面端
└── docs/             # 文档
```

## 🔧 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm run test
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 💬 社区

- [GitHub Discussions](https://github.com/xfengyin/XingJu/discussions)
- [问题反馈](https://github.com/xfengyin/XingJu/issues)
- [更新日志](CHANGELOG.md)

## ⭐ Star History

如果这个项目对你有帮助，请给个 Star 支持！

## 📧 联系方式

- 作者: 张可
- Email: dev@xingju.app
- GitHub: [@xfengyin](https://github.com/xfengyin)

---

<div align="center">
  <sub>用 ❤️ 构建</sub>
</div>