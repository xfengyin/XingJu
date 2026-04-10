import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store'

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, progress, setProgress, volume } = useAppStore()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current && currentTrack?.url) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [currentTrack, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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

  const handlePrev = () => {
    console.log('Previous track')
  }

  const handleNext = () => {
    setIsPlaying(false)
  }

  return (
    <footer className="h-14 bg-white border-t border-[#ededed] flex items-center px-4 gap-4">
      <audio ref={audioRef} src={currentTrack?.url} onEnded={handleNext} />

      {/* 左侧 - 专辑封面 + 信息 */}
      <div className="flex items-center gap-3 min-w-0 max-w-[200px]">
        <div className={`w-9 h-9 rounded-comfortable overflow-hidden shrink-0 bg-[#5e6ad2] flex items-center justify-center text-base ${isPlaying ? 'ring-2 ring-[#5e6ad2]/30' : ''}`}>
          {currentTrack?.cover || '🎵'}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#1a1a1a] truncate" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
            {currentTrack?.title || '未播放'}
          </div>
          <div className="text-xs text-[#8a8f98] truncate">
            {currentTrack?.artist || '选择内容开始播放'}
          </div>
        </div>
      </div>

      {/* 中间 - 播放控制 */}
      <div className="flex items-center gap-1">
        <button onClick={handlePrev} className="btn-icon">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 rounded-full bg-[#5e6ad2] hover:bg-[#828fff] flex items-center justify-center transition-colors"
        >
          <span className="text-white text-sm">{isPlaying ? '⏸' : '▶'}</span>
        </button>
        <button onClick={handleNext} className="btn-icon">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      {/* 进度条 */}
      <div className="flex-1 flex items-center gap-2 min-w-[120px]">
        <span className="text-[11px] text-[#8a8f98] font-mono w-8 text-right tabular-nums">
          {Math.floor(progress * 3)}:00
        </span>
        <div className="flex-1 h-1 bg-[#ededed] rounded-full overflow-hidden cursor-pointer group">
          <div
            className="h-full bg-[#5e6ad2] rounded-full transition-all relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#5e6ad2] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-[11px] text-[#8a8f98] font-mono w-8 tabular-nums">3:00</span>
      </div>

      {/* 音量控制 */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#8a8f98]">
          {volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => useAppStore.getState().setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 bg-[#ededed] rounded-full appearance-none cursor-pointer accent-[#5e6ad2]"
        />
      </div>
    </footer>
  )
}
