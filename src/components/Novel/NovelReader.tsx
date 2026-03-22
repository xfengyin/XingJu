import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface ReadingSettings {
  fontSize: number;
  backgroundColor: string;
  lineHeight: number;
}

interface ReadingProgress {
  chapterId: string;
  scrollPosition: number;
  lastReadTime: number;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
  SETTINGS: 'novel_reader_settings',
  PROGRESS: 'novel_reader_progress',
} as const;

const BACKGROUND_COLORS = [
  { id: 'cyber-dark', label: '赛博黑', value: '#0a0a0f' },
  { id: 'neon-purple', label: '霓虹紫', value: '#1a0a2e' },
  { id: 'matrix-green', label: '矩阵绿', value: '#0a1a0f' },
  { id: 'circuit-blue', label: '电路蓝', value: '#0a0f1a' },
  { id: 'rust-orange', label: '锈迹橙', value: '#1a0f0a' },
] as const;

const FONT_SIZE_RANGE = { min: 14, max: 28, step: 2 } as const;

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  backgroundColor: BACKGROUND_COLORS[0].value,
  lineHeight: 1.8,
};

// ============================================================================
// Utility Functions
// ============================================================================

const parseChapterContent = (content: string): string[] => {
  return content.split('\n').filter(paragraph => paragraph.trim());
};

const formatReadingTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================================================
// Sub-Components
// ============================================================================

