import { useState, useEffect } from 'react'

interface Chapter {
  id: string
  title: string
  content: string
}

interface Props {
  chapters: Chapter[]
  currentChapterIndex: number
  onChapterChange: (index: number) => void
  onBack: () => void
}

type ThemeName = 'cyber-black' | 'neon-purple' | 'matrix-green' | 'circuit-blue' | 'rust-orange'

const themes: Record<ThemeName, { bg: string; text: string; name: string }> = {
  'cyber-black': { bg: 'bg-[#0a0a0f]', text: 'text-gray-200', name: '赛博黑' },
  'neon-purple': { bg: 'bg-[#1a0a1f]', text: 'text-purple-200', name: '霓虹紫' },
  'matrix-green': { bg: 'bg-[#0a1a0a]', text: 'text-green-300', name: '矩阵绿' },
  'circuit-blue': { bg: 'bg-[#0a0f1a]', text: 'text-cyan-200', name: '电路蓝' },
  'rust-orange': { bg: 'bg-[#1a0f0a]', text: 'text-orange-200', name: '锈迹橙' },
}

export default function NovelReader({ chapters, currentChapterIndex, onChapterChange, onBack }: Props) {
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.8)
  const [theme, setTheme] = useState<ThemeName>('cyber-black')
  const [showSettings, setShowSettings] = useState(false)
  const [showChapterList, setShowChapterList] = useState(false)
  
  const currentChapter = chapters[currentChapterIndex]
  
  // 保存阅读设置
  useEffect(() => {
    const saved = localStorage.getItem('novel-reader-settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setFontSize(settings.fontSize ?? 18)
      setLineHeight(settings.lineHeight ?? 1.8)
      setTheme(settings.theme ?? 'cyber-black')
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('novel-reader-settings', JSON.stringify({ fontSize, lineHeight, theme }))
  }, [fontSize, lineHeight, theme])
  
  // 保存阅读进度
  useEffect(() => {
    localStorage.setItem('novel-reader-progress', JSON.stringify({
      chapterIndex: currentChapterIndex,
      timestamp: Date.now()
    }))
  }, [currentChapterIndex])
  
  const currentTheme = themes[theme]
  
  return (
    <div className={`fixed inset-0 ${currentTheme.bg} ${currentTheme.text} z-50 flex flex-col`}>
      {/* 扫描线效果 */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,247,0.02)_50%)] bg-[length:100%_4px] opacity-30" />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm shrink-0">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <span className="text-xl">←</span>
        </button>
        
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold truncate text-cyan-400">
            「{currentChapter?.title}」
          </h1>
          <div className="text-xs text-gray-500 mt-1">
            {currentChapterIndex + 1} / {chapters.length}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowChapterList(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="章节目录"
          >
            <span className="text-xl">📋</span>
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="阅读设置"
          >
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </header>
      
      {/* 进度条 */}
      <div className="h-1 bg-gray-800 shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>
      
      {/* 阅读设置面板 */}
      {showSettings && (
        <div className="absolute top-16 right-4 glass-panel rounded-xl p-4 w-64 z-50 animate-fade-in-up">
          <h3 className="text-sm font-semibold mb-3 text-cyan-400">阅读设置</h3>
          
          {/* 字体大小 */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">字体大小: {fontSize}px</label>
            <input
              type="range"
              min="14"
              max="28"
              step="2"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
            />
          </div>
          
          {/* 行距 */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">行距: {lineHeight.toFixed(1)}</label>
            <input
              type="range"
              min="1.4"
              max="2.4"
              step="0.2"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
            />
          </div>
          
          {/* 主题切换 */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">主题</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(themes) as ThemeName[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    theme === key ? 'border-cyan-400 scale-110' : 'border-gray-600 hover:border-gray-400'
                  } ${themes[key].bg}`}
                  title={themes[key].name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 章节目录 */}
      {showChapterList && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setShowChapterList(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            className="relative w-72 h-full bg-[#0a0a0f] border-r border-cyan-500/30 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-cyan-500/30">
              <h3 className="text-lg font-semibold text-cyan-400">章节目录</h3>
              <p className="text-xs text-gray-500 mt-1">共 {chapters.length} 章</p>
            </div>
            <div className="p-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    onChapterChange(index)
                    setShowChapterList(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    index === currentChapterIndex
                      ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span className="text-sm">{chapter.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 正文内容 */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div 
          className="max-w-2xl mx-auto"
          style={{ fontSize: `${fontSize}px`, lineHeight }}
        >
          {currentChapter?.content.split('\n').map((paragraph, index) => (
            <p 
              key={index} 
              className="mb-4 text-indent-[2em] text-justify animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </main>
      
      {/* 底部导航 */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-cyan-500/30 bg-black/50 backdrop-blur-sm shrink-0">
        <button
          onClick={() => onChapterChange(currentChapterIndex - 1)}
          disabled={currentChapterIndex <= 0}
          className="flex-1 py-2 mx-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← 上一章
        </button>
        
        <button
          onClick={() => onChapterChange(currentChapterIndex + 1)}
          disabled={currentChapterIndex >= chapters.length - 1}
          className="flex-1 py-2 mx-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          下一章 →
        </button>
      </footer>
    </div>
  )
}