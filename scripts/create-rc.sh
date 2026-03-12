#!/bin/bash

# XingJu v2.0 - 自动创建 RC 版本
# 用法：./scripts/create-rc.sh

set -e

echo "🚀 XingJu v2.0 - 自动创建 RC 版本"
echo "=================================="
echo ""

# 获取最后一个 RC 版本号
LAST_RC=$(git tag -l "v*-rc.*" 2>/dev/null | sort -V | tail -n1)

if [ -z "$LAST_RC" ]; then
    # 没有 RC 版本，创建第一个
    NEW_RC="v2.0.0-rc.1"
    echo "📝 创建首个 RC 版本: $NEW_RC"
else
    # 提取基础版本号和 RC 号
    BASE_VERSION=$(echo "$LAST_RC" | sed 's/-rc\.[0-9]*$//')
    RC_NUM=$(echo "$LAST_RC" | grep -oP 'rc\.\K[0-9]+')
    NEW_RC_NUM=$((RC_NUM + 1))
    NEW_RC="${BASE_VERSION}-rc.${NEW_RC_NUM}"
    
    echo "📝 创建新 RC 版本: $NEW_RC"
    echo "   上一个版本：$LAST_RC"
fi

echo ""

# 获取最近的提交信息
LAST_COMMIT=$(git log -1 --pretty=%s)
echo "📋 最近提交：$LAST_COMMIT"
echo ""

# 创建 RC Tag
git tag -a "$NEW_RC" -m "XingJu $NEW_RC - Release Candidate $NEW_RC_NUM ✨ 自动创建"

# 推送 Tag
echo "📤 推送到 GitHub..."
if git push origin "$NEW_RC"; then
    echo "✅ 推送成功!"
    echo ""
    echo "📊 监控构建进度:"
    echo "   https://github.com/xfengyin/XingJu/actions"
    echo ""
    echo "⏰ 预计耗时：30-45 分钟"
    echo ""
    echo "🎯 下一步:"
    echo "   1. 等待 CI/CD 测试完成"
    echo "   2. Dev-Tester 验证结果"
    echo "   3. 测试通过后创建正式版本"
else
    echo "❌ 推送失败！请检查网络连接"
    exit 1
fi
