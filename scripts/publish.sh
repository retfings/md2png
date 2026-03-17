#!/bin/bash
# 快速发布脚本

set -e

echo "=== md2png 发布脚本 ==="
echo ""

# 检查 git remote
if ! git remote get-url origin &> /dev/null; then
    echo "1. 添加 GitHub 远程仓库..."
    git remote add origin https://github.com/retfings/md2png.git
else
    echo "✓ GitHub remote 已配置"
fi

# 检查 npm 登录
echo ""
echo "2. 检查 npm 登录状态..."
if npm whoami &> /dev/null; then
    echo "✓ npm 已登录"
else
    echo "✗ 请先登录 npm: npm login"
    exit 1
fi

# 推送到 GitHub
echo ""
echo "3. 推送到 GitHub..."
git push -u origin main

# 发布到 npm
echo ""
echo "4. 发布到 npm..."
cd packages/md2png
npm publish --access public

echo ""
echo "=== 发布完成 ==="
echo "GitHub: https://github.com/retfings/md2png"
echo "npm: https://www.npmjs.com/package/@retfings/md2png"
