#!/bin/bash

# XingJu v2.0 - 语义化版本升级
# 用法：./bump-version.sh [major|minor|patch]

set -e

CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "v2.0.0")
BUMP_TYPE=${1:-patch}

echo "📈 XingJu v2.0 - 版本升级"
echo "=========================="
echo ""
echo "当前版本：$CURRENT_VERSION"
echo "升级类型：$BUMP_TYPE"
echo ""

# 解析版本号 (去掉 v 前缀)
VERSION_NUM="${CURRENT_VERSION#v}"
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION_NUM"

# 根据类型升级
case $BUMP_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
    *)
        echo "❌ 错误：升级类型必须是 major、minor 或 patch"
        echo "用法：./bump-version.sh [major|minor|patch]"
        exit 1
        ;;
esac

NEW_VERSION="v${MAJOR}.${MINOR}.${PATCH}"

echo "升级后版本：$NEW_VERSION"
echo ""

# 确认
read -p "确认升级版本？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消升级"
    exit 0
fi

# 更新 package.json
if [ -f "package.json" ]; then
    echo "📝 更新 package.json..."
    if command -v jq &> /dev/null; then
        jq --arg version "$NEW_VERSION" '.version = $version' package.json > tmp.json
        mv tmp.json package.json
    else
        # 不使用 jq 的简单替换
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" package.json
    fi
fi

# 更新 tauri.conf.json
if [ -f "src-tauri/tauri.conf.json" ]; then
    echo "📝 更新 tauri.conf.json..."
    if command -v jq &> /dev/null; then
        jq --arg version "$NEW_VERSION" '.package.version = $version' src-tauri/tauri.conf.json > tmp.json
        mv tmp.json src-tauri/tauri.conf.json
    else
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/" src-tauri/tauri.conf.json
    fi
fi

# 提交更改
echo "📤 提交版本更新..."
git add package.json src-tauri/tauri.conf.json 2>/dev/null || true
git commit -m "chore: bump version to $NEW_VERSION" || echo "⚠️ 没有文件需要提交"

echo ""
echo "✅ 版本升级完成!"
echo ""
echo "📋 下一步:"
echo "   1. git push origin main"
echo "   2. ./scripts/create-rc.sh"
echo ""
