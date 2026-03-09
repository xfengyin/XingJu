# XingJu Versioning Policy

星聚项目版本管理规范

## 📋 语义化版本

采用 [SemVer 2.0.0](https://semver.org/)：

```
主版本号.次版本号.修订号
   X.Y.Z

X - 不兼容的 API 变更
Y - 向下兼容的功能新增
Z - 向下兼容的问题修复
```

## 🔄 版本升级规则

### 主版本 (X++)

- 配置文件格式变更
- 数据库 Schema 不兼容升级
- 移除公共 API
- 用户需要手动迁移

### 次版本 (Y++)

- 新增功能模块
- 新增配置选项
- 性能优化
- 标记 API 废弃

### 修订版本 (Z++)

- Bug 修复
- 安全补丁
- 依赖更新
- 文档修正

## 🏢 版本变体

### 开源版

```
2.1.0
2.1.1
2.2.0
```

特点：
- 完全开源
- 社区维护
- 基础功能

### 发行版

```
2.1.0-enterprise.1
2.1.0-enterprise.2
```

特点：
- 商业授权
- 企业功能
- 技术支持

## 📁 版本文件

### package.json (Electron)

```json
{
  "name": "xingju",
  "version": "2.1.0",
  "edition": "opensource"
}
```

### pyproject.toml (Python)

```toml
[tool.poetry]
name = "xingju-backend"
version = "2.1.0"
description = "XingJu Content Aggregator"
```

### version.py

```python
VERSION = "2.1.0"
EDITION = "opensource"  # or "enterprise"
BUILD_TIME = "2024-03-09T12:00:00Z"
GIT_COMMIT = "abc123"
```

## 🌿 分支版本对应

| 分支 | 版本 | 说明 |
|------|------|------|
| main | v2.1.3 | 当前稳定版 |
| develop | v2.2.0-dev | 下一版本开发 |
| release/v2.2.0 | v2.2.0-rc | 即将发布 |
| hotfix/v2.1.4 | v2.1.4 | 紧急修复 |

## 📅 发布周期

### 计划发布

- **主版本**：每年 Q1
- **次版本**：每季度
- **修订版**：按需

### 紧急发布

- 安全漏洞：24小时内
- 严重 Bug：48小时内
- 一般 Bug：下次常规发布

## 🔍 版本检测

### 运行时检测

```python
# Python
from xingju import version

print(f"Version: {version.VERSION}")
print(f"Edition: {version.EDITION}")
```

```javascript
// JavaScript
import { version, edition } from './version'

console.log(`Version: ${version}`)
console.log(`Edition: ${edition}`)
```

### 自动更新检查

```python
def check_update(current: str, latest: str) -> bool:
    """检查是否需要更新"""
    from packaging import version as pkg_version
    
    current_v = pkg_version.parse(current)
    latest_v = pkg_version.parse(latest)
    
    return latest_v > current_v
```

## 📝 版本记录

### CHANGELOG.md

每个版本必须记录：
- 新增功能
- 变更内容
- 修复问题
- 安全更新
- 破坏性变更

### Git 标签

```bash
# 轻量标签（不推荐）
git tag v2.1.0

# 附注标签（推荐）
git tag -a v2.1.0 -m "Release v2.1.0"

# 推送标签
git push origin v2.1.0
```

## 🔄 兼容性

### API 兼容性

| 变更 | 版本 | 兼容 |
|------|------|------|
| 新增端点 | Y+ | ✅ |
| 废弃端点 | Y+ | ✅ |
| 移除端点 | X+ | ❌ |
| 修改响应 | X+ | ❌ |

### 数据兼容性

- 主版本：需要迁移脚本
- 次版本：自动兼容
- 修订版：完全兼容

## 🎯 版本支持

| 版本 | 支持状态 | 截止日期 |
|------|----------|----------|
| v2.x | 活跃开发 | 2025-03 |
| v1.x | 安全更新 | 2024-09 |
| v0.x | 已停止 | - |

## 📋 发布检查清单

- [ ] 版本号已更新（所有文件）
- [ ] 符合 SemVer 规范
- [ ] CHANGELOG 已更新
- [ ] 文档已同步
- [ ] 测试全部通过
- [ ] 破坏性变更有迁移指南
- [ ] Git 标签已打
- [ ] Release Notes 已准备
