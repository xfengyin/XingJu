# XingJu v2.0.0 - 手动发布指南

## ⚠️ 需要手动操作

由于需要 GitHub 认证，请按以下步骤手动创建 Release。

---

## 📋 步骤 1: 创建 Git Tag

```bash
cd XingJu-v2

# 删除旧 Tag (如果存在)
git tag -d v2.0.0

# 创建新 Tag
git tag -a v2.0.0 -m "XingJu v2.0.0 - 前端界面重新设计 ✨ 测试通过率 100%"

# 推送 Tag (需要输入 GitHub 用户名和密码/Token)
git push origin v2.0.0
```

**或者使用 GitHub Token:**
```bash
git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/xfengyin/XingJu.git v2.0.0
```

**获取 GitHub Token:**
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成后复制 Token
5. 在上面的命令中使用

---

## 📋 步骤 2: 手动触发 GitHub Actions

如果推送 Tag 失败，可以手动触发自动构建：

### 方式 1: 访问 Actions 页面

1. 打开：https://github.com/xfengyin/XingJu/actions/workflows/build-release.yml
2. 点击右上角 "Run workflow"
3. 选择分支：`main`
4. 点击 "Run workflow"

### 方式 2: 使用 GitHub CLI

```bash
# 安装 GitHub CLI
gh workflow run build-release.yml

# 查看运行状态
gh run list
```

---

## 📋 步骤 3: 创建 GitHub Release

如果自动 Release 失败，可以手动创建：

### 访问 Release 页面

打开：https://github.com/xfengyin/XingJu/releases/new

### 填写发布信息

**Tag version:** `v2.0.0`  
**Target:** `main`  
**Release title:** `XingJu v2.0.0 - 前端界面重新设计`

### 复制发布说明

```markdown
## ✨ 重大更新

### 🎨 全新设计系统
- 高级赛博朋克风格
- 玻璃态面板 + 渐变文字 + 霓虹边框
- 6 种核心动画效果
- 多层背景系统 (渐变 + 网格 + 粒子)

### 📱 组件全面升级
- Sidebar - 渐变指示器、用户信息卡片
- Header - 搜索框光晕、通知红点
- Player - 可视化音频条、渐变进度条
- MusicModule - 推荐歌单、来源标签
- VideoModule - 精选视频、分类筛选
- NovelModule - 小说网格、评分系统
- MangaModule - 网格/列表切换、更新提示

### 📊 测试结果
- 测试用例：23/23 通过
- 通过率：100%
- 最终评分：97.6/100

### 📦 安装包
- Windows: MSI + NSIS
- Linux: DEB + AppImage
- macOS: Intel + ARM (DMG)

### 🔗 相关链接
- 设计文档：DESIGN-REDESIGN.md
- 测试报告：TEST-REPORT.md
- CI/CD 配置：CI-CD-SETUP.md
```

### 上传安装包

等待 GitHub Actions 构建完成后，下载产物会自动上传到 Release。

**或者手动上传:**
1. 本地构建：`npm run tauri build`
2. 上传所有 `.msi`, `.deb`, `.AppImage`, `.dmg` 文件

### 发布

- ✅ 勾选 "Set as the latest release"
- 点击 "Publish release"

---

## 🚀 快速发布脚本

创建一个快速发布脚本：

```bash
#!/bin/bash
# release-v2.sh

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 XingJu v2.0.0 发布脚本${NC}"
echo "================================"

# 检查 Git Token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ 错误：GITHUB_TOKEN 未设置${NC}"
    echo ""
    echo "请设置环境变量:"
    echo "export GITHUB_TOKEN=your_token_here"
    echo ""
    echo "或者在 GitHub 生成 Token:"
    echo "https://github.com/settings/tokens"
    exit 1
fi

# 创建 Tag
echo -e "${YELLOW}📝 创建 Git Tag...${NC}"
git tag -d v2.0.0 2>/dev/null || true
git tag -a v2.0.0 -m "XingJu v2.0.0 - 前端界面重新设计"

# 推送 Tag
echo -e "${YELLOW}📤 推送 Tag 到 GitHub...${NC}"
git push https://$GITHUB_TOKEN@github.com/xfengyin/XingJu.git v2.0.0

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tag 推送成功!${NC}"
    echo ""
    echo "📊 查看构建进度:"
    echo "https://github.com/xfengyin/XingJu/actions"
    echo ""
    echo "⏰ 预计构建时间：22-65 分钟"
    echo ""
    echo "📦 构建完成后查看 Release:"
    echo "https://github.com/xfengyin/XingJu/releases/tag/v2.0.0"
else
    echo -e "${RED}❌ Tag 推送失败!${NC}"
    echo "请检查 Token 是否有效"
    exit 1
fi
```

**使用:**
```bash
chmod +x release-v2.sh
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
./release-v2.sh
```

---

## 📊 构建监控

### 查看实时日志

1. 访问：https://github.com/xfengyin/XingJu/actions
2. 点击最新的构建任务
3. 查看各平台构建日志

### 构建阶段

```
✅ Queue (排队)
⏳ In Progress (进行中)
   ├─ build-windows (Windows)
   ├─ build-linux (Linux)
   ├─ build-macos-intel (macOS Intel)
   └─ build-macos-arm (macOS ARM)
✅ Completed (完成)
   └─ create-release (创建 Release)
```

---

## 📦 验证 Release

构建完成后，检查：

### 1. Release 页面
https://github.com/xfengyin/XingJu/releases/tag/v2.0.0

### 2. 下载链接
- [ ] Windows MSI 可下载
- [ ] Windows NSIS 可下载
- [ ] Linux DEB 可下载
- [ ] Linux AppImage 可下载
- [ ] macOS Intel DMG 可下载
- [ ] macOS ARM DMG 可下载

### 3. 发布说明
- [ ] 格式正确
- [ ] 包含所有更新内容
- [ ] 链接有效

---

## 🐛 常见问题

### 问题 1: Tag 推送失败 - 认证错误

**解决:**
```bash
# 使用 Token 代替密码
git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/xfengyin/XingJu.git v2.0.0
```

### 问题 2: Actions 未触发

**解决:**
1. 检查 `.github/workflows/build-release.yml` 是否存在
2. 检查 Tag 名称是否匹配 `v*`
3. 手动触发：Actions → Run workflow

### 问题 3: 构建失败

**查看日志:**
1. Actions 页面 → 失败的构建
2. 查看具体错误信息
3. 根据错误修复

**常见错误:**
- Rust 版本不匹配
- 系统依赖缺失
- 磁盘空间不足

### 问题 4: Release 未自动创建

**解决:**
手动创建 Release 并上传构建产物：
1. Actions → 成功的构建
2. 下载 Artifacts
3. 手动创建 Release 并上传

---

## 📞 需要帮助？

- **GitHub Docs:** https://docs.github.com/en/repositories
- **Tauri Docs:** https://tauri.app/v1/guides
- **Actions Docs:** https://docs.github.com/en/actions

---

_创建日期：2026-03-12_  
_版本：v2.0.0_
