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
  { id: 'light', label: '浅色', value: '#fafafa' },
  { id: 'warm', label: '暖色', value: '#f5f0e8' },
  { id: 'sepia', label: '羊皮纸', value: '#f4ecd8' },
  { id: 'dark', label: '深色', value: '#1a1a1a' },
  { id: 'midnight', label: '午夜蓝', value: '#0f1011' },
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

// ============================================================================
// Sub-Components
// ============================================================================

const ChapterContent: React.FC<{
  chapter: Chapter;
  settings: ReadingSettings;
}> = ({ chapter, settings }) => {
  const paragraphs = useMemo(() => parseChapterContent(chapter.content), [chapter.content]);
  const isDarkBg = settings.backgroundColor === '#1a1a1a' || settings.backgroundColor === '#0f1011';

  return (
    <article style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <h1 style={{
        textAlign: 'center',
        fontSize: '1.5em',
        fontWeight: 590,
        color: isDarkBg ? '#f7f8f8' : '#1a1a1a',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid ' + (isDarkBg ? 'rgba(255,255,255,0.08)' : '#e5e5e5'),
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontFeatureSettings: "'cv01', 'ss03'",
        letterSpacing: '-0.24px',
      }}>
        {chapter.title}
      </h1>

      <div style={{ padding: '0 1rem' }}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              marginBottom: '1rem',
              color: isDarkBg ? '#d0d6e0' : '#62666d',
              textAlign: 'justify',
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontFeatureSettings: "'cv01', 'ss03'",
            }}
          >
            <span style={{ userSelect: 'none' }}>　　</span>
            {paragraph}
          </p>
        ))}
      </div>
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
    const newSize = Math.max(FONT_SIZE_RANGE.min, Math.min(FONT_SIZE_RANGE.max, settings.fontSize + delta));
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.15s ease-out' }} onClick={onClose}>
      <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #ededed' }}>
          <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '15px', fontWeight: 590, fontFeatureSettings: "'cv01', 'ss03'" }}>阅读设置</h3>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #e5e5e5', color: '#62666d', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s' }}>✕</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#8a8f98', fontSize: '12px', fontWeight: 510, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFeatureSettings: "'cv01', 'ss03'" }}>字体大小</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button onClick={() => handleFontSizeChange(-FONT_SIZE_RANGE.step)} disabled={settings.fontSize <= FONT_SIZE_RANGE.min} style={{ background: '#f5f6f7', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 510 }}>A-</button>
            <span style={{ color: '#1a1a1a', fontFamily: 'ui-monospace, monospace', fontSize: '14px', minWidth: '50px', textAlign: 'center' }}>{settings.fontSize}px</span>
            <button onClick={() => handleFontSizeChange(FONT_SIZE_RANGE.step)} disabled={settings.fontSize >= FONT_SIZE_RANGE.max} style={{ background: '#f5f6f7', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 510 }}>A+</button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#8a8f98', fontSize: '12px', fontWeight: 510, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFeatureSettings: "'cv01', 'ss03'" }}>行距</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <button onClick={() => handleLineHeightChange(-0.2)} disabled={settings.lineHeight <= 1.4} style={{ background: '#f5f6f7', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 510 }}>紧凑</button>
            <span style={{ color: '#1a1a1a', fontFamily: 'ui-monospace, monospace', fontSize: '14px', minWidth: '40px', textAlign: 'center' }}>{settings.lineHeight}</span>
            <button onClick={() => handleLineHeightChange(0.2)} disabled={settings.lineHeight >= 2.4} style={{ background: '#f5f6f7', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 510 }}>宽松</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#8a8f98', fontSize: '12px', fontWeight: 510, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFeatureSettings: "'cv01', 'ss03'" }}>背景主题</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
            {BACKGROUND_COLORS.map(color => (
              <button
                key={color.id}
                style={{
                  aspectRatio: '1',
                  border: settings.backgroundColor === color.value ? '2px solid #5e6ad2' : '2px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: color.value,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: settings.backgroundColor === color.value ? '0 0 0 2px rgba(94,106,210,0.2)' : 'none',
                }}
                onClick={() => handleBackgroundColorChange(color.value)}
                title={color.label}
              >
                <span style={{ fontSize: '10px', color: color.id === 'dark' || color.id === 'midnight' ? '#8a8f98' : '#62666d' }}>{color.label}</span>
                {settings.backgroundColor === color.value && <span style={{ color: '#5e6ad2', fontSize: '12px' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          button:disabled { opacity: 0.3; cursor: not-allowed; }
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, animation: 'fadeIn 0.15s ease-out' }} onClick={onClose}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '85%', maxWidth: '320px', background: '#ffffff', borderRight: '1px solid #e5e5e5', boxShadow: '4px 0 12px rgba(0,0,0,0.08)', animation: 'slideInRight 0.2s ease-out', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px', borderBottom: '1px solid #ededed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '15px', fontWeight: 590, fontFeatureSettings: "'cv01', 'ss03'" }}>章节目录</h3>
          <span style={{ color: '#8a8f98', fontSize: '12px' }}>共 {chapters.length} 章</span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 16px',
                background: chapter.id === currentChapterId ? 'rgba(94,106,210,0.08)' : 'none',
                border: 'none',
                borderLeft: chapter.id === currentChapterId ? '2px solid #5e6ad2' : '2px solid transparent',
                cursor: 'pointer',
                textAlign: 'left' as const,
                transition: 'all 0.12s',
              }}
              onClick={() => { onSelectChapter(chapter.id); onClose(); }}
            >
              <span style={{ color: '#8a8f98', fontFamily: 'ui-monospace, monospace', fontSize: '12px', minWidth: '2.5rem' }}>{String(index + 1).padStart(3, '0')}</span>
              <span style={{ flex: 1, color: chapter.id === currentChapterId ? '#5e6ad2' : '#1a1a1a', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFeatureSettings: "'cv01', 'ss03'" }}>{chapter.title}</span>
              {chapter.id === currentChapterId && <span style={{ fontSize: '10px', color: '#5e6ad2', background: 'rgba(94,106,210,0.08)', padding: '2px 6px', borderRadius: '4px', fontWeight: 510 }}>阅读中</span>}
            </button>
          ))}
        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          button:hover { background: #f5f6f7 !important; }
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
}> = ({ onPrevChapter, onNextChapter, onOpenSettings, onOpenChapterList, onBack, hasPrevChapter, hasNextChapter, progress }) => {
  return (
    <nav style={{ position: 'fixed', left: 0, right: 0, zIndex: 100 }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(250,250,250,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #ededed' }}>
        <button onClick={onBack} title="返回" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 510, fontFeatureSettings: "'cv01', 'ss03'" }}>
          ← 返回
        </button>
        <div style={{ flex: 1, height: '2px', background: '#ededed', margin: '0 16px', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#5e6ad2', borderRadius: '1px', transition: 'width 0.2s ease', width: `${progress}%` }} />
        </div>
        <button onClick={onOpenChapterList} title="目录" style={{ background: 'transparent', border: '1px solid #e5e5e5', color: '#62666d', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>☰</button>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 16px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))', background: 'rgba(250,250,250,0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid #ededed' }}>
        <button onClick={onPrevChapter} disabled={!hasPrevChapter} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: hasPrevChapter ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 510, opacity: hasPrevChapter ? 1 : 0.3, fontFeatureSettings: "'cv01', 'ss03'" }}>
          ‹ 上一章
        </button>
        <button onClick={onOpenSettings} title="设置" style={{ background: 'transparent', border: '1px solid #e5e5e5', color: '#62666d', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>⚙</button>
        <button onClick={onNextChapter} disabled={!hasNextChapter} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid #e5e5e5', color: '#1a1a1a', padding: '6px 12px', borderRadius: '6px', cursor: hasNextChapter ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 510, opacity: hasNextChapter ? 1 : 0.3, fontFeatureSettings: "'cv01', 'ss03'" }}>
          下一章 ›
        </button>
      </div>
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
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (savedProgress && !initialChapterId) {
        const progress: ReadingProgress = JSON.parse(savedProgress);
        const chapterIndex = chapters.findIndex(c => c.id === progress.chapterId);
        if (chapterIndex !== -1) setCurrentChapterIndex(chapterIndex);
      }
    } catch (error) {
      console.error('Failed to load settings/progress:', error);
    }
  }, [chapters, initialChapterId]);

  useEffect(() => {
    if (initialChapterId) {
      const index = chapters.findIndex(c => c.id === initialChapterId);
      if (index !== -1) setCurrentChapterIndex(index);
    }
  }, [initialChapterId, chapters]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    if (currentChapter) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify({ chapterId: currentChapter.id, scrollPosition: scrollProgress, lastReadTime: Date.now() }));
      } catch {}
    }
  }, [currentChapter, scrollProgress]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: settings.backgroundColor, fontFamily: "'Inter', -apple-system, sans-serif", fontFeatureSettings: "'cv01', 'ss03'", transition: 'background-color 0.2s ease' }}>
      <NavigationBar
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenChapterList={() => setIsChapterListOpen(true)}
        onBack={() => onBack?.()}
        hasPrevChapter={currentChapterIndex > 0}
        hasNextChapter={currentChapterIndex < chapters.length - 1}
        progress={scrollProgress}
      />
      <main style={{ padding: '80px 1rem 100px', maxWidth: '800px', margin: '0 auto' }}>
        {currentChapter ? <ChapterContent chapter={currentChapter} settings={settings} /> : <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8a8f98' }}>暂无章节内容</div>}
      </main>
      <SettingsPanel settings={settings} onSettingsChange={setSettings} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ChapterList chapters={chapters} currentChapterId={currentChapter?.id || ''} onSelectChapter={handleSelectChapter} isOpen={isChapterListOpen} onClose={() => setIsChapterListOpen(false)} />
    </div>
  );
};

export default NovelReader;
