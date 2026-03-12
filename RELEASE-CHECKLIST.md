# XingJu v2.0.0 - 发布检查清单

## 📋 发布前检查

### 代码质量
- [x] 所有代码已提交到 Git
- [x] 无 TypeScript 编译错误
- [x] 无 ESLint 警告
- [x] 代码已格式化
- [x] Git 标签已创建

### 构建验证
- [x] Web 版本构建成功
- [x] 构建产物大小合理 (< 500KB)
- [x] Gzip 压缩正常
- [ ] Tauri 桌面版本构建 (需 Rust 环境)
- [x] 构建产物已测试

### 文档完整性
- [x] README.md 更新
- [x] CHANGELOG.md 更新
- [x] RELEASE-NOTES-v2.0.0.md 编写
- [x] BUILD-RELEASE.md 编写
- [x] TEST-PLAN.md 编写
- [x] QUICK-TEST.md 编写
- [x] DESIGN-REDESIGN.md 编写

### 测试状态
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] E2E 测试通过
- [ ] 性能测试通过
- [ ] 兼容性测试通过
- [ ] Dev-Tester 验收通过

---

## 🚀 发布步骤

### 步骤 1: 创建 Git 标签

```bash
cd XingJu-v2

# 创建标签
git tag -a v2.0.0 -m "XingJu v2.0.0 - 前端界面重新设计"

# 推送标签
git push origin v2.0.0
```

**状态:** ⬜ 待执行

---

### 步骤 2: 构建多平台安装包

#### 2.1 Web 版本 ✅
```bash
npm run build
tar -czvf xingju-v2.0.0-web.tar.gz dist/
```
**状态:** ✅ 已完成

#### 2.2 Windows 版本
```bash
# 环境要求:
# - Rust + MSVC
# - Visual Studio 2022
# - WebView2

npm run tauri build
```
**产物:** `src-tauri/target/release/bundle/msi/XingJu_2.0.0_x64.msi`  
**状态:** ⬜ 待构建

#### 2.3 macOS 版本
```bash
# 环境要求:
# - Rust
# - Xcode Command Line Tools

npm run tauri build
```
**产物:** `src-tauri/target/release/bundle/dmg/XingJu_2.0.0_x64.dmg`  
**状态:** ⬜ 待构建

#### 2.4 Linux 版本
```bash
# 环境要求:
# - Rust
# - WebKit2GTK
# - libappindicator3

npm run tauri build
```
**产物:** 
- `src-tauri/target/release/bundle/deb/xingju_2.0.0_amd64.deb`
- `src-tauri/target/release/bundle/appimage/XingJu_2.0.0_x86_64.AppImage`  
**状态:** ⬜ 待构建

---

### 步骤 3: 创建 GitHub Release

#### 3.1 访问 Release 页面
URL: https://github.com/xfengyin/XingJu/releases/new

**状态:** ⬜ 待执行

#### 3.2 填写发布信息

**Tag version:** `v2.0.0`  
**Target:** `main`  
**Release title:** `XingJu v2.0.0 - 前端界面重新设计`

#### 3.3 发布说明

复制 `RELEASE-NOTES-v2.0.0.md` 的内容

#### 3.4 上传安装包

- [ ] `xingju-v2.0.0-web.tar.gz` ✅ 已构建
- [ ] `XingJu_2.0.0_x64.msi` ⬜ 待构建 (Windows)
- [ ] `XingJu_2.0.0_x64.dmg` ⬜ 待构建 (macOS Intel)
- [ ] `XingJu_2.0.0_aarch64.dmg` ⬜ 待构建 (macOS ARM)
- [ ] `xingju_2.0.0_amd64.deb` ⬜ 待构建 (Linux)
- [ ] `XingJu_2.0.0_x86_64.AppImage` ⬜ 待构建 (Linux)

#### 3.5 设置为最新版本
- [ ] 勾选 "Set as the latest release"

