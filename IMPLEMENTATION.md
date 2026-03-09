# XingJu Electron 功能实现报告

## 已实现功能

### 1. IPC 处理完善 ✅

#### 1.1 Python 后端调用
- **文件**: `src/main/ipc/content.ts`
- **功能**:
  - 实现了 `callPythonBackend()` 函数，支持调用 Python 搜索脚本
  - 支持音乐、视频、小说、漫画四种内容类型搜索
  - 通过 `child_process.spawn` 启动 Python 进程
  - 支持超时控制（默认 30 秒）

#### 1.2 错误处理和重试逻辑
- **文件**: `src/main/ipc/content.ts`
- **功能**:
  - 实现了 `withRetry()` 通用重试函数
  - 最大重试次数：3 次
  - 指数退避策略（1s, 2s, 3s）
  - 详细的错误日志记录

#### 1.3 进度通知
- **文件**: `src/main/ipc/download.ts`
- **功能**:
  - 下载进度实时更新
  - 速度计算（字节/秒）
  - 预计剩余时间（ETA）计算
  - 通过 IPC 向渲染进程发送进度事件

### 2. 下载管理 ✅

#### 2.1 多线程下载实现
- **文件**: `python/downloader.py`
- **功能**:
  - Python 多线程下载器
  - 可配置线程数（默认 4 线程）
  - 自动分片计算
  - 支持 HTTP Range 请求

#### 2.2 断点续传
- **文件**: `src/main/ipc/download.ts`, `python/downloader.py`
- **功能**:
  - 检测已下载部分
  - 从断点处继续下载
  - 临时文件管理（.tmp 后缀）
  - 下载完成后重命名

#### 2.3 下载进度跟踪
- **文件**: `src/main/ipc/download.ts`
- **功能**:
  - 实时进度百分比
  - 下载速度监控
  - 已下载大小/总大小
  - 预计完成时间

#### 2.4 下载管理器类
- **文件**: `src/main/ipc/download.ts`
- **类**: `DownloadManager`
- **功能**:
  - 并发控制（最大同时下载数）
  - 任务队列管理
  - 下载控制器映射
  - 任务状态管理

### 3. 设置管理 ✅

#### 3.1 主题切换
- **文件**: `src/main/utils/store.ts`
- **功能**:
  - 支持三种主题：light, dark, system
  - 持久化存储
  - 实时应用

#### 3.2 下载路径配置
- **文件**: `src/main/ipc/download.ts`
- **功能**:
  - 自定义下载目录
  - 自动创建子目录（按内容类型）
  - 默认使用系统下载文件夹

#### 3.3 快捷键设置
- **文件**: `src/main/utils/store.ts`, `src/main/index.ts`
- **功能**:
  - 可配置快捷键：
    - `CommandOrControl+Shift+X`: 显示/隐藏窗口
    - `CommandOrControl+Shift+M`: 最小化到托盘
    - `CommandOrControl+Shift+D`: 快速下载
  - 全局快捷键注册
  - 设置持久化

#### 3.4 其他设置
- **并发下载数**: `maxConcurrentDownloads`（默认 3）
- **搜索提供商**: 按内容类型配置
- **自动更新**: `autoUpdate`
- **开机自启动**: `startOnBoot`
- **最小化到托盘**: `minimizeToTray`

### 4. 窗口管理 ✅

#### 4.1 窗口状态保存
- **文件**: `src/main/index.ts`
- **功能**:
  - 保存窗口位置和大小
  - 保存最大化状态
  - 存储到 `window-state.json`
  - 启动时自动恢复

#### 4.2 最小化到托盘
- **文件**: `src/main/index.ts`
- **功能**:
  - 点击关闭按钮时最小化到托盘
  - 托盘图标显示
  - 托盘菜单：显示主窗口、退出
  - 点击托盘图标切换窗口显示

#### 4.3 开机自启动
- **文件**: `src/main/index.ts`, `src/main/ipc/settings.ts`
- **功能**:
  - 使用 `app.setLoginItemSettings()`
  - 可配置是否启用
  - 启动时隐藏窗口

#### 4.4 其他窗口功能
- **单实例锁定**: 防止多开
- **第二个实例处理**: 聚焦到已有窗口
- **透明无边框窗口**: 自定义 UI
- **开发模式**: 自动打开 DevTools

