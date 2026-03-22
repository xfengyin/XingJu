/**
 * 存储工具函数
 * Storage Utility Functions
 */

import { STORAGE_KEYS, ReadingSettings, ReadingProgress } from '../types/reader';

// ═══════════════════════════════════════════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════════════════════════════════════════

interface StorageOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 通用存储函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 安全地从 localStorage 读取数据
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns 存储的值或默认值
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`[Storage] Failed to read "${key}":`, error);
    return defaultValue;
  }
}

/**
 * 安全地向 localStorage 写入数据
 * @param key 存储键名
 * @param value 要存储的值
 * @returns 是否成功
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to write "${key}":`, error);
    return false;
  }
}

/**
 * 从 localStorage 删除数据
 * @param key 存储键名
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to remove "${key}":`, error);
  }
}

/**
 * 清空所有阅读器相关的存储数据
 */
export function clearReaderStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 小说阅读器存储函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 获取小说阅读设置
 */
export function getNovelSettings(defaultSettings: ReadingSettings): ReadingSettings {
  return getStorageItem<ReadingSettings>(STORAGE_KEYS.NOVEL_SETTINGS, defaultSettings);
}

/**
 * 保存小说阅读设置
 */
export function saveNovelSettings(settings: ReadingSettings): boolean {
  return setStorageItem(STORAGE_KEYS.NOVEL_SETTINGS, settings);
}

/**
 * 获取小说阅读进度
 */
export function getNovelProgress(): ReadingProgress | null {
  return getStorageItem<ReadingProgress | null>(STORAGE_KEYS.NOVEL_PROGRESS, null);
}

/**
 * 保存小说阅读进度
 */
export function saveNovelProgress(progress: ReadingProgress): boolean {
  return setStorageItem(STORAGE_KEYS.NOVEL_PROGRESS, progress);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 漫画阅读器存储函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 漫画阅读设置接口
 */
export interface MangaSettings {
  readingMode: 'scroll' | 'page';
  showControls: boolean;
}

/**
 * 漫画阅读进度接口
 */
export interface MangaProgress {
  chapterId: string;
  pageIndex: number;
  lastReadTime: number;
}

/**
 * 获取漫画阅读设置
 */
export function getMangaSettings(defaultSettings: MangaSettings): MangaSettings {
  return getStorageItem<MangaSettings>(STORAGE_KEYS.MANGA_SETTINGS, defaultSettings);
}

/**
 * 保存漫画阅读设置
 */
export function saveMangaSettings(settings: MangaSettings): boolean {
  return setStorageItem(STORAGE_KEYS.MANGA_SETTINGS, settings);
}

/**
 * 获取漫画阅读进度
 */
export function getMangaProgress(): MangaProgress | null {
  return getStorageItem<MangaProgress | null>(STORAGE_KEYS.MANGA_PROGRESS, null);
}

/**
 * 保存漫画阅读进度
 */
export function saveMangaProgress(progress: MangaProgress): boolean {
  return setStorageItem(STORAGE_KEYS.MANGA_PROGRESS, progress);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 辅助函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 格式化阅读时间为可读字符串
 * @param timestamp 时间戳
 * @returns 格式化的时间字符串
 */
export function formatReadingTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 创建存储访问器对象
 * 提供更流畅的 API
 */
export function createStorageAccessor<T>(key: string, defaultValue: T) {
  return {
    get: (): T => getStorageItem(key, defaultValue),
    set: (value: T): boolean => setStorageItem(key, value),
    remove: (): void => removeStorageItem(key),
    reset: (): boolean => setStorageItem(key, defaultValue),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 默认导出
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearReaderStorage,
  getNovelSettings,
  saveNovelSettings,
  getNovelProgress,
  saveNovelProgress,
  getMangaSettings,
  saveMangaSettings,
  getMangaProgress,
  saveMangaProgress,
  formatReadingTime,
  createStorageAccessor,
};