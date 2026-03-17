# 发布指南

## 发布到 GitHub

```bash
# 1. 在 GitHub 上创建新仓库
# 访问 https://github.com/new 创建仓库 retfings/md2png

# 2. 添加远程仓库并推送
git remote add origin https://github.com/retfings/md2png.git
git push -u origin main
```

## 发布到 npm

### 首次发布

```bash
# 1. 登录 npm
npm login

# 2. 进入包目录
cd packages/md2png

# 3. 构建项目
npm run build

# 4. 发布（公开包）
npm publish --access public
```

### 更新版本

```bash
# 1. 更新版本号（选择以下其一）
npm version patch  # 1.0.0 -> 1.0.1 (bug 修复)
npm version minor  # 1.0.0 -> 1.1.0 (新功能)
npm version major  # 1.0.0 -> 2.0.0 (破坏性变更)

# 2. 推送标签和代码
git push origin main --tags

# 3. 发布到 npm
npm publish --access public
```

## 安装测试

```bash
# 全局安装
npm install -g @retfings/md2png

# 使用
md2png --help
md2png readme.md
```

## 注意事项

1. **npm 包名**: `@retfings/md2png` 是一个作用域包，需要 npm 账号
2. **权限**: 确保你有 `@retfings` 作用域的发布权限
3. **版本号**: 每次发布必须是新的版本号
4. **构建**: 发布前确保 `dist/` 目录已生成

## 故障排除

### 发布失败：权限不足
```bash
# 检查登录状态
npm whoami

# 重新登录
npm login
```

### 发布失败：包已存在
```bash
# 使用不同版本号
npm version patch
npm publish --access public
```

### 作用域包发布
```bash
# 确保设置正确的访问权限
npm publish --access public
```
