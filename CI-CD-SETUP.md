# XingJu v2.0 - CI/CD 自动构建配置指南

## 📋 配置概览

**目标:** 使用 GitHub Actions 自动构建多平台安装包并发布到 GitHub Releases

**支持平台:**
- ✅ Windows (MSI + NSIS)
- ✅ Linux (DEB + AppImage)
- ✅ macOS Intel (DMG)
- ✅ macOS ARM/Apple Silicon (DMG)

---

## 🚀 自动触发条件

### 1. Tag 推送 (主要方式)
```bash
# 推送新标签时自动触发
git tag -a v2.0.0 -m "Release v2.0.0"
git push origin v2.0.0
```

### 2. 手动触发
访问：https://github.com/xfengyin/XingJu/actions/workflows/build-release.yml  
点击 "Run workflow"

---

## ⚙️ 工作流程详解

### 构建流程

```
1. Checkout 代码
   ↓
2. 安装 Rust (指定版本)
   ↓
3. 安装 Node.js (带缓存)
   ↓
4. 安装依赖 (npm ci)
   ↓
5. 安装系统依赖 (Linux)
   ↓
6. 构建 Tauri 应用
   ↓
7. 上传构建产物 (Artifacts)
   ↓
8. 创建 GitHub Release (所有平台完成后)
```

### 构建矩阵

| 平台 | Runner | Rust | Node.js | 产物 |
|------|--------|------|---------|------|
| **Windows** | windows-latest | 1.85 | 20 | MSI + NSIS |
| **Linux** | ubuntu-22.04 | 1.85 | 20 | DEB + AppImage |
| **macOS Intel** | macos-13 | 1.85 | 20 | DMG |
| **macOS ARM** | macos-latest | 1.85 | 20 | DMG |

---

## 📦 构建产物

### Windows
- `XingJu_2.0.0_x64.msi` - Windows 安装包
- `XingJu_2.0.0_x64-setup.exe` - NSIS 安装程序

### Linux
- `xingju_2.0.0_amd64.deb` - Debian/Ubuntu 安装包
- `XingJu_2.0.0_x86_64.AppImage` - 通用 AppImage

### macOS
- `XingJu_2.0.0_x64.dmg` - Intel Mac
- `XingJu_2.0.0_aarch64.dmg` - Apple Silicon Mac

---

## 🔧 配置说明

### 环境变量

```yaml
env:
  CARGO_TERM_COLOR: always      # Cargo 彩色输出
  RUST_VERSION: 1.85            # Rust 版本
  NODE_VERSION: 20              # Node.js 版本
  APP_NAME: XingJu              # 应用名称
  APP_VERSION: ${{ github.ref_name }}  # 从 Tag 获取版本号
```

### 缓存配置

```yaml
cache: 'npm'
cache-dependency-path: package-lock.json
```

**优势:**
- 加速依赖安装
- 减少构建时间 50%+

### 系统依赖 (Linux)

```bash
libwebkit2gtk-4.0-dev      # Tauri WebKit
libgtk-3-dev               # GTK3
libayatana-appindicator3-dev  # 系统托盘
librsvg2-dev               # SVG 渲染
libxdo-dev                 # 键盘鼠标模拟
libssl-dev                 # SSL 支持
```

---

## 📊 预计构建时间

| 平台 | 首次构建 | 缓存命中 |
|------|----------|----------|
| Windows | ~15 分钟 | ~5 分钟 |
| Linux | ~12 分钟 | ~4 分钟 |
| macOS Intel | ~18 分钟 | ~6 分钟 |
| macOS ARM | ~20 分钟 | ~7 分钟 |
| **总计** | **~65 分钟** | **~22 分钟** |

---

## 🎯 使用步骤

### 步骤 1: 推送 Tag 触发构建

```bash
# 1. 确保代码已提交
git add .
git commit -m "release: v2.0.0"

# 2. 创建并推送 Tag
git tag -a v2.0.0 -m "XingJu v2.0.0 - 前端界面重新设计"
git push origin v2.0.0
```

### 步骤 2: 监控构建进度

访问：https://github.com/xfengyin/XingJu/actions

**查看内容:**
- 构建状态 (运行中/成功/失败)
- 各平台构建日志
- 构建产物下载

