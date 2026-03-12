#!/bin/bash

# XingJu v2.0 - 构建失败分析工具
# 用法：./scripts/analyze-build-failure.sh [RUN_ID]

set -e

echo "🔍 XingJu v2.0 - 构建失败分析"
echo "=============================="
echo ""

# 检查是否安装了 GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 需要安装 GitHub CLI (gh)"
    echo "安装：https://cli.github.com/"
    exit 1
fi

# 获取 RUN_ID
RUN_ID=$1
if [ -z "$RUN_ID" ]; then
    echo "📋 获取最新失败的构建..."
    RUN_ID=$(gh run list --status failure --limit 1 --json databaseId --jq '.[0].databaseId')
    
    if [ -z "$RUN_ID" ]; then
        echo "❌ 未找到失败的构建"
        exit 1
    fi
fi

echo "分析构建：$RUN_ID"
echo ""

# 下载日志
echo "📥 下载构建日志..."
gh run download "$RUN_ID" --name logs 2>/dev/null || {
    echo "⚠️ 无法下载日志，尝试在线查看"
    echo "🔗 https://github.com/xfengyin/XingJu/actions/runs/$RUN_ID"
    exit 1
}

echo "✅ 日志下载成功"
echo ""

# 分析错误
echo "🔍 分析错误日志..."
echo "=================="
echo ""

# 查找错误
ERROR_COUNT=$(grep -r "error:" logs/ 2>/dev/null | wc -l || echo "0")
echo "发现错误数：$ERROR_COUNT"
echo ""

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "关键错误:"
    echo "--------"
    grep -r "error:" logs/ | head -20
    echo ""
fi

# 查找警告
WARNING_COUNT=$(grep -r "warning:" logs/ 2>/dev/null | wc -l || echo "0")
echo "发现警告数：$WARNING_COUNT"
echo ""

# 常见错误诊断
echo "💡 常见错误诊断:"
echo "==============="
echo ""

if grep -q "libwebkit2gtk" logs/ -r 2>/dev/null; then
    echo "⚠️  WebKit2GTK 相关错误"
    echo "   可能原因：版本不匹配 (4.0 vs 4.1)"
    echo "   解决方案：使用 libwebkit2gtk-4.1-dev (Ubuntu 22.04)"
    echo ""
fi

if grep -q "apt-get.*failed" logs/ -r 2>/dev/null; then
    echo "⚠️  apt-get 安装失败"
    echo "   可能原因：包名错误或冲突"
    echo "   解决方案：检查 .github/workflows/ 中的依赖列表"
    echo ""
fi

if grep -q "out of memory" logs/ -r 2>/dev/null; then
    echo "⚠️  内存不足"
    echo "   解决方案：使用 runs-on: ubuntu-latest 或优化编译"
    echo ""
fi

if grep -q "cargo.*failed" logs/ -r 2>/dev/null; then
    echo "⚠️  Rust 编译错误"
    echo "   可能原因：代码错误或版本不兼容"
    echo "   解决方案：检查 Rust 版本和代码"
    echo ""
fi

# 生成修复建议
echo "📋 修复建议:"
echo "==========="
echo ""
echo "1. 查看完整日志："
echo "   https://github.com/xfengyin/XingJu/actions/runs/$RUN_ID"
echo ""
echo "2. 常见修复:"
echo "   - 修改 .github/workflows/ci-test.yml"
echo "   - 修改 .github/workflows/build-release.yml"
echo "   - 更新系统依赖版本"
echo ""
echo "3. 重新测试:"
echo "   git tag -a v2.0.0-rc.N -m 'Fixed build'"
echo "   git push origin v2.0.0-rc.N"
echo ""

# 清理
rm -rf logs/

echo "✅ 分析完成"
