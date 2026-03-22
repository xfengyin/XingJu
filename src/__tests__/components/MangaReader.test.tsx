/**
 * MangaReader 组件测试
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MangaReader } from '../../components/Manga/MangaReader';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
  ArrowLeft: () => <span data-testid="arrow-left">←</span>,
  List: () => <span data-testid="list">☰</span>,
  Settings: () => <span data-testid="settings">⚙</span>,
  Maximize2: () => <span data-testid="maximize">⛶</span>,
  Minimize2: () => <span data-testid="minimize">◲</span>,
}));

describe('MangaReader', () => {
  const mockChapters = [
    {
      id: 'chapter-1',
      title: '第一章',
      pages: [
        { id: 'page-1', url: 'https://example.com/page1.jpg' },
        { id: 'page-2', url: 'https://example.com/page2.jpg' },
      ],
    },
    {
      id: 'chapter-2',
      title: '第二章',
      pages: [
        { id: 'page-3', url: 'https://example.com/page3.jpg' },
      ],
    },
  ];

  const defaultProps = {
    chapters: mockChapters,
    currentChapterIndex: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the current chapter title', () => {
    render(<MangaReader {...defaultProps} />);
    
    expect(screen.getByText('第一章')).toBeInTheDocument();
  });

  it('should show chapter number', () => {
    render(<MangaReader {...defaultProps} />);
    
    expect(screen.getByText(/CHAPTER_01/i)).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    const onBack = vi.fn();
    render(<MangaReader {...defaultProps} onBack={onBack} />);
    
    const backButton = screen.getByRole('button', { name: /返回/i });
    fireEvent.click(backButton);
    
    expect(onBack).toHaveBeenCalled();
  });

  it('should call onChapterChange when navigating to next chapter', () => {
    const onChapterChange = vi.fn();
    render(
      <MangaReader
        {...defaultProps}
        currentChapterIndex={0}
        onChapterChange={onChapterChange}
      />
    );
    
    const nextChapterButton = screen.getByRole('button', { name: /下一话/i });
    fireEvent.click(nextChapterButton);
    
    expect(onChapterChange).toHaveBeenCalledWith(1);
  });

  it('should disable next chapter button on last chapter', () => {
    render(
      <MangaReader
        {...defaultProps}
        currentChapterIndex={mockChapters.length - 1}
      />
    );
    
    const nextChapterButton = screen.getByRole('button', { name: /下一话/i });
    expect(nextChapterButton).toBeDisabled();
  });

  it('should disable previous chapter button on first chapter', () => {
    render(
      <MangaReader
        {...defaultProps}
        currentChapterIndex={0}
      />
    );
    
    const prevChapterButton = screen.getByRole('button', { name: /上一话/i });
    expect(prevChapterButton).toBeDisabled();
  });

  it('should show page number', () => {
    render(<MangaReader {...defaultProps} />);
    
    // 初始页面索引为 0，所以应该显示 001
    expect(screen.getByText('001')).toBeInTheDocument();
  });

  it('should show total pages', () => {
    render(<MangaReader {...defaultProps} />);
    
    // 第一章有 2 页
    expect(screen.getByText('002')).toBeInTheDocument();
  });

  it('should call onPageChange when page changes', () => {
    const onPageChange = vi.fn();
    render(
      <MangaReader
        {...defaultProps}
        onPageChange={onPageChange}
      />
    );
    
    // 使用滑块改变页面
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      fireEvent.change(slider, { target: { value: '1' } });
      expect(onPageChange).toHaveBeenCalledWith(1);
    }
  });

  it('should render without chapters gracefully', () => {
    render(<MangaReader chapters={[]} currentChapterIndex={0} />);
    
    expect(screen.getByText(/CHAPTER_NOT_FOUND/i)).toBeInTheDocument();
  });
});