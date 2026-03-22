import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store'
import '../../styles/design-system.css'

export default function Player() {
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    progress, 
    setProgress, 
    volume 
  } = useAppStore()
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // 音频播放控制
  useEffect(() => {
    if (audioRef.current && currentTrack?.url) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [currentTrack, isPlaying])

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // 进度更新
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100
        setProgress(pct)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate)
  }, [setProgress])

  // 上一曲/下一曲（占位）
  const handlePrev = () => {
    console.log('Previous track')
  }
  
  const handleNext = () => {
    console.log('Next track')
    setIsPlaying(false)
  }

  return (
    <footer className="h-28 glass-panel m-4 mb-0 rounded-3xl flex items-center px-8 gap-6 relative overflow-hidden">
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} src={currentTrack?.url} onEnded={handleNext} />
      
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      {/* 左侧 - 专辑封面 */}
      <div className="relative group shrink-0">
        <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${isPlaying ? 'ring-2 ring-cyan-500/50' : ''}`}>
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl">
            {currentTrack?.cover || '🎵'}
          </div>
        </div>
        {isPlaying && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center animate-pulse">
            <span className="text-white text-xs">▶</span>
          </div>
        )}
      </div>
      
      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0 max-w-xs">
        <div className="text-white font-semibold truncate">
          {currentTrack?.title || '未播放'}
        </div>
        <div className="text-sm text-text-tertiary truncate">
          {currentTrack?.artist || '选择内容开始播放'}
        </div>
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-4 mt-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full animate-pulse"
                style={{
                  height: `${30 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '0.4s'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 中间 - 播放控制 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all"
        >
          <span className="text-xl">⏮</span>
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
        >
          <span className="text-xl text-white">
            {isPlaying ? '⏸' : '▶'}
          </span>
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all"
        >
          <span className="text-xl">⏭</span>
        </button>
      </div>
      
      {/* 进度条 */}
      <div className="flex-1 flex items-center gap-3 min-w-[200px]">
        <span className="text-xs text-text-tertiary font-mono w-10 text-right">
          {Math.floor(progress * 3)}:00
        </span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-xs text-text-tertiary font-mono w-10">
          3:00
        </span>
      </div>
      
      {/* 音量控制 */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => useAppStore.getState().setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
        />
      </div>
    </footer>
  )
}