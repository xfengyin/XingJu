import React, { useState, useEffect } from 'react'
import { searchMusic, formatDuration, getSourceLabel, MusicTrack } from '../../services/api'
import { LazyImage } from '../common/LazyImage'

interface Props {
  query: string
}

export default function MusicModule({ query }: Props) {
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const results = await searchMusic({
        query: searchQuery,
        source: activeSource === 'all' ? undefined : activeSource,
        limit: 20
      })
      setTracks(results)
    } catch (e) {
      setError('搜索失败，请重试')
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const sources = [
    { id: 'all', name: '全部', icon: '🌐' },
    { id: 'netease', name: '网易云', icon: '🎵' },
    { id: 'qq', name: 'QQ音乐', icon: '🎶' },
    { id: 'kugou', name: '酷狗', icon: '🎧' },
  ]

  return (
    <div className="space-y-8">
      {/* 顶部标题和源选择器 */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">🎵 音乐聚合</h1>
          <p className="text-text-secondary">探索来自多个平台的无限音乐</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => {
                setActiveSource(source.id)
                if (query) performSearch(query)
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeSource === source.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'glass-panel text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{source.icon}</span>
              <span>{source.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="glass-panel p-4 rounded-xl text-red-400 bg-red-500/10">
          {error}
        </div>
      )}

      {/* 热门推荐 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
            热门推荐
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {['流行', '电子', '摇滚', '古典', '民谣'].map((genre, i) => (
            <div
              key={i}
              className="group cyber-card p-4 cursor-pointer"
              onClick={() => performSearch(genre)}
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                {['🎵', '🎸', '🎹', '🎺', '🥁'][i]}
              </div>
              <h3 className="font-semibold text-white truncate">{genre}音乐</h3>
              <p className="text-sm text-text-tertiary">点击探索</p>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索结果 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
            {query ? `搜索结果：${query}` : '输入关键词搜索'}
          </h2>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden">
          {/* 表头 */}
          <div className="hidden md:flex items-center gap-4 px-6 py-4 border-b border-white/10 text-sm text-text-tertiary">
            <span className="w-12 text-center">#</span>
            <span className="flex-1">歌曲</span>
            <span className="w-48">专辑</span>
            <span className="w-20 text-center">时长</span>
            <span className="w-24 text-center">来源</span>
            <span className="w-16"></span>
          </div>
          
          {/* 歌曲列表 */}
          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-text-secondary">正在搜索...</p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-20 text-text-tertiary">
                <p className="text-5xl mb-4">🎵</p>
                <p>输入关键词搜索音乐</p>
              </div>
            ) : (
              tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <span className="hidden md:block w-12 text-center text-text-tertiary font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-2xl overflow-hidden">
                      {track.cover ? (
                        <img src={track.cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        '🎵'
                      )}
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
                  <span className="hidden md:block w-20 text-center text-text-tertiary font-mono text-sm">
                    {formatDuration(track.duration)}
                  </span>
                  <span className="hidden md:block w-24 text-center">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {getSourceLabel(track.source)}
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
} </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}