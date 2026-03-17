/**
 * 简单测试脚本
 */
import { MarkdownConverter } from '../src/converter.js';
import { DEFAULT_CONFIG } from '../src/config.js';

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

async function runTest() {
  console.log('开始测试 md2png 转换器...');

  const converter = new MarkdownConverter({
    ...DEFAULT_CONFIG,
    width: 800,
    maxHeight: 1000,
    format: 'png',
    outputDir: './test-output',
  });

  try {
    await converter.initialize();
    const outputs = await converter.convertToImages(testMarkdown, './test-output/test.png');

    console.log('测试完成！生成的文件:');
    for (const file of outputs) {
      console.log(`  - ${file}`);
    }
  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  } finally {
    await converter.close();
  }
}

runTest();
