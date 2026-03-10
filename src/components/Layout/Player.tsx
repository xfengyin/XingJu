import React from 'react'
import { useAppStore } from '../store'

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, progress, setProgress } = useAppStore()

  return (
    <footer className="h-24 glass-panel m-4 mb-0 rounded-2xl flex items-center px-6 gap-6">
      {/* 封面 */}
      <div className="w-16 h-16 bg-cyber-panel rounded-xl flex items-center justify-center text-3xl">
        {currentTrack?.cover || '🎵'}
      </div>
      
      {/* 歌曲信息 */}
      <div className="flex-1">
        <div className="text-white font-medium">
          {currentTrack?.title || '未播放'}
        </div>
        <div className="text-sm text-cyber-gray-400">
          {currentTrack?.artist || '选择内容开始播放'}
        </div>
      </div>
      
      {/* 播放控制 */}
      <div className="flex items-center gap-4">
        <button className="p-3 text-cyber-gray-400 hover:text-white transition-all">
          ⏮
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 bg-neon-blue rounded-full hover:shadow-neon transition-all"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="p-3 text-cyber-gray-400 hover:text-white transition-all">
          ⏭
        </button>
      </div>
      
      {/* 进度条 */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-sm text-cyber-gray-400">00:00</span>
        <div className="flex-1 h-2 bg-cyber-panel rounded-full overflow-hidden cursor-pointer">
          <div 
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-cyber-gray-400">
          {currentTrack?.duration || '04:30'}
        </span>
      </div>
      
      {/* 音量控制 */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🔊</span>
        <div className="w-24 h-2 bg-cyber-panel rounded-full overflow-hidden">
          <div className="h-full bg-neon-blue w-3/4"></div>
        </div>
      </div>
    </footer>
  )
}
