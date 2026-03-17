# md2png

Markdown 转图片 CLI 工具 - 支持批量生成和自动分页

## 功能特性

- 🚀 **快速转换** - 使用 Puppeteer 将 Markdown 渲染为高质量图片
- 📄 **自动分页** - 超长内容自动分割为多张图片
- 📦 **批量处理** - 支持目录扫描、glob 模式匹配
- ⚙️ **灵活配置** - JSON 配置文件或命令行选项
- 🎨 **多种格式** - 支持 PNG、JPEG、WebP 输出
- 🌙 **暗色主题** - 支持亮色/暗色模式切换
- 📝 **代码高亮** - 优雅的代码块样式

## 快速开始

### 安装依赖

```bash
npm install
```

### 基本用法

```bash
# 转换单个文件
npm run md2png -- readme.md

# 转换多个文件
npm run md2png -- file1.md file2.md file3.md

# 转换目录下所有 Markdown 文件
npm run md2png -- -d ./docs

# 使用 glob 模式
npm run md2png -- -g "src/**/*.md"

# 指定输出目录和格式
npm run md2png -- readme.md -o ./images -f png

# 创建配置文件
npm run md2png -- --init
```

### 直接使用 CLI

```bash
# 进入包目录
cd packages/md2png

# 开发模式
npm run start -- readme.md

# 或直接使用 tsx
npx tsx src/cli.ts readme.md
```

## 命令行选项

| 选项 | 简写 | 说明 | 默认值 |
|------|------|------|--------|
| `--config` | `-c` | 配置文件路径 | 自动查找 |
| `--output` | `-o` | 输出目录 | `./output` |
| `--width` | `-w` | 图片宽度（像素） | `800` |
| `--max-height` | `-h` | 每页最大高度 | `2000` |
| `--format` | `-f` | 输出格式 | `png` |
| `--quality` | `-q` | 图片质量 (1-100) | `90` |
| `--bg` | | 背景颜色 | `#ffffff` |
| `--padding` | | 内边距 | `40` |
| `--dark` | | 启用暗色主题 | `false` |
| `--no-line-numbers` | | 不显示行号 | `false` |
| `--font-size` | | 字体大小 | `14` |
| `--directory` | `-d` | 扫描目录 | - |
| `--glob` | `-g` | Glob 模式 | - |
| `--init` | | 创建配置文件 | - |
| `--verbose` | `-v` | 详细信息 | `false` |

## 配置文件

运行以下命令创建示例配置文件：

```bash
npm run md2png -- --init
```

生成的 `md2png.config.json` 文件内容如下：

```json
{
  "width": 800,
  "maxHeight": 2000,
  "format": "png",
  "outputDir": "./output",
  "quality": 90,
  "backgroundColor": "#ffffff",
  "padding": 40,
  "darkMode": false,
  "showLineNumbers": true,
  "fontSize": 14
}
```

### 配置项说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `width` | number | 输出图片宽度（像素） |
| `maxHeight` | number | 每页最大高度，超过此值会自动生成第二张图片 |
| `format` | string | 输出格式：`png`、`jpeg`、`webp` |
| `outputDir` | string | 输出目录路径 |
| `quality` | number | 图片质量 (1-100)，仅对 jpeg/webp 有效 |
| `backgroundColor` | string | 背景颜色（十六进制） |
| `padding` | number | 图片内边距（像素） |
| `darkMode` | boolean | 是否启用暗色主题 |
| `showLineNumbers` | boolean | 代码块是否显示行号 |
| `fontSize` | number | 字体大小（像素） |

## 使用场景

### 1. 批量转换文档

```bash
# 转换整个文档目录
npm run md2png -- -d ./docs -o ./docs-images -v

# 使用 glob 模式选择特定文件
npm run md2png -- -g "docs/guides/*.md" -o ./guides
```

### 2. 生成社交媒体图片

```bash
# 生成适合 Twitter 的宽图
npm run md2png -- tweet.md -w 1200 -h 628 -f png

# 生成 Instagram 故事尺寸
npm run md2png -- story.md -w 1080 -h 1920
```

### 3. 暗色主题输出

```bash
# 使用暗色主题
npm run md2png -- code.md --dark -o ./dark-images

# 或在配置文件中设置 "darkMode": true
```

### 4. 长文档自动分页

```bash
# 超长文档会自动分成多张图片
npm run md2png -- long-article.md -h 1500

# 输出：long-article-1.png, long-article-2.png, ...
```

## 项目结构

```
md2png-monorepo/
├── package.json                 # 根配置（workspace）
├── packages/
│   └── md2png/
│       ├── package.json         # 包配置
│       ├── tsconfig.json        # TypeScript 配置
│       ├── src/
│       │   ├── cli.ts           # CLI 入口
│       │   ├── index.ts         # 公共导出
│       │   ├── config.ts        # 配置类型
│       │   ├── converter.ts     # 转换核心逻辑
│       │   └── utils.ts         # 工具函数
│       ├── tests/
│       │   └── test.ts          # 测试脚本
│       └── md2png.config.example.json
```

## API 使用

也可以在代码中直接使用：

```typescript
import { MarkdownConverter, loadConfig } from 'md2png';

async function main() {
  const config = await loadConfig('./md2png.config.json');
  const converter = new MarkdownConverter(config);

  try {
    await converter.initialize();

    const markdown = '# Hello World\n\n这是内容...';
    const outputs = await converter.convertToImages(
      markdown,
      './output/image.png'
    );

    console.log('生成的文件:', outputs);
  } finally {
    await converter.close();
  }
}

main();
```

## 构建

```bash
# 编译 TypeScript
npm run build

# 类型检查
npm run typecheck

# 清理构建产物
npm run clean
```

## 系统要求

- Node.js >= 18.0.0
- 需要 Chromium（puppeteer 会自动下载）

## 常见问题

### Puppeteer 下载失败

在中国大陆地区，可能需要设置镜像：

```bash
export PUPPETEER_DOWNLOAD_HOST=https://npmmirror.com/mirrors
npm install
```

### 某些环境需要禁用 sandbox

```bash
npm run md2png -- readme.md --no-sandbox
```

### 生成的图片模糊

- 增加 `width` 和 `fontSize`
- 确保 `quality` 设置为较高值（90+）

## License

MIT
