import { Md2PngConfig } from './config.js';
/**
 * Markdown 转换器核心逻辑
 */
export declare class MarkdownConverter {
    private browser;
    private config;
    constructor(config: Md2PngConfig);
    /**
     * 初始化浏览器
     */
    initialize(): Promise<void>;
    /**
     * 关闭浏览器
     */
    close(): Promise<void>;
    /**
     * 将 Markdown 转换为 HTML
     */
    private markdownToHtml;
    /**
     * 生成完整的 HTML 文档
     */
    private generateHtml;
    /**
     * 将 Markdown 转换为图片，支持自动分页
     */
    convertToImages(markdown: string, outputPath: string): Promise<string[]>;
}
//# sourceMappingURL=converter.d.ts.map