### 步骤 3: 检查 Release

构建成功后，自动创建 Release:
https://github.com/xfengyin/XingJu/releases/tag/v2.0.0

**包含内容:**
- 所有平台安装包
- 自动生成发布说明
- 下载统计

---

## 🔍 故障排查

### 问题 1: 构建失败 - Rust 版本不匹配

**错误:**
```
error: toolchain '1.85-x86_64-unknown-linux-gnu' is not installed
```

**解决:**
```yaml
# 修改 Rust 版本
env:
  RUST_VERSION: 1.85  # 改为可用版本
```

### 问题 2: 系统依赖缺失 (Linux)

**错误:**
```
error: failed to run custom build command for `webkit2gtk-sys`
```

**解决:**
```yaml
# 确保安装所有依赖
sudo apt-get install -y \
  libwebkit2gtk-4.0-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev
```

### 问题 3: 构建产物找不到

**错误:**
```
Error: No artifacts found
```

**解决:**
```yaml
# 检查 tauri.conf.json 中的 bundle 配置
"bundle": {
  "active": true,
  "targets": ["deb", "msi", "dmg", "appimage"]
}
```

### 问题 4: Release 创建失败

**错误:**
```
Error: Resource not accessible by integration
```

**解决:**
1. 检查仓库权限设置
2. 确保 workflow 有写入权限
3. 在 Settings > Actions > General 中启用 "Allow GitHub Actions to create ... pull requests"

---

## 📈 优化建议

### 1. 使用构建缓存

```yaml
- uses: Swatinem/rust-cache@v2
  with:
    workspaces: 'src-tauri'
```

**效果:** 减少 Rust 编译时间 60%

### 2. 并行构建

当前配置已并行执行 4 个平台的构建

### 3. 使用自托管 Runner

**优势:**
- 更快的构建速度
- 更低的成本 (免费额度外)
- 完全控制环境

**配置:**
```yaml
runs-on: self-hosted
```

### 4. 增量构建

```yaml
# 仅当相关文件变更时触发
on:
  push:
    tags:
      - 'v*'
    paths:
      - 'src/**'
      - 'src-tauri/**'
      - 'package.json'
```

---

## 🔐 代码签名 (可选)

### Windows 签名

```yaml
- name: Sign Windows App
  run: |
    signtool sign /f ${{ secrets.WIN_CERT }} /p ${{ secrets.WIN_CERT_PASSWORD }} /tr http://timestamp.digicert.com /td sha256 /fd sha256 src-tauri/target/release/XingJu.exe
```

### macOS 签名 + 公证

```yaml
- name: Sign macOS App
  run: |
    codesign --deep --force --sign "${{ secrets.MAC_CERT }}" XingJu.app

- name: Notarize macOS App
  run: |
    xcrun notarytool submit XingJu.app --apple-id "${{ secrets.APPLE_ID }}" --password "${{ secrets.APPLE_PASSWORD }}" --team-id "${{ secrets.TEAM_ID }}"
```

---

## 📊 监控与通知

### 构建失败通知

```yaml
- name: Notify on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build failed!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 构建成功通知

```yaml
- name: Notify on Success
  if: success()
  run: |
    echo "Build successful! Release created at:"
    echo "https://github.com/xfengyin/XingJu/releases/tag/${{ github.ref_name }}"
```

---

## 📝 最佳实践

### 1. 版本号管理

使用语义化版本 (SemVer):
```
v2.0.0  # 主版本。次版本。修订版本
```

### 2. Pre-release

```yaml
prerelease: true  # 测试版本标记
```

### 3. Draft Release

```yaml
draft: true  # 先创建草稿，手动审核后发布
```

### 4. 保留构建产物

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: artifacts
    path: release/
    retention-days: 30  # 保留 30 天
```

---

## 🔗 相关资源

- **GitHub Actions 文档:** https://docs.github.com/en/actions
- **Tauri CI/CD 指南:** https://tauri.app/v1/guides/building/ci/
- **Rust Toolchain Action:** https://github.com/dtolnay/rust-toolchain
- **Softprops Release Action:** https://github.com/softprops/action-gh-release

---

_配置版本：v2.0_  
_最后更新：2026-03-12_  
_维护者：Dev-Planner_
