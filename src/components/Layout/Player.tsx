import { useRef, useEffect } from 'react'
import { usePlayerStore } from '../../store/player'
import '../../styles/design-system.css'

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, progress, setProgress, playNext, playPrev, volume } = usePlayerStore()
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

  return (
    <footer className="h-28 glass-panel m-4 mb-0 rounded-3xl flex items-center px-8 gap-8 relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      {/* 左侧 - 专辑封面 */}
      <div className="relative group">
        <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 ${isPlaying ? 'animate-pulse' : ''}`}>
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl">
            {currentTrack?.cover || '🎵'}
          </div>
        </div>
        {/* 播放状态指示器 */}
        {isPlaying && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-white rounded-full animate-pulse"></span>
              <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-100"></span>
              <span className="w-1 h-3 bg-white rounded-full animate-pulse delay-200"></span>
            </div>
          </div>
        )}
      </div>
      
      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-base truncate">
          {currentTrack?.title || '未播放'}
        </div>
        <div className="text-sm text-text-tertiary truncate">
          {currentTrack?.artist || '选择内容开始播放'}
        </div>
        {/* 可视化条 */}
        {isPlaying && (
          <div className="flex items-end gap-1 h-4 mt-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
                style={{
                  height: `${20 + Math.random() * 80}%`,
                  animation: `pulse-glow 0.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
      
      {/* 中间 - 播放控制 */}
      <div className="flex items-center gap-4">
        <button
          onClick={playPrev}
          className="p-3 rounded-2xl text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform block">⏮</span>
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative p-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 group shadow-lg hover:shadow-cyan-500/50"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform block">
            {isPlaying ? '⏸' : '▶'}
          </span>
          {/* 外圈光晕 */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
        </button>
        <button
          onClick={playNext}
          className="p-3 rounded-2xl text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform block">⏭</span>
        </button>
      </div>
      
      {/* 进度条 */}
      <div className="flex-1 flex items-center gap-4">
        <span className="text-xs text-text-tertiary font-mono w-12 text-right">00:00</span>
        <div className="flex-1 relative group cursor-pointer">
          {/* 背景轨道 */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            {/* 进度条 */}
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full relative transition-all duration-300"
              style={{ width: `${progress}%` }}
            >
              {/* 光晕效果 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          {/* 悬停时的光晕 */}
          <div className="absolute inset-0 h-2 bg-cyan-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        </div>
        <span className="text-xs text-text-tertiary font-mono w-12">
          {currentTrack?.duration || '04:30'}
        </span>
      </div>
      
      {/* 右侧 - 音量控制 */}
      <div className="flex items-center gap-3 group">
        <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all">
          <span className="text-lg">🔊</span>
        </button>
        <div className="w-24 relative">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full group-hover:from-cyan-400 group-hover:to-purple-400 transition-colors"></div>
          </div>
        </div>
      </div>

      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onEnded={playNext}
      />
    </footer>
  )
}
