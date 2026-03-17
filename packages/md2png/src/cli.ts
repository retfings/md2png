#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { loadConfig, batchConvert, resolveInputFiles, createExampleConfig, findConfigFile } from './utils.js';
import { DEFAULT_CONFIG } from './config.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const packageJson = JSON.parse(
  readFileSync(join(import.meta.dirname, '../package.json'), 'utf-8')
);

const program = new Command();

program
  .name('md2png')
  .description('Markdown 转图片工具 - 支持批量生成和自动分页')
  .version(packageJson.version);

program
  .argument('[files...]', '要转换的 Markdown 文件')
  .option('-c, --config <path>', '配置文件路径')
  .option('-o, --output <dir>', '输出目录', DEFAULT_CONFIG.outputDir)
  .option('-w, --width <number>', '图片宽度（像素）', String(DEFAULT_CONFIG.width))
  .option('-h, --max-height <number>', '每页最大高度（像素）', String(DEFAULT_CONFIG.maxHeight))
  .option('-f, --format <format>', '输出格式 (png|jpeg|webp)', DEFAULT_CONFIG.format)
  .option('-q, --quality <number>', '图片质量 (1-100)', String(DEFAULT_CONFIG.quality))
  .option('--bg <color>', '背景颜色', DEFAULT_CONFIG.backgroundColor)
  .option('--padding <number>', '内边距', String(DEFAULT_CONFIG.padding))
  .option('--dark', '启用暗色主题', false)
  .option('--no-line-numbers', '不显示行号')
  .option('--font-size <number>', '字体大小', String(DEFAULT_CONFIG.fontSize))
  .option('-d, --directory <dir>', '扫描目录（递归查找所有 .md 文件）')
  .option('-g, --glob <pattern>', 'Glob 模式匹配文件')
  .option('--init', '创建示例配置文件')
  .option('-v, --verbose', '显示详细信息')
  .option('--no-sandbox', '禁用 Puppeteer sandbox（某些环境需要）')
  .action(async (files, options) => {
    // 处理 --init 选项
    if (options.init) {
      const configPath = join(process.cwd(), 'md2png.config.json');
      await createExampleConfig(configPath);
      console.log(pc.green(`✓ 配置文件已创建：${configPath}`));
      console.log(pc.dim('  编辑此文件以自定义输出设置'));
      return;
    }

    // 查找并加载配置文件
    let config = await (async () => {
      if (options.config) {
        return loadConfig(options.config);
      }

      const foundConfig = await findConfigFile(process.cwd());
      if (foundConfig) {
        console.log(pc.dim(`使用配置文件：${foundConfig}`));
        return loadConfig(foundConfig);
      }

      return loadConfig();
    })();

    // 命令行选项覆盖配置文件
    config = {
      ...config,
      outputDir: options.output,
      width: parseInt(options.width, 10),
      maxHeight: parseInt(options.maxHeight, 10),
      format: options.format as 'png' | 'jpeg' | 'webp',
      quality: parseInt(options.quality, 10),
      backgroundColor: options.bg,
      padding: parseInt(options.padding, 10),
      darkMode: options.dark || false,
      showLineNumbers: options.lineNumbers !== false,
      fontSize: parseInt(options.fontSize, 10),
    };

    // 解析输入文件
    const inputFiles = await resolveInputFiles(files, {
      directory: options.directory,
      glob: options.glob,
    });

    if (inputFiles.length === 0) {
      console.error(pc.red('错误：没有指定要转换的文件'));
      console.log('\n用法示例:');
      console.log(pc.dim('  md2png readme.md                    # 转换单个文件'));
      console.log(pc.dim('  md2png file1.md file2.md           # 转换多个文件'));
      console.log(pc.dim('  md2png -d ./docs                   # 转换目录下所有文件'));
      console.log(pc.dim('  md2png -g "src/**/*.md"            # 使用 glob 模式'));
      console.log(pc.dim('  md2png --init                      # 创建配置文件'));
      process.exit(1);
    }

    console.log(pc.cyan(`找到 ${inputFiles.length} 个文件待转换\n`));

    // 执行批量转换
    const result = await batchConvert(inputFiles, config, options.verbose);

    // 输出结果
    console.log('\n' + '='.repeat(50));
    console.log(pc.green(`成功：${result.success} 个文件`));

    if (result.failed > 0) {
      console.log(pc.red(`失败：${result.failed} 个文件`));
    }

    console.log(pc.blue(`生成 ${result.outputFiles.length} 张图片`));

    if (result.errors.length > 0 && options.verbose) {
      console.log('\n错误详情:');
      for (const { file, error } of result.errors) {
        console.log(pc.red(`  ${file}: ${error}`));
      }
    }

    if (result.outputFiles.length > 0 && options.verbose) {
      console.log('\n输出文件:');
      for (const file of result.outputFiles) {
        console.log(pc.green(`  ${file}`));
      }
    }

    console.log('='.repeat(50));
  });

program.parse();
