import React, { useState, useEffect } from 'react'
import { searchVideo, formatDuration, getSourceLabel, Video } from '../../services/api'
import { LazyImage } from '../common/LazyImage'

interface Props {
  query: string
}

export default function VideoModule({ query }: Props) {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
      const results = await searchVideo({ query: searchQuery, limit: 20 })
      setVideos(results)
    } catch (e) {
      setError('搜索失败，请重试')
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-4xl font-black gradient-text mb-2">🎬 视频聚合</h1>
        <p className="text-text-secondary">探索来自B站、优酷等平台的精彩视频</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="glass-panel p-4 rounded-xl text-red-400 bg-red-500/10">
          {error}
        </div>
      )}

      {/* 热门分类 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
          热门分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['游戏', '动漫', '科技', '音乐', '生活', '知识', '娱乐', '美食'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="glass-panel p-4 rounded-xl hover:bg-white/10 transition-all text-left group"
            >
              <span className="text-2xl mb-2 block">
                {['🎮', '🎌', '🔬', '🎵', '🏠', '📚', '🎭', '🍜'][i]}
              </span>
              <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 搜索结果 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></span>
          {query ? `搜索结果：${query}` : '输入关键词搜索'}
        </h2>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-text-secondary">正在搜索...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-text-tertiary">
            <p className="text-5xl mb-4">🎬</p>
            <p>输入关键词搜索视频</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, i) => (
              <div
                key={video.id}
                className="group cyber-card overflow-hidden cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
                  {video.cover ? (
                    <LazyImage 
                      src={video.cover} 
                      alt={video.title}
                      className="w-full h-full group-hover:scale-110 transition-transform duration-500"
                      placeholder="🎬"
                    />
                  ) : (
                    <div className="flex items-center justify-center text-6xl">🎬</div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-sm font-mono">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-3xl">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      {getSourceLabel(video.source)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}