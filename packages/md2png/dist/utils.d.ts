import { Md2PngConfig } from './config.js';
/**
 * 查找配置文件
 */
export declare function findConfigFile(searchPath: string): Promise<string | null>;
/**
 * 加载配置文件
 */
export declare function loadConfig(configPath?: string): Promise<Md2PngConfig>;
/**
 * 保存配置到文件
 */
export declare function saveConfig(config: Md2PngConfig, configPath: string): Promise<void>;
/**
 * 解析输入模式，获取文件列表
 */
export declare function resolveInputFiles(input: string | string[], options: {
    directory?: string;
    glob?: string;
}): Promise<string[]>;
/**
 * 批量转换结果
 */
export interface BatchResult {
    success: number;
    failed: number;
    errors: Array<{
        file: string;
        error: string;
    }>;
    outputFiles: string[];
}
/**
 * 批量转换 Markdown 文件
 */
export declare function batchConvert(files: string[], config: Md2PngConfig, verbose?: boolean): Promise<BatchResult>;
/**
 * 创建示例配置文件
 */
export declare function createExampleConfig(outputPath: string): Promise<void>;
//# sourceMappingURL=utils.d.ts.map