/**
 * XingJu 前端 API 服务层
 * 
 * 封装 Tauri commands 调用，提供类型安全的接口
 */

import { invoke } from '@tauri-apps/api/core'

// ============================================================================
// 类型定义
// ============================================================================

export interface MusicTrack {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  url: string
  cover: string
  source: string
}

export interface Video {
  id: string
  title: string
  duration: number
  url: string
  cover: string
  source: string
}

export interface Novel {
  id: string
  title: string
  author: string
  cover: string
  source: string
  chapters: number
  status: string
}

export interface Manga {
  id: string
  title: string
  author: string
  cover: string
  source: string
  chapters: number
  status: string
}

export interface HistoryRecord {
  id: number
  module: string
  title: string
  timestamp: number
  metadata: string
}

export interface FavoriteRecord {
  id: number
  module: string
  itemId: string
  title: string
  cover: string
  createdAt: number
}

export interface SearchParams {
  query: string
  source?: string
  limit?: number
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================================
// 历史记录 API
// ============================================================================

export async function getHistory(limit: number = 50): Promise<HistoryRecord[]> {
  return invoke<HistoryRecord[]>('get_history', { limit })
}

export async function addHistory(
  module: string,
  title: string,
  metadata: string = '{}'
): Promise<void> {
  return invoke('add_history', { module, title, metadata })
}

export async function clearHistory(): Promise<void> {
  return invoke('clear_history')
}

// ============================================================================
// 搜索 API
// ============================================================================

export async function searchMusic(params: SearchParams): Promise<MusicTrack[]> {
  const response = await invoke<ApiResponse<MusicTrack[]>>('search_music', { params })
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Search failed')
  }
  return response.data
}

export async function searchVideo(params: SearchParams): Promise<Video[]> {
  const response = await invoke<ApiResponse<Video[]>>('search_video', { params })
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Search failed')
  }
  return response.data
}

export async function searchNovel(params: SearchParams): Promise<Novel[]> {
  const response = await invoke<ApiResponse<Novel[]>>('search_novel', { params })
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Search failed')
  }
  return response.data
}

export async function searchManga(params: SearchParams): Promise<Manga[]> {
  const response = await invoke<ApiResponse<Manga[]>>('search_manga', { params })
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Search failed')
  }
  return response.data
}

// ============================================================================
// 收藏 API (预留)
// ============================================================================

export async function getFavorites(module?: string, limit: number = 50): Promise<FavoriteRecord[]> {
  // TODO: 实现 Tauri command
  return []
}

export async function addFavorite(
  module: string,
  itemId: string,
  title: string,
  cover: string = ''
): Promise<boolean> {
  // TODO: 实现 Tauri command
  return false
}

export async function removeFavorite(module: string, itemId: string): Promise<void> {
  // TODO: 实现 Tauri command
}

export async function isFavorited(module: string, itemId: string): Promise<boolean> {
  // TODO: 实现 Tauri command
  return false
}