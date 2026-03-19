import React, { useState } from 'react'
import '../../styles/design-system.css'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  source: string
}

export default function MusicModule({ query }: { query: string }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<string>('all')

  // 模拟数据
  const mockTracks: Track[] = [
    {
      id: '1',
      title: '赛博朋克 2077',
      artist: '未来乐队',
      album: '霓虹之夜',
      duration: '04:30',
      cover: '🎵',
      source: 'netease',
    },
    {
      id: '2',
      title: '电子梦境',
      artist: 'AI 音乐家',
      album: '虚拟世界',
      duration: '03:45',
      cover: '🎵',
      source: 'qq',
    },
    {
      id: '3',
      title: '星际穿越',
      artist: '宇宙乐团',
      album: '深空探索',
      duration: '05:12',
      cover: '🌌',
      source: 'kugou',
    },
    {
      id: '4',
      title: '霓虹雨夜',
      artist: '合成器浪潮',
      album: '复古未来',
      duration: '04:08',
      cover: '🌧️',
      source: 'netease',
    },
  ]

  const sources = [
    { id: 'all', name: '全部', icon: '🌐' },
    { id: 'netease', name: '网易云', icon: '🎵' },
    { id: 'qq', name: 'QQ 音乐', icon: '🎶' },
    { id: 'kugou', name: '酷狗', icon: '🎧' },
  ]

  return (
    <div className="space-y-8">
      {/* 顶部区域 - 标题和源选择 */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">🎵 音乐聚合</h1>
          <p className="text-text-secondary">探索来自多个平台的无限音乐</p>
        </div>
        
        {/* 源选择器 */}
        <div className="flex gap-2">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeSource === source.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'glass-panel text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{source.icon}</span>
              <span className="hidden sm:inline">{source.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 推荐歌单 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
            热门推荐
          </h2>
          <button className="text-sm text-text-tertiary hover:text-cyan-400 transition-colors">
            查看全部 →
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="group cyber-card p-4 cursor-pointer"
              style={{
                animation: 'fade-in-up 0.5s ease forwards',
                animationDelay: `${i * 100}ms`,
                opacity: 0
              }}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
                {['🎵', '🎸', '🎹', '🎺', '🥁'][i]}
                {/* 播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-2xl text-white">▶</span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-white truncate">精选歌单 {i + 1}</h3>
              <p className="text-sm text-text-tertiary truncate">{10 + i * 5} 首歌曲</p>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索结果 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
            {query ? `搜索：${query}` : '最近播放'}
          </h2>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden">
          {/* 表头 */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 text-sm text-text-tertiary">
            <span className="w-12 text-center">#</span>
            <span className="flex-1">歌曲</span>
            <span className="hidden md:block w-48">专辑</span>
            <span className="w-20 text-center">时长</span>
            <span className="w-24 text-center">来源</span>
            <span className="w-16"></span>
          </div>
          
          {/* 歌曲列表 */}
          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-text-secondary">正在加载...</p>
              </div>
            ) : (
              mockTracks.map((track, index) => (
                <div
                  key={track.id}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: 'fade-in-up 0.4s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  <span className="w-12 text-center text-text-tertiary group-hover:text-cyan-400 transition-colors font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {track.cover}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {track.title}
                      </div>
                      <div className="text-sm text-text-tertiary truncate">
                        {track.artist}
                      </div>
                    </div>
                  </div>
                  <span className="hidden md:block w-48 text-text-secondary truncate">
                    {track.album}
                  </span>
                  <span className="w-20 text-center text-text-tertiary font-mono text-sm">
                    {track.duration}
                  </span>
                  <span className="w-24 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      track.source === 'netease' ? 'badge' :
                      track.source === 'qq' ? 'badge-magenta' :
                      'badge-violet'
                    }`}>
                      {track.source === 'netease' ? '网易云' :
                       track.source === 'qq' ? 'QQ 音乐' : '酷狗'}
                    </span>
                  </span>
                  <button className="w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center hover:scale-110 transition-transform">
                      <span className="text-white text-sm">▶</span>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