// Chapter Content Component
const ChapterContent: React.FC<{
  chapter: Chapter;
  settings: ReadingSettings;
}> = ({ chapter, settings }) => {
  const paragraphs = useMemo(() => parseChapterContent(chapter.content), [chapter.content]);

  return (
    <article className="chapter-content">
      <style>{`
        .chapter-content {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Chapter Title */}
      <h1 className="chapter-title">
        <span className="title-decorator">「</span>
        {chapter.title}
        <span className="title-decorator">」</span>
      </h1>

      {/* Chapter Body */}
      <div className="chapter-body">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="paragraph"
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
            }}
          >
            <span className="paragraph-indent">　　</span>
            {paragraph}
          </p>
        ))}
      </div>

      <style>{`
        .chapter-title {
          text-align: center;
          font-size: 1.5em;
          font-weight: 600;
          color: #00fff7;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 255, 247, 0.2);
          text-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
        }
        .title-decorator {
          color: #ff00ff;
          text-shadow: 0 0 8px rgba(255, 0, 255, 0.6);
        }
        .chapter-body {
          padding: 0 1rem;
        }
        .paragraph {
          margin-bottom: 1rem;
          color: #e0e0e0;
          text-align: justify;
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
        }
        .paragraph-indent {
          user-select: none;
        }
      `}</style>
    </article>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC<{
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ settings, onSettingsChange, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(
      FONT_SIZE_RANGE.min,
      Math.min(FONT_SIZE_RANGE.max, settings.fontSize + delta)
    );
    onSettingsChange({ ...settings, fontSize: newSize });
  };

  const handleBackgroundColorChange = (color: string) => {
    onSettingsChange({ ...settings, backgroundColor: color });
  };

  const handleLineHeightChange = (delta: number) => {
    const newHeight = Math.max(1.4, Math.min(2.4, settings.lineHeight + delta));
    onSettingsChange({ ...settings, lineHeight: parseFloat(newHeight.toFixed(1)) });
  };

  return (
    <div className="settings-panel-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>阅读设置</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          {/* Font Size */}
          <div className="setting-group">
            <label className="setting-label">字体大小</label>
            <div className="font-size-control">
              <button
                className="control-btn"
                onClick={() => handleFontSizeChange(-FONT_SIZE_RANGE.step)}
                disabled={settings.fontSize <= FONT_SIZE_RANGE.min}
              >
                A-
              </button>
              <span className="size-display">{settings.fontSize}px</span>
              <button
                className="control-btn"
                onClick={() => handleFontSizeChange(FONT_SIZE_RANGE.step)}
                disabled={settings.fontSize >= FONT_SIZE_RANGE.max}
              >
                A+
              </button>
            </div>
          </div>

          {/* Line Height */}
          <div className="setting-group">
            <label className="setting-label">行距</label>
            <div className="line-height-control">
              <button
                className="control-btn"
                onClick={() => handleLineHeightChange(-0.2)}
                disabled={settings.lineHeight <= 1.4}
              >
                紧凑
              </button>
              <span className="height-display">{settings.lineHeight}</span>
              <button
                className="control-btn"
                onClick={() => handleLineHeightChange(0.2)}
                disabled={settings.lineHeight >= 2.4}
              >
                宽松
              </button>
            </div>
          </div>

          {/* Background Color */}
          <div className="setting-group">
            <label className="setting-label">背景主题</label>
            <div className="color-options">
              {BACKGROUND_COLORS.map(color => (
                <button
                  key={color.id}
                  className={`color-option ${settings.backgroundColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleBackgroundColorChange(color.value)}
                  title={color.label}
                >
                  <span className="color-label">{color.label}</span>
                  {settings.backgroundColor === color.value && (
                    <span className="color-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .settings-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease-out;
          }
          .settings-panel {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(0, 255, 247, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            width: 90%;
            max-width: 400px;
            box-shadow: 
              0 0 20px rgba(0, 255, 247, 0.2),
              inset 0 0 20px rgba(0, 255, 247, 0.05);
            animation: slideUp 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(0, 255, 247, 0.2);
          }
          .settings-header h3 {
            margin: 0;
            color: #00fff7;
            font-size: 1.1rem;
            text-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
          }
          .close-btn {
            background: none;
            border: 1px solid rgba(255, 0, 255, 0.5);
            color: #ff00ff;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          }
          .close-btn:hover {
            background: rgba(255, 0, 255, 0.2);
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
          }
          .setting-group {
            margin-bottom: 1.5rem;
          }
          .setting-label {
            display: block;
            color: #a0a0a0;
            font-size: 0.85rem;
            margin-bottom: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .font-size-control,
          .line-height-control {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
          .control-btn {
            background: rgba(0, 255, 247, 0.1);
            border: 1px solid rgba(0, 255, 247, 0.3);
            color: #00fff7;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
          }
          .control-btn:hover:not(:disabled) {
            background: rgba(0, 255, 247, 0.2);
            box-shadow: 0 0 10px rgba(0, 255, 247, 0.3);
          }
          .control-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          .size-display,
          .height-display {
            color: #00fff7;
            font-family: monospace;
            font-size: 1rem;
            min-width: 50px;
            text-align: center;
          }
          .color-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
            gap: 0.75rem;
          }
          .color-option {
            position: relative;
            aspect-ratio: 1;
            border: 2px solid transparent;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .color-option:hover {
            transform: scale(1.05);
          }
          .color-option.active {
            border-color: #00fff7;
            box-shadow: 0 0 15px rgba(0, 255, 247, 0.5);
          }
          .color-label {
            font-size: 0.65rem;
            color: rgba(255, 255, 255, 0.7);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
          }
          .color-check {
            position: absolute;
            top: 4px;
            right: 4px;
            color: #00fff7;
            font-size: 0.8rem;
            text-shadow: 0 0 5px rgba(0, 255, 247, 0.8);
          }
        `}</style>
      </div>
    </div>
  );
};

// Chapter List Component
const ChapterList: React.FC<{
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}> = ({ chapters, currentChapterId, onSelectChapter, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="chapter-list-overlay" onClick={onClose}>
      <div className="chapter-list" onClick={e => e.stopPropagation()}>
        <div className="list-header">
          <h3>章节目录</h3>
          <span className="chapter-count">共 {chapters.length} 章</span>
        </div>
        
        <div className="list-content">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className={`chapter-item ${chapter.id === currentChapterId ? 'active' : ''}`}
              onClick={() => {
                onSelectChapter(chapter.id);
                onClose();
              }}
            >
              <span className="chapter-number">{String(index + 1).padStart(3, '0')}</span>
              <span className="chapter-title-text">{chapter.title}</span>
              {chapter.id === currentChapterId && (
                <span className="current-indicator">阅读中</span>
              )}
            </button>
          ))}
        </div>

        <style>{`
          .chapter-list-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            z-index: 1000;
            animation: fadeIn 0.2s ease-out;
          }
          .chapter-list {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 85%;
            max-width: 320px;
            background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
            border-right: 1px solid rgba(0, 255, 247, 0.3);
            box-shadow: 5px 0 30px rgba(0, 0, 0, 0.8);
            animation: slideInRight 0.3s ease-out;
            display: flex;
            flex-direction: column;
          }
          @keyframes slideInRight {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .list-header {
            padding: 1.25rem;
            border-bottom: 1px solid rgba(0, 255, 247, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .list-header h3 {
            margin: 0;
            color: #00fff7;
            font-size: 1.1rem;
            text-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
          }
          .chapter-count {
            color: #666;
            font-size: 0.8rem;
          }
          .list-content {
            flex: 1;
            overflow-y: auto;
            padding: 0.5rem 0;
          }
          .list-content::-webkit-scrollbar {
            width: 4px;
          }
          .list-content::-webkit-scrollbar-track {
            background: rgba(0, 255, 247, 0.05);
          }
          .list-content::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 247, 0.3);
            border-radius: 2px;
          }
          .chapter-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.875rem 1.25rem;
            background: none;
            border: none;
            border-left: 3px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }
          .chapter-item:hover {
            background: rgba(0, 255, 247, 0.05);
          }
          .chapter-item.active {
            background: rgba(0, 255, 247, 0.1);
            border-left-color: #00fff7;
          }
          .chapter-number {
            color: #666;
            font-family: monospace;
            font-size: 0.75rem;
            min-width: 2.5rem;
          }
          .chapter-title-text {
            flex: 1;
            color: #e0e0e0;
            font-size: 0.9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .chapter-item.active .chapter-title-text {
            color: #00fff7;
          }
          .current-indicator {
            font-size: 0.65rem;
            color: #ff00ff;
            background: rgba(255, 0, 255, 0.15);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            text-transform: uppercase;
          }
        `}</style>
      </div>
    </div>
  );
};

// Navigation Bar Component
const NavigationBar: React.FC<{
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onOpenSettings: () => void;
  onOpenChapterList: () => void;
  onBack: () => void;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  progress: number;
}> = ({
  onPrevChapter,
  onNextChapter,
  onOpenSettings,
  onOpenChapterList,
  onBack,
  hasPrevChapter,
  hasNextChapter,
  progress,
}) => {
  return (
    <nav className="reader-nav">
      {/* Top Bar */}
      <div className="nav-top">
        <button className="nav-btn back-btn" onClick={onBack} title="返回">
          <span className="btn-icon">←</span>
          <span className="btn-text">返回</span>
        </button>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <button className="nav-btn menu-btn" onClick={onOpenChapterList} title="目录">
          <span className="btn-icon">☰</span>
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="nav-bottom">
        <button
          className="nav-btn chapter-nav"
          onClick={onPrevChapter}
          disabled={!hasPrevChapter}
          title="上一章"
        >
          <span className="btn-icon">‹</span>
          <span className="btn-text">上一章</span>
        </button>
        
        <button className="nav-btn settings-btn" onClick={onOpenSettings} title="设置">
          <span className="btn-icon">⚙</span>
        </button>
        
        <button
          className="nav-btn chapter-nav"
          onClick={onNextChapter}
          disabled={!hasNextChapter}
          title="下一章"
        >
          <span className="btn-text">下一章</span>
          <span className="btn-icon">›</span>
        </button>
      </div>

      <style>{`
        .reader-nav {
          position: fixed;
          left: 0;
          right: 0;
          z-index: 100;
        }
        .nav-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0) 100%);
          backdrop-filter: blur(10px);
        }
        .nav-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0.75rem 1rem;
          padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          background: linear-gradient(0deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0) 100%);
          backdrop-filter: blur(10px);
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 255, 247, 0.1);
          border: 1px solid rgba(0, 255, 247, 0.3);
          color: #00fff7;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .nav-btn:hover:not(:disabled) {
          background: rgba(0, 255, 247, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 247, 0.4);
        }
        .nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-icon {
          font-size: 1.1rem;
        }
        .progress-bar {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin: 0 1rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00fff7, #ff00ff);
          border-radius: 2px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 255, 247, 0.5);
        }
        .chapter-nav {
          min-width: 100px;
          justify-content: center;
        }
        @media (max-width: 480px) {
          .btn-text {
            display: none;
          }
          .nav-btn {
            padding: 0.5rem 0.75rem;
          }
          .chapter-nav {
            min-width: auto;
          }
        }
      `}</style>
    </nav>
  );
};

// ============================================================================
// Main Component
// ============================================================================

interface NovelReaderProps {
  chapters: Chapter[];
  initialChapterId?: string;
  onBack?: () => void;
  onChapterChange?: (chapterId: string) => void;
}

export const NovelReader: React.FC<NovelReaderProps> = ({
  chapters,
  initialChapterId,
  onBack,
  onChapterChange,
}) => {
  // State
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Current chapter
  const currentChapter = chapters[currentChapterIndex];

  // Load settings and progress from storage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (savedProgress && !initialChapterId) {
        const progress: ReadingProgress = JSON.parse(savedProgress);
        const chapterIndex = chapters.findIndex(c => c.id === progress.chapterId);
        if (chapterIndex !== -1) {
          setCurrentChapterIndex(chapterIndex);
        }
      }
    } catch (error) {
      console.error('Failed to load settings/progress:', error);
    }
  }, [chapters, initialChapterId]);

  // Handle initial chapter
  useEffect(() => {
    if (initialChapterId) {
      const index = chapters.findIndex(c => c.id === initialChapterId);
      if (index !== -1) {
        setCurrentChapterIndex(index);
      }
    }
  }, [initialChapterId, chapters]);

  // Save settings to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  // Save progress to storage
  useEffect(() => {
    if (currentChapter) {
      try {
        const progress: ReadingProgress = {
          chapterId: currentChapter.id,
          scrollPosition: scrollProgress,
          lastReadTime: Date.now(),
        };
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  }, [currentChapter, scrollProgress]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handlers
  const handlePrevChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onChapterChange?.(chapters[newIndex].id);
    }
  }, [currentChapterIndex, chapters, onChapterChange]);

  const handleNextChapter = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1) {
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onChapterChange?.(chapters[newIndex].id);
    }
  }, [currentChapterIndex, chapters, onChapterChange]);

  const handleSelectChapter = useCallback((chapterId: string) => {
    const index = chapters.findIndex(c => c.id === chapterId);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onChapterChange?.(chapterId);
    }
  }, [chapters, onChapterChange]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  return (
    <div
      className="novel-reader"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Navigation */}
      <NavigationBar
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenChapterList={() => setIsChapterListOpen(true)}
        onBack={handleBack}
        hasPrevChapter={currentChapterIndex > 0}
        hasNextChapter={currentChapterIndex < chapters.length - 1}
        progress={scrollProgress}
      />

      {/* Content Area */}
      <main className="reader-content">
        {currentChapter ? (
          <ChapterContent
            chapter={currentChapter}
            settings={settings}
          />
        ) : (
          <div className="no-content">
            <p>暂无章节内容</p>
          </div>
        )}
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Chapter List */}
      <ChapterList
        chapters={chapters}
        currentChapterId={currentChapter?.id || ''}
        onSelectChapter={handleSelectChapter}
        isOpen={isChapterListOpen}
        onClose={() => setIsChapterListOpen(false)}
      />

      {/* Global Styles */}
      <style>{`
        .novel-reader {
          min-height: 100vh;
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
                       'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
          transition: background-color 0.3s ease;
        }
        .reader-content {
          padding: 80px 1rem 100px;
          max-width: 800px;
          margin: 0 auto;
        }
        .no-content {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }
        
        /* Cyberpunk Scanline Effect */
        .novel-reader::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 247, 0.01) 2px,
            rgba(0, 255, 247, 0.01) 4px
          );
          pointer-events: none;
          z-index: 1000;
        }
        
        /* Cyberpunk Glow Border */
        .novel-reader::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent,
            #00fff7 25%,
            #ff00ff 50%,
            #00fff7 75%,
            transparent
          );
          z-index: 1001;
          animation: borderGlow 3s ease-in-out infinite;
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        /* Responsive Adjustments */
        @media (min-width: 768px) {
          .reader-content {
            padding: 100px 2rem 120px;
          }
        }
        
        /* Selection Style */
        ::selection {
          background: rgba(0, 255, 247, 0.3);
          color: #fff;
        }
        
        /* Scrollbar Style */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00fff7, #ff00ff);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default NovelReader;