# CI/CD 测试任务 - Dev-Tester

## 📋 任务说明

**优先级:** P0 - 高优先级  
**预计时间:** 30-60 分钟  
**测试版本:** v2.0.0-rc.1 (待创建)

---

## 🎯 测试目标

验证 CI/CD 配置是否正确，确保多平台构建可以成功执行。

---

## 📦 测试范围

### 1. 简化版 CI/CD (优先测试) ⭐

**工作流:** `.github/workflows/ci-test.yml`

**测试内容:**
- ✅ Rust 环境配置 (1.75)
- ✅ Node.js 环境配置 (18 LTS)
- ✅ 系统依赖安装
- ✅ Web 构建
- ✅ Tauri Linux 构建
- ✅ 产物上传

**触发方式:**
```bash
# 方式 1: 推送 RC Tag
git tag -a v2.0.0-rc.1 -m "Release Candidate 1"
git push origin v2.0.0-rc.1

# 方式 2: 手动触发
访问：https://github.com/xfengyin/XingJu/actions/workflows/ci-test.yml
点击 "Run workflow"
```

**预计时间:** 15-30 分钟

---

### 2. 完整版 CI/CD (后续测试)

**工作流:** `.github/workflows/build-release.yml`

**测试内容:**
- ✅ Windows 构建 (MSI + NSIS)
- ✅ Linux 构建 (DEB + AppImage)
- ✅ macOS Intel 构建 (DMG)
- ✅ macOS ARM 构建 (DMG)
- ✅ 自动 Release 创建

**触发方式:**
```bash
# 推送正式 Tag
git tag -a v2.0.0 -m "XingJu v2.0.0"
git push origin v2.0.0
```

**预计时间:** 45-90 分钟

---

## 📋 测试步骤

### 步骤 1: 访问 Actions 页面

打开：https://github.com/xfengyin/XingJu/actions

### 步骤 2: 查看工作流列表

确认以下工作流存在：
- [ ] `CI Test - Simplified` (新增)
- [ ] `Build & Release` (已有)

### 步骤 3: 触发简化版测试

**推荐方式:** 手动触发

1. 点击 `CI Test - Simplified` 工作流
2. 点击 "Run workflow"
3. 选择 `main` 分支
4. 点击 "Run workflow"

### 步骤 4: 监控构建进度

**查看内容:**
- [ ] 绿色 = 成功
- [ ] 黄色 = 进行中
- [ ] 红色 = 失败

**预计时间:**
- Dependencies: ~5 分钟
- Web Build: ~5 分钟
- Tauri Build: ~15-25 分钟
- **总计:** ~30 分钟

### 步骤 5: 查看构建日志

**如果失败，查看详细日志:**

1. 点击失败的 Job
2. 展开每个 Step
3. 查看错误信息
4. 复制关键错误

**常见错误位置:**
```
Install system dependencies → 依赖安装失败
Install dependencies → npm 安装失败
Build Tauri App → Rust 编译失败
```

### 步骤 6: 下载构建产物

**如果成功:**

1. 点击构建任务
2. 滚动到页面底部
3. 找到 "Artifacts" 区域
4. 下载产物:
   - `web-build` - Web 版本
   - `linux-deb` - Linux DEB 包
   - `linux-appimage` - Linux AppImage

### 步骤 7: 验证产物

**本地测试:**

```bash
# 1. 解压 Web 版本
tar -xzf web-build.tar.gz
cd dist
# 用浏览器打开 index.html

# 2. 安装 DEB 包 (Linux)
sudo dpkg -i xingju_*.deb

# 3. 运行 AppImage (Linux)
chmod +x XingJu_*.AppImage
./XingJu_*.AppImage
```

**验证项目:**
- [ ] 应用可以启动
- [ ] 界面显示正常
- [ ] 4 个模块可以切换
- [ ] 无控制台错误

---

## 📊 测试报告模板

### CI/CD 测试报告

**测试日期:** 2026-03-12  
**测试人员:** Dev-Tester  
**测试版本:** v2.0.0-rc.1

#### 构建结果

| 阶段 | 状态 | 耗时 | 备注 |
|------|------|------|------|
| Dependencies | ✅/❌ | __min | |
| Web Build | ✅/❌ | __min | |
| Tauri Build | ✅/❌ | __min | |
| 产物上传 | ✅/❌ | __min | |

#### 构建产物

| 产物 | 大小 | 可下载 | 可运行 |
|------|------|--------|--------|
| Web Build | __MB | ✅/❌ | ✅/❌ |
| Linux DEB | __MB | ✅/❌ | ✅/❌ |
| AppImage | __MB | ✅/❌ | ✅/❌ |

#### 问题记录

**问题 1:**
```
错误信息:
____

可能原因:
____

建议解决方案:
____
```

**问题 2:**
```
错误信息:
____

可能原因:
____

建议解决方案:
____
```

#### 测试结论

- [ ] **通过** - CI/CD 配置正确，可以进行多平台构建
- [ ] **部分通过** - 需要修复部分问题
- [ ] **失败** - CI/CD 配置有误，需要重新配置

#### 下一步建议

1. ____
2. ____
3. ____

---

## 🐛 常见问题诊断

### 问题 1: Rust 版本错误

**错误:**
```
error: toolchain '1.75-x86_64-unknown-linux-gnu' is not installed
```

**解决:**
检查 `.github/workflows/ci-test.yml` 中 RUST_VERSION 是否正确

### 问题 2: 依赖安装失败

**错误:**
```
E: Unable to locate package libwebkit2gtk-4.0-dev
```

**解决:**
```bash
sudo apt-get update
```

### 问题 3: 内存不足

**错误:**
```
fatal error: out of memory
```

**解决:**
使用 `runs-on: ubuntu-latest` (更高配置)

### 问题 4: npm 安装失败

**错误:**
```
npm ERR! code ENOENT
```

**解决:**
检查 `package.json` 是否存在

---

## 📞 需要帮助？

### 查看日志

1. 访问：https://github.com/xfengyin/XingJu/actions
2. 点击构建任务
3. 点击具体的 Job
4. 展开每个 Step 查看日志

### 报告问题

将以下信息发送给 Dev-Planner:

1. **构建链接:** https://github.com/xfengyin/XingJu/actions/runs/____
2. **失败阶段:** Dependencies / Web Build / Tauri Build
3. **错误日志:** 复制关键错误信息 (约 10-20 行)
4. **建议:** 你的修复建议 (如有)

---

## ✅ 验收标准

### P0 - 必须通过

- [ ] Dependencies 阶段成功
- [ ] Web Build 阶段成功
- [ ] Tauri Build 阶段成功
- [ ] 产物可以下载

### P1 - 应该通过

- [ ] 构建时间 < 45 分钟
- [ ] 产物大小合理 (< 10MB)
- [ ] 应用可以启动

### P2 - 建议优化

- [ ] 缓存命中率高
- [ ] 日志清晰易读
- [ ] 错误信息明确

---

## 🚀 下一步

**测试通过后:**

1. ✅ Dev-Tester 签字确认
2. ✅ Dev-Coder 修复所有问题
3. ✅ Dev-Planner 创建正式 Tag
4. ✅ 触发多平台构建
5. ✅ 发布 Release

---

_创建日期：2026-03-12_  
_版本：v2.0.0-rc.1_  
_状态：待测试_
