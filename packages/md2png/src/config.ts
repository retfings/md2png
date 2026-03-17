/**
 * 配置文件类型定义
 */
export interface Md2PngConfig {
  /** 图片宽度（像素） */
  width: number;

  /** 每页最大高度（像素），超过此值自动生成第二张 */
  maxHeight: number;

  /** 输出格式 */
  format: 'png' | 'jpeg' | 'webp';

  /** 输出目录 */
  outputDir: string;

  /** PNG 质量 (1-100，仅 jpeg/webp 有效) */
  quality: number;

  /** 背景颜色 */
  backgroundColor: string;

  /** 内边距 */
  padding: number;

  /** 是否启用暗色主题 */
  darkMode: boolean;

  /** 自定义 CSS 文件路径 */
  customCss?: string;

  /** 是否显示行号 */
  showLineNumbers: boolean;

  /** 字体大小 */
  fontSize: number;
}

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: Md2PngConfig = {
  width: 800,
  maxHeight: 2000,
  format: 'png',
  outputDir: './output',
  quality: 90,
  backgroundColor: '#ffffff',
  padding: 40,
  darkMode: false,
  showLineNumbers: true,
  fontSize: 14,
};
