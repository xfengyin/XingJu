# XingJu v2.0.0 - 构建失败诊断与修复

## 🔍 可能的失败原因

根据常见构建问题，可能的原因包括：

### 1. Rust 版本问题
- **症状:** Rust 1.85 可能不存在或不兼容
- **解决:** 使用稳定版本 1.75 或 1.80

### 2. 系统依赖缺失 (Linux)
- **症状:** WebKit2GTK 或其他依赖安装失败
- **解决:** 更新 apt 源或更换镜像

### 3. 内存不足
- **症状:** Rust 编译时 OOM
- **解决:** 使用更大的 Runner 或优化编译

### 4. Node.js 版本问题
- **症状:** npm 依赖安装失败
- **解决:** 使用 Node.js 18 LTS

---

## ✅ 修复方案

### 方案 1: 降级 Rust 版本 (推荐)

修改 `.github/workflows/build-release.yml`:

```yaml
env:
  RUST_VERSION: 1.75  # 改为稳定版本
```

### 方案 2: 使用简化版工作流

创建一个简化的 CI/CD 配置，只构建最需要的平台。

### 方案 3: 先修复基础构建

在本地或简单环境中测试构建是否成功。

---

## 🛠️ 立即修复

让我为你创建一个修复版本的工作流：

```yaml
name: Build Release - Fixed

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

env:
  CARGO_TERM_COLOR: always
  RUST_VERSION: 1.75  # 使用稳定版本
  NODE_VERSION: 18    # 使用 LTS 版本

jobs:
  build-linux:
    runs-on: ubuntu-22.04
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          toolchain: ${{ env.RUST_VERSION }}
      
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install system dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libwebkit2gtk-4.0-dev \
            libgtk-3-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev \
            libxdo-dev \
            libssl-dev
      
      - name: Install dependencies
        run: |
          npm ci
      
      - name: Build Linux
        run: |
          npm run tauri build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Linux DEB
        uses: actions/upload-artifact@v4
        with:
          name: linux-deb
          path: src-tauri/target/release/bundle/deb/**/*.deb
      
      - name: Upload Linux AppImage
        uses: actions/upload-artifact@v4
        with:
          name: linux-appimage
          path: src-tauri/target/release/bundle/appimage/**/*.AppImage

  create-release:
    runs-on: ubuntu-22.04
    needs: [build-linux]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download Linux DEB
        uses: actions/download-artifact@v4
        with:
          name: linux-deb
          path: release/linux-deb
      
      - name: Download Linux AppImage
        uses: actions/download-artifact@v4
        with:
          name: linux-appimage
          path: release/linux-appimage
      
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: |
            release/linux-deb/*.deb
            release/linux-appimage/*.AppImage
          draft: false
          prerelease: false
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 📋 手动修复步骤

### 步骤 1: 查看构建日志

1. 访问：https://github.com/xfengyin/XingJu/actions
2. 点击失败的构建
3. 查看具体错误信息

### 步骤 2: 根据错误修复

**常见错误及解决方案:**

#### 错误：Rust 版本不存在
```
error: toolchain '1.85-x86_64-unknown-linux-gnu' is not installed
```
**解决:** 将 RUST_VERSION 改为 1.75 或 1.80

#### 错误：依赖安装失败
```
E: Unable to locate package libwebkit2gtk-4.0-dev
```
**解决:** 
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.0-dev
```

#### 错误：内存不足
```
fatal error: out of memory
```
**解决:** 使用 `runs-on: ubuntu-latest` (更高配置)

### 步骤 3: 重新触发构建

修复后：
1. 提交修改
2. 删除旧 Tag: `git tag -d v2.0.0`
3. 重新创建 Tag: `git tag -a v2.0.0 -m "Fixed build"`
4. 推送：`git push origin v2.0.0 --force`

---

## 🚀 快速修复命令

```bash
cd XingJu-v2

# 1. 修改工作流配置 (使用编辑器)
# 将 RUST_VERSION 从 1.85 改为 1.75
# 将 NODE_VERSION 从 20 改为 18

# 2. 提交修改
git add .github/workflows/build-release.yml
git commit -m "fix: downgrade Rust to 1.75 for stability"

# 3. 推送
git push

# 4. 重新触发构建
# 访问 Actions 页面手动触发
```

---

## 📞 需要更多信息

请提供构建失败的具体错误信息：

1. 访问：https://github.com/xfengyin/XingJu/actions
2. 点击失败的构建
3. 复制错误日志的关键部分
4. 告诉我具体的错误信息

这样我可以提供更精确的修复方案！

---

_创建日期：2026-03-12_  
_版本：v2.0.0_
