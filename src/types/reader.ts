/**
 * 阅读器公共类型定义
 * Reader Common Type Definitions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 漫画阅读器类型
// ═══════════════════════════════════════════════════════════════════════════════

/** 漫画页面 */
export interface MangaPage {
  id: string;
  url: string;
  thumbnail?: string;
}

/** 漫画章节 */
export interface MangaChapter {
  id: string;
  title: string;
  pages: MangaPage[];
}

/** 漫画阅读器属性 */
export interface MangaReaderProps {
  chapters: MangaChapter[];
  currentChapterIndex: number;
  onPageChange?: (pageIndex: number) => void;
  onChapterChange?: (chapterIndex: number) => void;
  onBack?: () => void;
  initialPage?: number;
  initialMode?: ReadingMode;
}

/** 阅读模式 */
export type ReadingMode = 'scroll' | 'page';

// ═══════════════════════════════════════════════════════════════════════════════
// 小说阅读器类型
// ═══════════════════════════════════════════════════════════════════════════════

/** 小说章节 */
export interface NovelChapter {
  id: string;
  title: string;
  content: string;
}

/** 阅读设置 */
export interface ReadingSettings {
  fontSize: number;
  backgroundColor: string;
  lineHeight: number;
}

/** 阅读进度 */
export interface ReadingProgress {
  chapterId: string;
  scrollPosition: number;
  lastReadTime: number;
}

/** 小说阅读器属性 */
export interface NovelReaderProps {
  chapters: NovelChapter[];
  initialChapterId?: string;
  onBack?: () => void;
  onChapterChange?: (chapterId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 通用类型
// ═══════════════════════════════════════════════════════════════════════════════

/** 存储键名常量 */
export const STORAGE_KEYS = {
  NOVEL_SETTINGS: 'novel_reader_settings',
  NOVEL_PROGRESS: 'novel_reader_progress',
  MANGA_SETTINGS: 'manga_reader_settings',
  MANGA_PROGRESS: 'manga_reader_progress',
} as const;

/** 背景颜色选项 */
export const BACKGROUND_COLORS = [
  { id: 'cyber-dark', label: '赛博黑', value: '#0a0a0f' },
  { id: 'neon-purple', label: '霓虹紫', value: '#1a0a2e' },
  { id: 'matrix-green', label: '矩阵绿', value: '#0a1a0f' },
  { id: 'circuit-blue', label: '电路蓝', value: '#0a0f1a' },
  { id: 'rust-orange', label: '锈迹橙', value: '#1a0f0a' },
] as const;

/** 字体大小范围 */
export const FONT_SIZE_RANGE = { min: 14, max: 28, step: 2 } as const;

/** 默认阅读设置 */
export const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  backgroundColor: BACKGROUND_COLORS[0].value,
  lineHeight: 1.8,
};

/** 键盘快捷键映射 */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

/** 图片缓存项 */
export interface ImageCacheItem {
  url: string;
  timestamp: number;
}

/** 懒加载配置 */
export interface LazyLoadConfig {
  threshold: number;
  rootMargin: string;
  preloadDistance: number;
}