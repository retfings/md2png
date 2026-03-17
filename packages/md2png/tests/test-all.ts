# md2png 测试脚本

/**
 * 测试 md2png 转换器的所有功能
 */
import { MarkdownConverter } from '../src/converter.js';
import { batchConvert, loadConfig } from '../src/utils.js';

const testMarkdown = `
# 测试文档

这是一个 **Markdown** 转图片的测试。

## 功能特性

- 支持批量转换
- 自动分页
- 多种输出格式

## 代码示例

\`\`\`typescript
function hello(name: string) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

## 引用

> 这是一段引用文字

## 表格

| 名称 | 值 |
|------|-----|
| A    | 1   |
| B    | 2   |

行内代码 \`const x = 10\` 测试。
`;

async function runTests() {
  console.log('=== md2png 功能测试 ===\n');

  // 测试 1: 基本 PNG 转换
  console.log('测试 1: 基本 PNG 转换');
  const converter1 = new MarkdownConverter({
    width: 800,
    maxHeight: 2000,
    format: 'png',
    outputDir: './test-output',
    quality: 90,
    backgroundColor: '#ffffff',
    padding: 40,
    darkMode: false,
    showLineNumbers: true,
    fontSize: 14,
  });

  try {
    await converter1.initialize();
    const outputs1 = await converter1.convertToImages(testMarkdown, './test-output/basic-test.png');
    console.log(`  ✓ 生成：${outputs1.join(', ')}\n`);
  } catch (error) {
    console.log(`  ✗ 失败：${error}\n`);
  } finally {
    await converter1.close();
  }

  // 测试 2: 暗色主题
  console.log('测试 2: 暗色主题');
  const converter2 = new MarkdownConverter({
    width: 800,
    maxHeight: 2000,
    format: 'png',
    outputDir: './test-output',
    quality: 90,
    backgroundColor: '#1a1a2e',
    padding: 40,
    darkMode: true,
    showLineNumbers: true,
    fontSize: 14,
  });

  try {
    await converter2.initialize();
    const outputs2 = await converter2.convertToImages(testMarkdown, './test-output/dark-test.png');
    console.log(`  ✓ 生成：${outputs2.join(', ')}\n`);
  } catch (error) {
    console.log(`  ✗ 失败：${error}\n`);
  } finally {
    await converter2.close();
  }

  // 测试 3: WebP 格式
  console.log('测试 3: WebP 格式');
  const converter3 = new MarkdownConverter({
    width: 800,
    maxHeight: 2000,
    format: 'webp',
    outputDir: './test-output',
    quality: 90,
    backgroundColor: '#ffffff',
    padding: 40,
    darkMode: false,
    showLineNumbers: true,
    fontSize: 14,
  });

  try {
    await converter3.initialize();
    const outputs3 = await converter3.convertToImages(testMarkdown, './test-output/webp-test.webp');
    console.log(`  ✓ 生成：${outputs3.join(', ')}\n`);
  } catch (error) {
    console.log(`  ✗ 失败：${error}\n`);
  } finally {
    await converter3.close();
  }

  // 测试 4: 自动分页
  const longMarkdown = testMarkdown.repeat(5);
  console.log('测试 4: 自动分页 (maxHeight=500)');
  const converter4 = new MarkdownConverter({
    width: 800,
    maxHeight: 500,
    format: 'png',
    outputDir: './test-output',
    quality: 90,
    backgroundColor: '#ffffff',
    padding: 40,
    darkMode: false,
    showLineNumbers: true,
    fontSize: 14,
  });

  try {
    await converter4.initialize();
    const outputs4 = await converter4.convertToImages(longMarkdown, './test-output/paged-test.png');
    console.log(`  ✓ 生成 ${outputs4.length} 页：${outputs4.join(', ')}\n`);
  } catch (error) {
    console.log(`  ✗ 失败：${error}\n`);
  } finally {
    await converter4.close();
  }

  console.log('=== 测试完成 ===');
}

runTests().catch(console.error);
