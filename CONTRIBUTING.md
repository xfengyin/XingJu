# Contributing to XingJu

感谢您对 XingJu 星聚项目的兴趣！本文档将帮助您了解如何参与项目开发。

## 🌟 关于 XingJu

XingJu（星聚）是一款多元内容聚合工具，支持多平台内容整合与管理。

## 🌿 分支模型 (Git Flow)

```
main          - 生产分支，稳定版本
├── develop   - 开发分支，功能集成
├── feature/* - 功能分支
├── release/* - 发布分支
└── hotfix/*  - 热修复分支
```

## 🔄 开发流程

### 1. Fork & Clone

```bash
# Fork 项目后克隆
git clone https://github.com/YOUR_USERNAME/XingJu.git
cd XingJu

# 添加上游仓库
git remote add upstream https://github.com/xfengyin/XingJu.git
```

### 2. 创建功能分支

```bash
# 同步上游
git fetch upstream
git checkout develop
git merge upstream/develop

# 创建分支
git checkout -b feature/your-feature-name
```

### 3. 开发规范

#### Python 后端
- 遵循 PEP 8 规范
- 使用类型注解
- 编写单元测试

```python
# 示例
def fetch_content(url: str, timeout: int = 30) -> dict:
    """获取内容
    
    Args:
        url: 目标 URL
        timeout: 超时时间（秒）
        
    Returns:
        内容字典
    """
    pass
```

#### Vue3/Electron 前端
- 使用 Composition API
- 组件命名使用 PascalCase
- Props 必须定义类型

```vue
<script setup lang="ts">
interface Props {
  title: string
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: ''
})
</script>
```

### 4. 提交规范

使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
perf: 性能优化
```

### 5. Pull Request

1. 推送到您的 Fork
```bash
git push origin feature/your-feature-name
```

2. 创建 PR 到 `develop` 分支

3. PR 模板：
   - 描述变更内容
   - 关联的 Issue
   - 测试情况
   - 截图（如适用）

## 📦 版本发布

### 版本号 (SemVer)

```
主版本.次版本.修订号
X.Y.Z
```

### 发布流程

1. 从 develop 创建 release 分支
2. 更新版本号和 CHANGELOG
3. 测试并修复
4. 合并到 main 并打标签
5. 合并回 develop

## 🏢 开源版 vs 发行版

| 特性 | 开源版 | 发行版 |
|------|--------|--------|
| 基础聚合 | ✅ | ✅ |
| 自定义源 | ✅ | ✅ |
| 高级过滤 | ❌ | ✅ |
| 云同步 | ❌ | ✅ |
| API 访问 | ❌ | ✅ |
| 技术支持 | 社区 | 商业 |

## 📝 提交前检查

- [ ] 代码通过 lint
- [ ] 测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新

## 🐛 报告问题

使用 GitHub Issues，包含：
- 问题描述
- 复现步骤
- 期望 vs 实际结果
- 环境信息
- 错误日志

## 💬 交流

- GitHub Discussions
- Issue 评论
- 邮件: dev@xingju.app

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE)
