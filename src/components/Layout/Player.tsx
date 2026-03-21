import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  cover?: string
  duration?: number
}

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [localProgress, setLocalProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  
  const { 
    currentTrack, 
    isPlaying, 
    setIsPlaying, 
    progress,
    setProgress,
    volume,
    setVolume 
  } = useAppStore()

  // 播放/暂停控制
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // 时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration || 1
      setLocalProgress((current / total) * 100)
      setProgress((current / total) * 100)
    }
  }

  // 加载元数据
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      audioRef.current.currentTime = percent * duration
      setLocalProgress(percent * 100)
    }
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentTime = audioRef.current?.currentTime || 0

  return (
    <footer className="h-28 glass-panel m-4 mb-0 rounded-3xl flex items-center px-8 gap-6 relative overflow-hidden">
      {/* 隐藏的音频元素 */}
      {currentTrack?.url && (
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      
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
        {/* 可视化条 */}
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
        <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="随机播放">
          <span className="text-lg">🔀</span>
        </button>
        <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="上一首">
          <span className="text-xl">⏮</span>
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
          title={isPlaying ? '暂停' : '播放'}
        >
          <span className="text-xl text-white">
            {isPlaying ? '⏸' : '▶'}
          </span>
        </button>
        <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="下一首">
          <span className="text-xl">⏭</span>
        </button>
        <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="循环播放">
          <span className="text-lg">🔁</span>
        </button>
      </div>
      
      {/* 进度条 */}
      <div className="flex-1 flex items-center gap-3 min-w-[200px]">
        <span className="text-xs text-text-tertiary font-mono w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <div 
          className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full relative transition-all"
            style={{ width: `${localProgress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-xs text-text-tertiary font-mono w-10">
          {formatTime(duration)}
        </span>
      </div>
      
      {/* 右侧 - 音量控制 */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => {
            setIsMuted(!isMuted)
            if (audioRef.current) {
              audioRef.current.muted = !isMuted
            }
          }}
          className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all"
          title={isMuted ? '取消静音' : '静音'}
        >
          <span className="text-lg">{isMuted ? '🔇' : volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈'}</span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-purple-500"
        />
      </div>
      
      {/* 播放列表按钮 */}
      <button className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="播放列表">
        <span className="text-lg">📋</span>
      </button>
    </footer>
  )
}