**状态:** ⬜ 待执行

---

### 步骤 4: 更新项目文档

#### 4.1 更新 README.md
```markdown
## 下载
- v2.0.0 (最新) - 2026-03-12
- [Web 版本](https://github.com/xfengyin/XingJu/releases/download/v2.0.0/xingju-v2.0.0-web.tar.gz)
- [Windows](https://github.com/xfengyin/XingJu/releases/download/v2.0.0/XingJu_2.0.0_x64.msi)
- [macOS](https://github.com/xfengyin/XingJu/releases/download/v2.0.0/XingJu_2.0.0_x64.dmg)
- [Linux](https://github.com/xfengyin/XingJu/releases/download/v2.0.0/xingju_2.0.0_amd64.deb)
```

**状态:** ⬜ 待执行

#### 4.2 更新 CHANGELOG.md
添加 v2.0.0 更新内容

**状态:** ⬜ 待执行

---

### 步骤 5: 通知团队

#### 5.1 发送通知
- [ ] 通知 Dev-Tester 测试验收
- [ ] 通知 Media-Creator 准备宣传素材
- [ ] 通知用户群新版本发布

**状态:** ⬜ 待执行

---

### 步骤 6: 发布后验证

#### 6.1 下载验证
- [ ] Web 版本可正常下载
- [ ] Windows 安装包可正常下载
- [ ] macOS 安装包可正常下载
- [ ] Linux 安装包可正常下载

**状态:** ⬜ 待执行

#### 6.2 功能验证
- [ ] Web 版本运行正常
- [ ] Windows 版本安装成功
- [ ] macOS 版本安装成功
- [ ] Linux 版本安装成功

**状态:** ⬜ 待执行

#### 6.3 页面验证
- [ ] Release 页面显示正常
- [ ] 下载链接有效
- [ ] 发布说明格式正确
- [ ] 标签显示正确

**状态:** ⬜ 待执行

---

## 📊 发布进度

| 阶段 | 任务数 | 已完成 | 进度 |
|------|--------|--------|------|
| 发布前检查 | 15 | 9 | 60% |
| 构建安装包 | 5 | 1 | 20% |
| 创建 Release | 5 | 0 | 0% |
| 更新文档 | 2 | 0 | 0% |
| 团队通知 | 3 | 0 | 0% |
| 发布后验证 | 10 | 0 | 0% |
| **总计** | **40** | **10** | **25%** |

---

## ⚠️ 阻塞项

### 当前阻塞
1. **Rust 环境未安装** - 无法构建 Tauri 桌面版本
   - 解决方案：在本地或 CI/CD 环境安装 Rust
   - 优先级：高
   - 负责人：待分配

### 非阻塞项
1. Web 版本已构建完成，可以先发布
2. 桌面版本可以后续补充

---

## 📝 备注

### 构建环境要求

#### Rust 安装
```bash
# 使用官方脚本
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 或使用国内镜像
export RUSTUP_DIST_SERVER=https://rsproxy.cn
export RUSTUP_UPDATE_ROOT=https://rsproxy.cn/rustup
curl --proto '=https' --tlsv1.2 -sSf https://rsproxy.cn/rustup-init.sh | sh
```

#### 平台特定依赖

**Windows:**
- Visual Studio 2022 with C++ workload
- WebView2

**macOS:**
- Xcode Command Line Tools

**Linux:**
```bash
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

---

## 🎯 下一步行动

1. **立即执行:**
   - [ ] 创建 Git 标签并推送
   - [ ] 创建 GitHub Release (Web 版本)

2. **短期执行:**
   - [ ] 安装 Rust 环境
   - [ ] 构建桌面版本安装包

3. **后续优化:**
   - [ ] 配置 CI/CD 自动构建
   - [ ] 添加自动签名和公证
   - [ ] 设置自动发布流程

---

_检查清单版本：v2.0_  
_创建日期：2026-03-12_  
_最后更新：2026-03-12_
