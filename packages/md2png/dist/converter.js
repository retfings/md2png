import puppeteer from 'puppeteer';
/**
 * Markdown 转换器核心逻辑
 */
export class MarkdownConverter {
    browser = null;
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * 初始化浏览器
     */
    async initialize() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }
    }
    /**
     * 关闭浏览器
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
    /**
     * 将 Markdown 转换为 HTML
     */
    markdownToHtml(markdown) {
        // 简单的 Markdown 解析器
        let html = markdown
            // 转义 HTML 特殊字符
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // 代码块
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block" data-lang="$1"><code>$2</code></pre>')
            // 行内代码
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            // 标题
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // 粗体和斜体
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // 链接
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // 图片
            .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
            // 引用
            .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
            // 无序列表
            .replace(/^\- (.*$)/gm, '<li>$1</li>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            // 有序列表
            .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
            // 段落
            .replace(/\n\n/g, '</p><p>')
            // 换行
            .replace(/\n/g, '<br />');
        return `<div class="markdown-body"><p>${html}</p></div>`;
    }
    /**
     * 生成完整的 HTML 文档
     */
    generateHtml(markdown) {
        const content = this.markdownToHtml(markdown);
        const isDark = this.config.darkMode;
        return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Preview</title>
  <style>
    :root {
      --bg-color: ${isDark ? '#1a1a2e' : this.config.backgroundColor};
      --text-color: ${isDark ? '#eaeaea' : '#333333'};
      --code-bg: ${isDark ? '#16213e' : '#f6f8fa'};
      --border-color: ${isDark ? '#3d3d5c' : '#e1e4e8'};
      --link-color: ${isDark ? '#58a6ff' : '#0366d6'};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      font-size: ${this.config.fontSize}px;
      line-height: 1.6;
      background-color: var(--bg-color);
      color: var(--text-color);
      padding: ${this.config.padding}px;
    }

    .markdown-body {
      max-width: ${this.config.width - this.config.padding * 2}px;
      margin: 0 auto;
    }

    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 { font-size: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }

    p {
      margin-top: 0;
      margin-bottom: 16px;
    }

    a {
      color: var(--link-color);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
      background-color: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }

    .inline-code {
      background-color: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }

    pre {
      background-color: var(--code-bg);
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 16px;
      border: 1px solid var(--border-color);
    }

    pre code {
      background-color: transparent;
      padding: 0;
      white-space: pre;
      display: block;
      overflow-x: auto;
    }

    blockquote {
      border-left: 4px solid var(--border-color);
      padding-left: 16px;
      margin-left: 0;
      color: ${isDark ? '#8b949e' : '#6a737d'};
    }

    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }

    li {
      margin-bottom: 4px;
    }

    li > ul, li > ol {
      margin-top: 4px;
      margin-bottom: 0;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }

    th, td {
      border: 1px solid var(--border-color);
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: var(--code-bg);
      font-weight: 600;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border-color);
      margin: 24px 0;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
    `.trim();
    }
    /**
     * 将 Markdown 转换为图片，支持自动分页
     */
    async convertToImages(markdown, outputPath) {
        if (!this.browser) {
            await this.initialize();
        }
        const page = await this.browser.newPage();
        const outputPaths = [];
        try {
            // 生成 HTML
            const html = this.generateHtml(markdown);
            await page.setContent(html, { waitUntil: 'networkidle0' });
            // 获取内容总高度
            const totalHeight = await page.evaluate(() => {
                return document.body.scrollHeight;
            });
            // 计算需要分成多少页
            const pagesNeeded = Math.ceil(totalHeight / this.config.maxHeight);
            for (let pageIndex = 0; pageIndex < pagesNeeded; pageIndex++) {
                const isLastPage = pageIndex === pagesNeeded - 1;
                // 如果是第一页，不需要滚动
                if (pageIndex > 0) {
                    await page.evaluate((scrollY) => {
                        window.scrollTo(0, scrollY);
                    }, pageIndex * this.config.maxHeight);
                    // 等待滚动完成
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // 计算裁剪区域
                const clip = {
                    x: 0,
                    y: pageIndex * this.config.maxHeight,
                    width: this.config.width,
                    height: isLastPage ? totalHeight - (pageIndex * this.config.maxHeight) : this.config.maxHeight,
                };
                // 生成输出文件名
                const ext = this.config.format === 'jpeg' ? 'jpg' : this.config.format;
                const outputFileName = pagesNeeded > 1
                    ? `${outputPath.replace(/\.[^.]+$/, '')}-${pageIndex + 1}.${ext}`
                    : `${outputPath.replace(/\.[^.]+$/, '')}.${ext}`;
                // 截图
                const screenshotOptions = {
                    path: outputFileName,
                    clip,
                    type: this.config.format,
                    omitBackground: false,
                };
                // quality 仅适用于 jpeg/webp
                if (this.config.format !== 'png') {
                    screenshotOptions.quality = this.config.quality;
                }
                await page.screenshot(screenshotOptions);
                outputPaths.push(outputFileName);
            }
            return outputPaths;
        }
        finally {
            await page.close();
        }
    }
}
//# sourceMappingURL=converter.js.map