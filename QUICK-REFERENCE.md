# XingJu v2.0 - 快速参考指南

## 🚀 常用命令

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发完成后提交
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 在 GitHub 创建 Pull Request
# https://github.com/xfengyin/XingJu/pulls
```

### 版本发布

```bash
# 1. 升级版本 (major|minor|patch)
./scripts/bump-version.sh minor

# 2. 推送主分支
git push origin main

# 3. 创建 RC 版本
./scripts/create-rc.sh

# 4. 等待 CI/CD 测试
# https://github.com/xfengyin/XingJu/actions

# 5. 测试通过后创建正式版本
git tag -a v2.1.0 -m "Release v2.1.0"
git push origin v2.1.0
```

### 故障诊断

```bash
# 分析构建失败
./scripts/analyze-build-failure.sh

# 查看最新构建
# https://github.com/xfengyin/XingJu/actions

# 查看 Release
# https://github.com/xfengyin/XingJu/releases
```

---

## 📊 工作流程

```
需求 → 开发 → PR → 审查 → 合并 → RC → 测试 → 发布
```

### 各阶段说明

| 阶段 | 负责人 | 输出 |
|------|--------|------|
| **需求分析** | Dev-Planner | 任务清单 |
| **开发** | Dev-Coder | 代码 + PR |
| **审查** | Dev-Planner | 批准合并 |
| **RC 测试** | Dev-Tester | 测试报告 |
| **发布** | Dev-Planner | GitHub Release |
| **验证** | Dev-Tester | 验收报告 |

---

## 🎯 提交规范

### Commit Message

```
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 分支命名

```
feature/new-feature     # 新功能
bugfix/issue-123        # Bug 修复
hotfix/critical         # 紧急修复
refactor/module         # 重构
```

---

## 🔗 重要链接

| 用途 | 链接 |
|------|------|
| **仓库主页** | https://github.com/xfengyin/XingJu |
| **Actions** | https://github.com/xfengyin/XingJu/actions |
| **Releases** | https://github.com/xfengyin/XingJu/releases |
| **Issues** | https://github.com/xfengyin/XingJu/issues |
| **PRs** | https://github.com/xfengyin/XingJu/pulls |

---

## 📚 文档索引

| 文档 | 用途 |
|------|------|
| **AUTOMATED-WORKFLOW.md** | 完整自动化流程 |
| **DEVELOPMENT-WORKFLOW-v2.md** | 开发流程详解 |
| **CI-CD-TEST-TASK.md** | CI/CD 测试任务 |
| **RELEASE-CHECKLIST.md** | 发布检查清单 |
| **QUICK-REFERENCE.md** | 本文档 - 快速参考 |

---

## 🐛 常见问题

### Q: 如何创建新版本？
A: 运行 `./scripts/bump-version.sh minor` 然后 `./scripts/create-rc.sh`

### Q: CI/CD 失败怎么办？
A: 运行 `./scripts/analyze-build-failure.sh` 分析错误

### Q: 如何查看构建进度？
A: 访问 https://github.com/xfengyin/XingJu/actions

### Q: Release 在哪里？
A: 访问 https://github.com/xfengyin/XingJu/releases

---

## 📞 团队联系方式

| 角色 | 职责 |
|------|------|
| **Dev-Planner** | 架构设计、任务协调 |
| **Dev-Coder** | 代码开发 |
| **Dev-Tester** | 测试验收 |
| **Media-Creator** | 宣传素材 |

---

_创建日期：2026-03-12_  
_版本：v2.0_  
_状态：Ready to Use_
