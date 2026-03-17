# 发布到 GitHub 和 npm 指南

## 当前状态

✅ 代码已准备就绪
✅ 已初始化 git 仓库
✅ 已提交初始版本
✅ 已登录 npm

---

## 步骤 1: 发布到 GitHub

在终端执行以下命令：

```bash
cd /root/code/jobs/2026/03/17/001

# 1. 在 GitHub 上创建新仓库
# 访问：https://github.com/new
# 仓库名：md2png
# 设为公开（Public）
# 不要初始化 README、.gitignore 或 license

# 2. 添加远程仓库并推送
git remote add origin https://github.com/retfings/md2png.git
git branch -M main
git push -u origin main
```

---

## 步骤 2: 发布到 npm

### 方法 A: 使用 npm CLI（需要 OTP）

```bash
# 1. 进入包目录
cd /root/code/jobs/2026/03/17/001/packages/md2png

# 2. 发布（会提示输入 2FA 验证码）
npm publish --access public

# 输入你手机/认证器上的 6 位验证码
```

### 方法 B: 使用 GitHub Actions 自动发布

1. 在 GitHub 仓库创建 `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm run build
        working-directory: packages/md2png

      - run: npm publish --access public
        working-directory: packages/md2png
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

2. 在 npm 生成 token:
   - 访问：https://www.npmjs.com/settings/retfings/tokens
   - 创建新 token（Automation 类型）
   - 复制到 GitHub Secrets: `Settings > Secrets and variables > Actions > New repository secret`
   - 名称：`NPM_TOKEN`

3. 创建 GitHub Release:
   - 访问：https://github.com/retfings/md2png/releases/new
   - 创建新标签（如 v1.0.0）
   - 发布后会自动触发 npm 发布

---

## 验证发布

### GitHub

```bash
# 验证远程仓库
git remote -v

# 查看提交历史
git log --oneline
```

### npm

访问：https://www.npmjs.com/package/@retfings/md2png

或者：

```bash
npm view @retfings/md2png
```

---

## 安装包使用

```bash
# 全局安装
npm install -g @retfings/md2png

# 使用
md2png --help
md2png readme.md -o output/
```

---

## 后续版本更新

```bash
# 1. 更新版本号
cd /root/code/jobs/2026/03/17/001/packages/md2png
npm version patch  # 或 minor / major

# 2. 提交并推送
git add package.json
git commit -m "chore: bump version to $(node -p \"require('./package.json').version\")"
git push origin main --tags

# 3. 发布到 npm
npm publish --access public

# 4. 创建 GitHub Release
# 访问：https://github.com/retfings/md2png/releases/new
```

---

## 常见问题

### Q: npm publish 报错 403 Forbidden
A: 确保你有 `@retfings` 作用域的发布权限
```bash
npm access grant read-write npm:retfings
```

### Q: 包名已被占用
A: 修改 `package.json` 中的包名，如 `@retfings/md2png-cli`

### Q: 发布后无法安装
A: 可能需要几分钟同步到所有镜像，稍等片刻

---

## 快速命令总结

```bash
# 一次性发布（如果你知道在做什么）
cd /root/code/jobs/2026/03/17/001
git remote add origin https://github.com/retfings/md2png.git
git push -u origin main

cd packages/md2png
npm publish --access public  # 输入 OTP 完成发布
```
