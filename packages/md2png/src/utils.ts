import { readFile, writeFile, mkdir, access, constants } from 'node:fs/promises';
import { dirname, join, resolve, extname } from 'node:path';
import { glob } from 'glob';
import pc from 'picocolors';
import { Md2PngConfig, DEFAULT_CONFIG } from './config.js';
import { MarkdownConverter } from './converter.js';

/**
 * 查找配置文件
 */
export async function findConfigFile(searchPath: string): Promise<string | null> {
  const locations = [
    join(searchPath, 'md2png.config.json'),
    join(searchPath, '.md2pngrc.json'),
    join(searchPath, '../md2png.config.json'),
    join(searchPath, '../../md2png.config.json'),
  ];

  for (const location of locations) {
    try {
      await access(location, constants.F_OK);
      return location;
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * 加载配置文件
 */
export async function loadConfig(configPath?: string): Promise<Md2PngConfig> {
  let config: Partial<Md2PngConfig> = {};

  if (configPath) {
    try {
      const content = await readFile(configPath, 'utf-8');
      config = JSON.parse(content);
    } catch (error) {
      console.error(pc.red(`读取配置文件失败：${configPath}`));
      throw error;
    }
  }

  // 合并默认配置
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

/**
 * 保存配置到文件
 */
export async function saveConfig(config: Md2PngConfig, configPath: string): Promise<void> {
  const content = JSON.stringify(config, null, 2);
  await writeFile(configPath, content, 'utf-8');
}

/**
 * 解析输入模式，获取文件列表
 */
export async function resolveInputFiles(
  input: string | string[],
  options: { directory?: string; glob?: string }
): Promise<string[]> {
  const files: string[] = [];

  // 如果提供了 glob 模式
  if (options.glob) {
    const matches = await glob(options.glob, { nodir: true });
    files.push(...matches.filter(f => f.endsWith('.md')));
  }

  // 如果提供了目录
  if (options.directory) {
    // 将目录路径转换为绝对路径，确保 glob 能正确处理
    const absoluteDir = resolve(options.directory);

    // 检查目录是否存在
    try {
      await access(absoluteDir, constants.F_OK);
    } catch {
      console.error(pc.red(`错误：目录不存在 - ${absoluteDir}`));
      return files;
    }

    // Windows 上 glob 需要正斜杠路径
    const pattern = absoluteDir.replace(/\\/g, '/') + '/**/*.md';
    const dirFiles = await glob(pattern, { nodir: true });
    files.push(...dirFiles);
  }

  // 如果提供了具体文件
  if (Array.isArray(input) && input.length > 0) {
    for (const file of input) {
      try {
        await access(file, constants.F_OK);
        if (file.endsWith('.md')) {
          files.push(file);
        }
      } catch {
        console.warn(pc.yellow(`警告：文件不存在，已跳过：${file}`));
      }
    }
  }

  // 去重
  return [...new Set(files)];
}

/**
 * 批量转换结果
 */
export interface BatchResult {
  success: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
  outputFiles: string[];
}

/**
 * 批量转换 Markdown 文件
 */
export async function batchConvert(
  files: string[],
  config: Md2PngConfig,
  verbose: boolean = false
): Promise<BatchResult> {
  const result: BatchResult = {
    success: 0,
    failed: 0,
    errors: [],
    outputFiles: [],
  };

  const converter = new MarkdownConverter(config);

  try {
    await converter.initialize();

    // 确保输出目录存在
    await mkdir(config.outputDir, { recursive: true });

    for (const file of files) {
      const absolutePath = resolve(file);

      if (verbose) {
        console.log(pc.cyan(`处理：${absolutePath}`));
      }

      try {
        // 读取 Markdown 文件
        const markdown = await readFile(absolutePath, 'utf-8');

        // 生成输出文件名
        const baseName = join(
          config.outputDir,
          basenameWithoutExt(file)
        );

        // 转换
        const outputPaths = await converter.convertToImages(markdown, baseName);

        result.outputFiles.push(...outputPaths);
        result.success++;

        if (verbose) {
          console.log(pc.green(`✓ 生成：${outputPaths.join(', ')}`));
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          file: file,
          error: error instanceof Error ? error.message : String(error),
        });

        if (verbose) {
          console.error(pc.red(`✗ 失败：${file} - ${error}`));
        }
      }
    }
  } finally {
    await converter.close();
  }

  return result;
}

/**
 * 获取不带扩展名的文件名
 */
function basenameWithoutExt(filePath: string): string {
  const base = filePath.split('/').pop() || filePath;
  return base.replace(/\.[^/.]+$/, '');
}

/**
 * 创建示例配置文件
 */
export async function createExampleConfig(outputPath: string): Promise<void> {
  const exampleConfig: Md2PngConfig = {
    ...DEFAULT_CONFIG,
    darkMode: false,
  };

  await saveConfig(exampleConfig, outputPath);
}
