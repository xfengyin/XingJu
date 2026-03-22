import { useState, useEffect, useCallback } from 'react'

interface Chapter {
  id: string
  title: string
  images: string[]
}

interface Props {
  chapters: Chapter[]
  currentChapterIndex: number
  onChapterChange: (index: number) => void
  onBack: () => void
}

type ReadMode = 'scroll' | 'page'

export default function MangaReader({ chapters, currentChapterIndex, onChapterChange, onBack }: Props) {
  const [currentPage, setCurrentPage] = useState(0)
  const [readMode, setReadMode] = useState<ReadMode>('page')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set())
  
  const currentChapter = chapters[currentChapterIndex]
  const images = currentChapter?.images || []
  
  const loadImage = useCallback((url: string) => {
    if (loadingImages.has(url)) return
    setLoadingImages(prev => new Set(prev).add(url))
    const img = new Image()
    img.onload = () => setLoadingImages(prev => { const n = new Set(prev); n.delete(url); return n })
    img.onerror = () => {
      setLoadingImages(prev => { const n = new Set(prev); n.delete(url); return n })
      setErrorImages(prev => new Set(prev).add(url))
    }
    img.src = url
  }, [loadingImages])
  
  useEffect(() => {
    if (readMode === 'scroll') {
      images.forEach(url => loadImage(url))
    } else {
      loadImage(images[currentPage])
      if (currentPage > 0) loadImage(images[currentPage - 1])
      if (currentPage < images.length - 1) loadImage(images[currentPage + 1])
    }
  }, [currentPage, images, readMode, loadImage])
  
  const goToNextPage = () => {
    if (currentPage < images.length - 1) setCurrentPage(p => p + 1)
    else if (currentChapterIndex < chapters.length - 1) { onChapterChange(currentChapterIndex + 1); setCurrentPage(0) }
  }
  
  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1)
    else if (currentChapterIndex > 0) { onChapterChange(currentChapterIndex - 1); setCurrentPage(chapters[currentChapterIndex - 1]?.images.length - 1 || 0) }
  }
  
  return (
    <div className="fixed inset-0 bg-[#050508] z-50 flex flex-col">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] opacity-20" />
      
      <header className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/10"><span className="text-xl">←</span></button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-cyan-400 truncate">{currentChapter?.title}</h1>
          <div className="text-xs text-gray-500 mt-1">{readMode === 'page' ? `${currentPage + 1} / ${images.length}` : `${images.length} 页`}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setReadMode(m => m === 'page' ? 'scroll' : 'page')} className="p-2 rounded-lg hover:bg-white/10"><span className="text-xl">{readMode === 'page' ? '📜' : '📄'}</span></button>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden relative">
        {images.map((url, index) => (
          <div key={url + index} className="relative flex items-center justify-center min-h-[60vh]">
            {loadingImages.has(url) && <div className="absolute w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />}
            {errorImages.has(url) ? (
              <div className="text-center py-20 text-red-400"><span className="text-4xl block mb-2">⚠️</span>图片加载失败</div>
            ) : (
              <img src={url} alt={`Page ${index + 1}`} className="max-w-full h-auto" loading="lazy" />
            )}
          </div>
        ))}
      </main>
      
      <footer className="flex items-center justify-between px-4 py-3 border-t border-cyan-500/30 bg-black/80 backdrop-blur-sm">
        <button onClick={goToPrevPage} disabled={currentPage === 0 && currentChapterIndex === 0} className="flex-1 py-2 mx-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 disabled:opacity-30">← 上一话</button>
        <span className="text-sm text-gray-400">{currentChapterIndex + 1} / {chapters.length}</span>
        <button onClick={goToNextPage} disabled={currentPage >= images.length - 1 && currentChapterIndex >= chapters.length - 1} className="flex-1 py-2 mx-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 disabled:opacity-30">下一话 →</button>
      </footer>
    </div>
  )
}