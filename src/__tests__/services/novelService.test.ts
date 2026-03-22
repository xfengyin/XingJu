/**
 * 小说服务测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchNovels,
  getNovelDetail,
  getChapters,
  getChapterContent,
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../../services/novelService';
import * as api from '../../services/api';

// Mock API module
vi.mock('../../services/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));

const mockGet = vi.mocked(api.get);
const mockPost = vi.mocked(api.post);

describe('Novel Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchNovels', () => {
    it('should search novels with keyword', async () => {
      const mockResult = {
        novels: [{ id: '1', title: 'Test Novel' }],
        total: 1,
        page: 1,
        pageSize: 20,
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockResult,
        error: null,
        status: 200,
      });

      const result = await searchNovels({ keyword: 'test' });

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('keyword=test')
      );
      expect(result.data).toEqual(mockResult);
    });

    it('should search novels with tags', async () => {
      const mockResult = {
        novels: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockResult,
        error: null,
        status: 200,
      });

      const result = await searchNovels({ tags: ['玄幻', '仙侠'] });

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('tags=%E7%8E%84%E5%B9%BB%2C%E4%BB%99%E4%BE%A0')
      );
    });

    it('should search novels with status filter', async () => {
      const mockResult = {
        novels: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockResult,
        error: null,
        status: 200,
      });

      const result = await searchNovels({ status: 'completed' });

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('status=completed')
      );
    });

    it('should use default pagination', async () => {
      const mockResult = {
        novels: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockResult,
        error: null,
        status: 200,
      });

      await searchNovels({});

      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('page=1')
      );
      expect(mockGet).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=20')
      );
    });
  });

  describe('getNovelDetail', () => {
    it('should get novel detail by id', async () => {
      const mockNovel = {
        id: '1',
        title: 'Test Novel',
        author: 'Author',
        cover: 'cover.jpg',
        description: 'Description',
        tags: ['玄幻'],
        wordCount: 100000,
        chapterCount: 100,
        status: 'ongoing' as const,
        updatedAt: '2024-01-01',
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockNovel,
        error: null,
        status: 200,
      });

      const result = await getNovelDetail('1');

      expect(mockGet).toHaveBeenCalledWith('/novels/1');
      expect(result.data).toEqual(mockNovel);
    });
  });

  describe('getChapters', () => {
    it('should get chapters for a novel', async () => {
      const mockChapters = [
        { id: '1', title: 'Chapter 1', order: 1 },
        { id: '2', title: 'Chapter 2', order: 2 },
      ];
      
      mockGet.mockResolvedValueOnce({
        data: mockChapters,
        error: null,
        status: 200,
      });

      const result = await getChapters('novel-1');

      expect(mockGet).toHaveBeenCalledWith('/novels/novel-1/chapters');
      expect(result.data).toEqual(mockChapters);
    });
  });

  describe('getChapterContent', () => {
    it('should get chapter content', async () => {
      const mockChapter = {
        id: 'chapter-1',
        novelId: 'novel-1',
        title: 'Chapter 1',
        content: 'Chapter content...',
        wordCount: 3000,
        order: 1,
      };
      
      mockGet.mockResolvedValueOnce({
        data: mockChapter,
        error: null,
        status: 200,
      });

      const result = await getChapterContent('novel-1', 'chapter-1');

      expect(mockGet).toHaveBeenCalledWith('/novels/novel-1/chapters/chapter-1');
      expect(result.data).toEqual(mockChapter);
    });
  });

  describe('Favorites', () => {
    it('should add a favorite', async () => {
      mockPost.mockResolvedValueOnce({
        data: { success: true },
        error: null,
        status: 200,
      });

      const result = await addFavorite('novel-1');

      expect(mockPost).toHaveBeenCalledWith('/favorites', { novelId: 'novel-1' });
      expect(result.data?.success).toBe(true);
    });

    it('should get favorites list', async () => {
      const mockFavorites = [
        { id: '1', title: 'Favorite 1' },
        { id: '2', title: 'Favorite 2' },
      ];
      
      mockGet.mockResolvedValueOnce({
        data: mockFavorites,
        error: null,
        status: 200,
      });

      const result = await getFavorites();

      expect(mockGet).toHaveBeenCalledWith('/favorites');
      expect(result.data).toEqual(mockFavorites);
    });

    it('should remove a favorite', async () => {
      mockPost.mockResolvedValueOnce({
        data: { success: true },
        error: null,
        status: 200,
      });

      const result = await removeFavorite('novel-1');

      expect(mockPost).toHaveBeenCalledWith('/favorites/novel-1/remove', {});
      expect(result.data?.success).toBe(true);
    });
  });
});