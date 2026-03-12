#!/bin/bash

# XingJu v2.0 - 多平台构建脚本
# 使用 Docker 在本地构建所有平台

set -e

echo "🚀 XingJu v2.0 - 多平台构建脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        echo "请先安装 Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker 已安装${NC}"
}

# 创建构建目录
setup_dirs() {
    echo "📁 创建构建目录..."
    mkdir -p build-output
    mkdir -p build-output/windows
    mkdir -p build-output/linux
    mkdir -p build-output/macos
}

# 构建 Linux 版本
build_linux() {
    echo ""
    echo -e "${YELLOW}🐧 构建 Linux 版本...${NC}"
    
    docker run --rm \
        -v "$(pwd)":/workspace \
        -w /workspace \
        rust:1.85-slim-bookworm \
        bash -c "
            apt-get update && apt-get install -y \
                curl \
                libwebkit2gtk-4.0-dev \
                libgtk-3-dev \
                libayatana-appindicator3-dev \
                librsvg2-dev \
                libxdo-dev \
                libssl-dev && \
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
            apt-get install -y nodejs && \
            npm ci && \
            npm run tauri build
        "
    
    echo -e "${GREEN}✅ Linux 构建完成${NC}"
}

# 构建说明
show_instructions() {
    echo ""
    echo "================================"
    echo -e "${GREEN}✅ 构建配置完成!${NC}"
    echo ""
    echo "📋 下一步操作:"
    echo ""
    echo "1. 推送 Tag 触发自动构建:"
    echo -e "   ${YELLOW}git tag -a v2.0.0 -m 'Release v2.0.0'${NC}"
    echo -e "   ${YELLOW}git push origin v2.0.0${NC}"
    echo ""
    echo "2. 查看构建进度:"
    echo -e "   ${YELLOW}https://github.com/xfengyin/XingJu/actions${NC}"
    echo ""
    echo "3. 下载构建产物:"
    echo -e "   ${YELLOW}https://github.com/xfengyin/XingJu/releases/tag/v2.0.0${NC}"
    echo ""
    echo "📖 详细文档:"
    echo -e "   ${YELLOW}CI-CD-SETUP.md${NC}"
    echo ""
}

# 主流程
main() {
    check_docker
    setup_dirs
    
    echo ""
    echo "================================"
    echo "⚠️  注意:"
    echo "================================"
    echo ""
    echo "完整的多平台构建建议使用 GitHub Actions:"
    echo "- Windows: 需要 Windows 环境"
    echo "- macOS: 需要 macOS 环境"
    echo "- Linux: 可以本地构建"
    echo ""
    echo "GitHub Actions 会自动在云端构建所有平台并创建 Release"
    echo ""
    
    show_instructions
}

main "$@"
