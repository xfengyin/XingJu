import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, List, Settings, Maximize2, Minimize2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════════════════════════════════════════

interface MangaPage {
  id: string;
  url: string;
  thumbnail?: string;
}

interface MangaChapter {
  id: string;
  title: string;
  pages: MangaPage[];
}

interface MangaReaderProps {
  chapters: MangaChapter[];
  currentChapterIndex: number;
  onPageChange?: (pageIndex: number) => void;
  onChapterChange?: (chapterIndex: number) => void;
  onBack?: () => void;
  initialPage?: number;
  initialMode?: 'scroll' | 'page';
}

type ReadingMode = 'scroll' | 'page';

// ═══════════════════════════════════════════════════════════════════════════════
// 图片缓存管理器
// ═══════════════════════════════════════════════════════════════════════════════

class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50;

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const imageCache = new ImageCache();

// ═══════════════════════════════════════════════════════════════════════════════
// Linear 设计系统样式
// ═══════════════════════════════════════════════════════════════════════════════

const linearStyles = {
  container: `
    relative w-full h-full bg-[#fafafa] overflow-hidden
    font-sans text-[#1a1a1a]
  `,
  header: `
    fixed top-0 left-0 right-0 z-50
    bg-[#fafafa]/95
    backdrop-blur-sm border-b border-[#ededed]
  `,
  controls: `
    fixed bottom-0 left-0 right-0 z-50
    bg-[#fafafa]/95
    backdrop-blur-sm border-t border-[#ededed]
  `,
  button: `
    px-4 py-2 
    bg-white border border-[#e5e5e5]
    text-[#1a1a1a] text-[13px] font-medium
    hover:bg-[#f5f6f7] hover:border-[#d0d0d2]
    active:scale-[0.98]
    transition-all duration-150
    rounded-[6px]
  `,
  buttonDisabled: `
    px-4 py-2 
    bg-[#f5f6f7] border border-[#e5e5e5]
    text-[#b0b4ba] text-[13px] font-medium
    cursor-not-allowed
    transition-all duration-150
    rounded-[6px]
  `,
  progressBar: `
    h-[2px] bg-[#5e6ad2]
  `,
  pageNumber: `
    px-3 py-1 
    bg-white border border-[#e5e5e5]
    text-[#62666d] text-[13px] font-mono
    rounded-[4px]
  `,
  loadingSpinner: `
    w-8 h-8 border-2 border-[#e5e5e5] border-t-[#5e6ad2]
    rounded-full animate-spin
  `,
};

// ═══════════════════════════════════════════════════════════════════════════════
// 图片组件（带懒加载和缓存）
// ═══════════════════════════════════════════════════════════════════════════════

interface MangaImageProps {
  page: MangaPage;
  index: number;
  isVisible: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  readingMode: ReadingMode;
}

const MangaImage: React.FC<MangaImageProps> = React.memo(({
  page,
  index,
  isVisible,
  onLoad,
  onClick,
  readingMode,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // 检查缓存
    if (imageCache.has(page.url)) {
      setImageSrc(imageCache.get(page.url) || null);
      setIsLoading(false);
      return;
    }

    // 加载图片
    const img = new Image();
    img.onload = () => {
      imageCache.set(page.url, page.url);
      setImageSrc(page.url);
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = page.url;
  }, [isVisible, page.url, onLoad]);

  if (!isVisible && readingMode === 'page') {
    return null;
  }

  return (
    <div 
      className={`
        relative flex items-center justify-center
        ${readingMode === 'scroll' ? 'min-h-[80vh] w-full' : 'w-full h-full'}
      `}
      onClick={onClick}
    >
      {/* 加载动画 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]">
          <div className="flex flex-col items-center gap-3">
            <div className={linearStyles.loadingSpinner} />
            <span className="text-[#8a8f98] text-xs">
              {String(index + 1).padStart(3, '0')}
            </span>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]">
          <div className="flex flex-col items-center gap-2 text-[#ef4444]">
            <span className="text-3xl">⚠</span>
            <span className="text-sm">加载失败</span>
            <span className="text-xs text-[#8a8f98]">{page.url}</span>
          </div>
        </div>
      )}

      {/* 图片 */}
      {imageSrc && !hasError && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={`Page ${index + 1}`}
          className={`
            max-w-full max-h-full object-contain
            transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${readingMode === 'page' ? 'cursor-zoom-in' : ''}
          `}
          loading="lazy"
        />
      )}

      {/* 页码标记 */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <span className={linearStyles.pageNumber}>
            {String(index + 1).padStart(3, '0')}
          </span>
        </div>
      )}
    </div>
  );
});

MangaImage.displayName = 'MangaImage';

// ═══════════════════════════════════════════════════════════════════════════════
// 主组件
// ═══════════════════════════════════════════════════════════════════════════════

