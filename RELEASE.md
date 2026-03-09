# XingJu Release Process

星聚项目发布流程文档

## 🎯 发布策略

### 版本类型

1. **开源版 (Open Source)** - 社区驱动，免费使用
2. **发行版 (Enterprise)** - 商业授权，企业功能

### 发布渠道

| 渠道 | 开源版 | 发行版 |
|------|--------|--------|
| GitHub Releases | ✅ | ✅ |
| 官网下载 | ✅ | ✅ |
| 应用商店 | ❌ | ✅ |
| Docker Hub | ✅ | ✅ |

## 🔄 发布流程

### 常规发布

```bash
# 1. 准备发布
git checkout develop
git pull origin develop

# 2. 创建 release 分支
git checkout -b release/v2.1.0

# 3. 更新版本号
# - package.json
# - pyproject.toml
# - version.py

# 4. 更新 CHANGELOG.md

# 5. 提交
git add .
git commit -m "chore(release): prepare v2.1.0"

# 6. 合并到 main
git checkout main
git merge release/v2.1.0 --no-ff

# 7. 打标签
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin main --tags

# 8. 合并回 develop
git checkout develop
git merge release/v2.1.0 --no-ff
git push origin develop

# 9. 删除 release 分支
git branch -d release/v2.1.0
```

### 热修复发布

```bash
# 1. 从 main 创建 hotfix
git checkout main
git checkout -b hotfix/v2.1.1

# 2. 修复问题

# 3. 更新版本号（修订号+1）

# 4. 提交并发布
git add .
git commit -m "fix: 紧急修复 xxx"

# 5. 合并到 main
git checkout main
git merge hotfix/v2.1.1 --no-ff
git tag -a v2.1.1 -m "Hotfix v2.1.1"
git push origin main --tags

# 6. 合并到 develop
git checkout develop
git merge hotfix/v2.1.1 --no-ff
git push origin develop
```

## 📦 构建产物

### Electron 桌面端

| 平台 | 格式 | 文件名 |
|------|------|--------|
| Linux | AppImage | `XingJu-2.1.0-linux-x86_64.AppImage` |
| Linux | deb | `xingju_2.1.0_amd64.deb` |
| macOS | dmg | `XingJu-2.1.0-mac.dmg` |
| Windows | exe | `XingJu Setup 2.1.0.exe` |
| Windows | msi | `XingJu-2.1.0-win.msi` |

### Python 后端

| 平台 | 格式 |
|------|------|
| Linux | Docker 镜像 |
| Linux | 二进制可执行文件 |
| macOS | 二进制可执行文件 |
| Windows | 二进制可执行文件 |

## 🔐 代码签名

### macOS
- Apple Developer ID Application
- 公证 (Notarization)

### Windows
- EV Code Signing Certificate
- Microsoft SmartScreen 信任

### Linux
- GPG 签名包
- SHA256 checksum

## 🚀 CI/CD 自动发布

### 触发条件

- Push tag `v*` → 自动构建 + 发布
- Push tag `v*-rc.*` → 预发布
- Push tag `v*-beta.*` → 测试版

### 发布步骤

1. 运行测试
2. 构建前端
3. 构建 Python 后端
4. 打包 Electron 应用
5. 代码签名
6. 上传到 GitHub Releases
7. 更新 Docker 镜像
8. 通知用户

## 📝 CHANGELOG 规范

```markdown
## [2.1.0] - 2024-03-09

### Added
- 新增 RSS 源聚合支持
- 添加内容过滤规则

### Changed
- 优化爬虫性能
- 改进 UI 响应速度

### Fixed
- 修复某些网站解析失败
- 修复内存泄漏问题

### Security
- 升级依赖库
```

## 🏷️ 版本标签

```
v2.1.0          # 正式版
v2.1.0-rc.1     # 候选版
v2.1.0-beta.2   # 测试版
v2.1.0-alpha.1  # 内测版
```

## 📊 发布后检查

- [ ] GitHub Release 已创建
- [ ] 所有构建产物已上传
- [ ] Docker 镜像已推送
- [ ] 文档已更新
- [ ] 社交媒体已发布
- [ ] 邮件通知已发送

## 🚨 紧急回滚

如果发布版本有问题：

1. 在 GitHub 标记为 pre-release
2. 发布公告建议用户暂缓升级
3. 快速修复并发布新版本
4. 必要时删除有问题的 Release
