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
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-heading-2 font-normal text-[#1a1a1a] tracking-tight" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          视频聚合
        </h1>
        <p className="text-small text-[#62666d] mt-1">探索来自B站、优酷等平台的精彩视频</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 rounded-comfortable text-sm bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* 热门分类 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          热门分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['游戏', '动漫', '科技', '音乐', '生活', '知识', '娱乐', '美食'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="linear-card-interactive p-3 text-left group rounded-card"
            >
              <span className="text-xl mb-2 block">{['🎮', '🎌', '🔬', '🎵', '🏠', '📚', '🎭', '🍜'][i]}</span>
              <span className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#5e6ad2] transition-colors" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 搜索结果 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          {query ? `搜索结果：${query}` : '输入关键词搜索'}
        </h2>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-[#e5e5e5] border-t-[#5e6ad2] rounded-full animate-spin"></div>
            <p className="mt-3 text-small text-[#8a8f98]">正在搜索...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 text-[#8a8f98]">
            <p className="text-3xl mb-3">🎬</p>
            <p className="text-sm">输入关键词搜索视频</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {videos.map((video) => (
              <div key={video.id} className="linear-card-interactive overflow-hidden cursor-pointer p-0">
                <div className="aspect-video bg-[#f5f6f7] relative overflow-hidden">
                  {video.cover ? (
                    <LazyImage src={video.cover} alt={video.title} className="w-full h-full group-hover:scale-105 transition-transform duration-200" placeholder="🎬" />
                  ) : (
                    <div className="flex items-center justify-center text-4xl h-full">🎬</div>
                  )}
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-standard bg-black/70 text-[11px] text-white font-mono tabular-nums">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <span className="text-[#1a1a1a] text-lg">▶</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-[#1a1a1a] truncate hover:text-[#5e6ad2] transition-colors" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="badge text-[11px]">{getSourceLabel(video.source)}</span>
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