export const MangaReader: React.FC<MangaReaderProps> = ({
  chapters,
  currentChapterIndex,
  onPageChange,
  onChapterChange,
  onBack,
  initialPage = 0,
  initialMode = 'scroll',
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // State
  // ═══════════════════════════════════════════════════════════════════════════
  
  const [readingMode, setReadingMode] = useState<ReadingMode>(initialMode);
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const currentChapter = chapters[currentChapterIndex];
  const totalPages = currentChapter?.pages.length || 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // 计算可见页面（懒加载）
  // ═══════════════════════════════════════════════════════════════════════════

  const visiblePages = useMemo(() => {
    if (readingMode === 'page') {
      // 翻页模式：当前页 + 前后各1页预加载
      const start = Math.max(0, currentPageIndex - 1);
      const end = Math.min(totalPages, currentPageIndex + 2);
      const pages = new Set<number>();
      for (let i = start; i < end; i++) {
        pages.add(i);
      }
      return pages;
    } else {
      // 滚动模式：基于已加载的页面
      return loadedPagesRef.current;
    }
  }, [readingMode, currentPageIndex, totalPages]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 页面导航
  // ═══════════════════════════════════════════════════════════════════════════

  const goToPage = useCallback((index: number) => {
    if (index < 0 || index >= totalPages) return;
    setCurrentPageIndex(index);
    onPageChange?.(index);
    
    if (readingMode === 'scroll' && scrollContainerRef.current) {
      const pageElement = scrollContainerRef.current.children[index] as HTMLElement;
      pageElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [totalPages, onPageChange, readingMode]);

  const nextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      goToPage(currentPageIndex + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      // 下一话
      onChapterChange?.(currentChapterIndex + 1);
      setCurrentPageIndex(0);
    }
  }, [currentPageIndex, totalPages, currentChapterIndex, chapters.length, goToPage, onChapterChange]);

  const prevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    } else if (currentChapterIndex > 0) {
      // 上一话
      onChapterChange?.(currentChapterIndex - 1);
      const prevChapter = chapters[currentChapterIndex - 1];
      setCurrentPageIndex(prevChapter.pages.length - 1);
    }
  }, [currentPageIndex, currentChapterIndex, chapters, goToPage, onChapterChange]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 手势支持
  // ═══════════════════════════════════════════════════════════════════════════

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (readingMode !== 'page') return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, [readingMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (readingMode !== 'page' || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // 水平滑动阈值
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 500) {
      if (deltaX > 0) {
        prevPage();
      } else {
        nextPage();
      }
    }

    touchStartRef.current = null;
  }, [readingMode, nextPage, prevPage]);

  // 键盘支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          nextPage();
          break;
        case 'Home':
          goToPage(0);
          break;
        case 'End':
          goToPage(totalPages - 1);
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onBack?.();
          }
          break;
        case 'm':
        case 'M':
          setReadingMode(prev => prev === 'scroll' ? 'page' : 'scroll');
          break;
        case 'f':
        case 'F':
          setIsFullscreen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPage, nextPage, goToPage, totalPages, isFullscreen, onBack]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 滚动模式：追踪当前页面
  // ═══════════════════════════════════════════════════════════════════════════

  const handleScroll = useCallback(() => {
    if (readingMode !== 'scroll' || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    // 计算当前可见页面
    const children = Array.from(container.children);
    let currentVisiblePage = 0;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const rect = child.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      if (rect.top < containerRect.top + containerHeight / 2) {
        currentVisiblePage = i;
      }
    }

    // 标记已加载页面
    loadedPagesRef.current.add(currentVisiblePage);
    if (currentVisiblePage > 0) loadedPagesRef.current.add(currentVisiblePage - 1);
    if (currentVisiblePage < totalPages - 1) loadedPagesRef.current.add(currentVisiblePage + 1);

    if (currentVisiblePage !== currentPageIndex) {
      setCurrentPageIndex(currentVisiblePage);
      onPageChange?.(currentVisiblePage);
    }
  }, [readingMode, currentPageIndex, totalPages, onPageChange]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 控制栏自动隐藏
  // ═══════════════════════════════════════════════════════════════════════════

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (readingMode === 'page') {
        setShowControls(false);
      }
    }, 3000);
  }, [readingMode]);

  useEffect(() => {
    if (readingMode === 'page') {
      showControlsTemporarily();
    } else {
      setShowControls(true);
    }
  }, [readingMode, showControlsTemporarily]);

  // ═══════════════════════════════════════════════════════════════════════════
  // 全屏模式
  // ═══════════════════════════════════════════════════════════════════════════

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 页面加载回调
  // ═══════════════════════════════════════════════════════════════════════════

  const handlePageLoad = useCallback((index: number) => {
    loadedPagesRef.current.add(index);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // 渲染
  // ═══════════════════════════════════════════════════════════════════════════

  if (!currentChapter) {
    return (
      <div className={linearStyles.container}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <span className="text-[#ef4444] text-sm">未找到章节</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`
        ${linearStyles.container}
        ${isFullscreen ? 'fixed inset-0 z-50' : ''}
      `}
      onMouseMove={showControlsTemporarily}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ════════════════════════════════════════════════════════════════════════
          顶部控制栏
          ════════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`
          ${linearStyles.header}
          transform transition-transform duration-300
          ${showControls ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* 返回按钮 + 标题 */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={linearStyles.button}
              aria-label="返回"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span 
                className="text-base font-medium text-[#1a1a1a] tracking-tight"
                style={{ fontFeatureSettings: "'cv01', 'ss03'" }}
              >
                {currentChapter.title}
              </span>
              <span className="text-xs text-[#8a8f98]">
                第{currentChapterIndex + 1}话
              </span>
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            {/* 阅读模式切换 */}
            <button
              onClick={() => setReadingMode(prev => prev === 'scroll' ? 'page' : 'scroll')}
              className={linearStyles.button}
              title={readingMode === 'scroll' ? '切换到翻页模式' : '切换到滚动模式'}
            >
              {readingMode === 'scroll' ? (
                <List className="w-5 h-5" />
              ) : (
                <List className="w-5 h-5 rotate-90" />
              )}
            </button>

            {/* 全屏 */}
            <button
              onClick={toggleFullscreen}
              className={linearStyles.button}
              title={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-1 bg-[#fafafa]">
          <div 
            className={linearStyles.progressBar}
            style={{ width: `${((currentPageIndex + 1) / totalPages) * 100}%` }}
          />
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          内容区域
          ════════════════════════════════════════════════════════════════════════ */}
      <main 
        className={`
          w-full h-full pt-16 pb-20
          ${readingMode === 'scroll' ? 'overflow-y-auto' : 'overflow-hidden'}
        `}
        ref={scrollContainerRef}
        onScroll={readingMode === 'scroll' ? handleScroll : undefined}
      >
        {readingMode === 'scroll' ? (
          // 滚动模式
          currentChapter.pages.map((page, index) => (
            <MangaImage
              key={page.id}
              page={page}
              index={index}
              isVisible={index < 3 || visiblePages.has(index)}
              onLoad={() => handlePageLoad(index)}
              readingMode="scroll"
            />
          ))
        ) : (
          // 翻页模式
          <div className="w-full h-full flex items-center justify-center">
            {currentChapter.pages[currentPageIndex] && (
              <MangaImage
                key={`${currentChapter.pages[currentPageIndex].id}-${currentPageIndex}`}
                page={currentChapter.pages[currentPageIndex]}
                index={currentPageIndex}
                isVisible={true}
                readingMode="page"
                onClick={() => setShowControls(prev => !prev)}
              />
            )}
          </div>
        )}

        {/* 翻页模式：左右点击区域 */}
        {readingMode === 'page' && (
          <div className="absolute inset-0 flex pointer-events-none">
            <div 
              className="w-1/3 h-full cursor-pointer pointer-events-auto"
              onClick={prevPage}
            />
            <div 
              className="w-1/3 h-full pointer-events-auto"
              onClick={() => setShowControls(prev => !prev)}
            />
            <div 
              className="w-1/3 h-full cursor-pointer pointer-events-auto"
              onClick={nextPage}
            />
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════════════════
          底部控制栏
          ════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className={`
          ${linearStyles.controls}
          transform transition-transform duration-300
          ${showControls ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          {/* 上一话 */}
          <button
            onClick={() => {
              if (currentChapterIndex > 0) {
                onChapterChange?.(currentChapterIndex - 1);
                setCurrentPageIndex(0);
              }
            }}
            disabled={currentChapterIndex === 0}
            className={currentChapterIndex === 0 ? linearStyles.buttonDisabled : linearStyles.button}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一话
          </button>

          {/* 上一页 */}
          <button
            onClick={prevPage}
            disabled={currentPageIndex === 0 && currentChapterIndex === 0}
            className={currentPageIndex === 0 && currentChapterIndex === 0 ? linearStyles.buttonDisabled : linearStyles.button}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 页码显示 */}
          <div className="flex items-center gap-2">
            <span className={linearStyles.pageNumber}>
              {String(currentPageIndex + 1).padStart(3, '0')}
            </span>
            <span className="text-gray-500">/</span>
            <span className={linearStyles.pageNumber}>
              {String(totalPages).padStart(3, '0')}
            </span>
          </div>

          {/* 下一页 */}
          <button
            onClick={nextPage}
            disabled={currentPageIndex === totalPages - 1 && currentChapterIndex === chapters.length - 1}
            className={currentPageIndex === totalPages - 1 && currentChapterIndex === chapters.length - 1 ? linearStyles.buttonDisabled : linearStyles.button}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* 下一话 */}
          <button
            onClick={() => {
              if (currentChapterIndex < chapters.length - 1) {
                onChapterChange?.(currentChapterIndex + 1);
                setCurrentPageIndex(0);
              }
            }}
            disabled={currentChapterIndex === chapters.length - 1}
            className={currentChapterIndex === chapters.length - 1 ? linearStyles.buttonDisabled : linearStyles.button}
          >
            下一话
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* 页面快速导航 */}
        <div className="px-4 pb-3">
          <input
            type="range"
            min={0}
            max={totalPages - 1}
            value={currentPageIndex}
            onChange={(e) => goToPage(parseInt(e.target.value))}
            className="w-full h-2 bg-[#ededed] rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:bg-[#5e6ad2]
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:hover:bg-[#828fff]"
          />
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════════════
          动画样式
          ════════════════════════════════════════════════════════════════════════ */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MangaReader;