### 5. Python 后端 ✅

#### 5.1 搜索脚本
- **文件**: `python/search.py`
- **功能**:
  - 音乐搜索（网易云音乐）
  - 视频搜索（B 站）
  - 小说搜索（起点）
  - 漫画搜索（B 站漫画）
  - JSON 格式输出

#### 5.2 下载脚本
- **文件**: `python/downloader.py`
- **功能**:
  - 多线程下载
  - 断点续传
  - 进度回调
  - 错误处理

### 6. 新增 IPC 接口

#### 内容搜索
```typescript
'search-music'    - 搜索音乐
'search-video'    - 搜索视频
'search-novel'    - 搜索小说
'search-manga'    - 搜索漫画
```

#### 设置管理
```typescript
'get-settings'    - 获取所有设置
'update-settings' - 更新设置
'reset-settings'  - 重置为默认值
'get-setting'     - 获取单个设置项
'set-setting'     - 设置单个设置项
```

#### 下载管理
```typescript
'start-download'        - 开始下载
'pause-download'        - 暂停下载
'resume-download'       - 恢复下载
'cancel-download'       - 取消下载
'get-download-progress' - 获取下载进度
```

#### 窗口控制
```typescript
'window-minimize'   - 最小化窗口
'window-maximize'   - 最大化/还原窗口
'window-close'      - 关闭窗口
'get-window-state'  - 获取窗口状态
```

## 技术栈

### Electron 主进程
- **语言**: TypeScript
- **核心模块**:
  - `electron` - 主框架
  - `electron-store` - 设置存储
  - `child_process` - Python 进程调用
  - `fs` - 文件系统操作
  - `path` - 路径处理

### Python 后端
- **版本**: Python 3.8+
- **依赖**:
  - `requests` - HTTP 请求
  - `beautifulsoup4` - HTML 解析
  - `lxml` - XML/HTML 解析器

## 使用方法

### 安装依赖

```bash
# Node.js 依赖
cd /home/node/.openclaw/workspace/projects/XingJu
npm install

# Python 依赖
cd python
pip install -r requirements.txt
```

### 启用 Python 后端

```bash
export ENABLE_PYTHON_BACKEND=true
npm run dev
```

### 构建

```bash
# 开发构建
npm run build

# Windows 安装包
npm run build:win

# Windows 便携版
npm run build:win:portable
```

## 文件结构

```
XingJu/
├── src/
│   └── main/
│       ├── index.ts           # 主进程入口
│       ├── ipc/
│       │   ├── index.ts       # IPC 处理器注册
│       │   ├── content.ts     # 内容搜索
│       │   ├── settings.ts    # 设置管理
│       │   └── download.ts    # 下载管理
│       └── utils/
│           └── store.ts       # 存储工具
├── python/
│   ├── search.py             # 搜索脚本
│   ├── downloader.py         # 下载脚本
│   └── requirements.txt      # Python 依赖
├── package.json
└── tsconfig.json
```

## 注意事项

1. **Python 环境**: 需要安装 Python 3.8+ 并配置到 PATH
2. **yt-dlp**: 视频下载需要安装 yt-dlp（可选）
3. **API 限制**: 部分平台 API 可能有访问限制
4. **跨域问题**: Python 后端避免了 Electron 渲染进程的跨域限制
5. **安全性**: 生产环境需要验证 Python 脚本路径和参数

## 后续优化建议

1. **搜索增强**:
   - 添加更多数据源
   - 实现搜索结果缓存
   - 支持高级搜索语法

2. **下载优化**:
   - 实现下载队列优先级
   - 添加下载限速功能
   - 支持批量下载

3. **设置增强**:
   - 添加设置导入/导出
   - 支持设置同步
   - 添加更多自定义选项

4. **性能优化**:
   - 使用 Worker 线程处理下载
   - 实现搜索结果分页
   - 优化内存使用

## 总结

已完成所有核心功能的实现：
- ✅ IPC 处理（Python 调用、错误处理、进度通知）
- ✅ 下载管理（多线程、断点续传、进度跟踪）
- ✅ 设置管理（主题、路径、快捷键）
- ✅ 窗口管理（状态保存、托盘、自启动）

代码采用 TypeScript 编写，类型安全，结构清晰，易于维护和扩展。
