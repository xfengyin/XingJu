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
        limit: 20,
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
    { id: 'all', name: '全部' },
    { id: 'netease', name: '网易云' },
    { id: 'qq', name: 'QQ音乐' },
    { id: 'kugou', name: '酷狗' },
  ]

  return (
    <div className="space-y-6">
      {/* 顶部标题和源选择器 */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-heading-2 font-normal text-[#1a1a1a] tracking-tight" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
            音乐聚合
          </h1>
          <p className="text-small text-[#62666d] mt-1">探索来自多个平台的无限音乐</p>
        </div>

        <div className="flex gap-1">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => {
                setActiveSource(source.id)
                if (query) performSearch(query)
              }}
              className={`px-3 py-1.5 rounded-comfortable text-caption font-medium transition-all duration-150 ${
                activeSource === source.id
                  ? 'bg-[#5e6ad2] text-white'
                  : 'text-[#62666d] hover:bg-[#f5f6f7] hover:text-[#1a1a1a]'
              }`}
              style={{ fontFeatureSettings: "'cv01', 'ss03'" }}
            >
              {source.name}
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 rounded-comfortable text-sm bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* 热门推荐 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          热门推荐
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {['流行', '电子', '摇滚', '古典', '民谣'].map((genre, i) => (
            <div
              key={i}
              className="linear-card-interactive p-3 cursor-pointer"
              onClick={() => performSearch(genre)}
            >
              <div className="aspect-square rounded-comfortable bg-[#f5f6f7] mb-3 flex items-center justify-center text-3xl">
                {['🎵', '🎸', '🎹', '🎺', '🥁'][i]}
              </div>
              <h3 className="text-sm font-medium text-[#1a1a1a] truncate" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>{genre}音乐</h3>
              <p className="text-xs text-[#8a8f98] mt-0.5">点击探索</p>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索结果 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          {query ? `搜索结果：${query}` : '输入关键词搜索'}
        </h2>

        <div className="panel">
          {/* 表头 */}
          <div className="hidden md:flex items-center gap-4 px-4 py-2.5 border-b border-[#ededed] text-caption text-[#8a8f98] font-medium" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
            <span className="w-10 text-center">#</span>
            <span className="flex-1">歌曲</span>
            <span className="w-40">专辑</span>
            <span className="w-16 text-center">时长</span>
            <span className="w-20 text-center">来源</span>
            <span className="w-12"></span>
          </div>

          {/* 歌曲列表 */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block w-6 h-6 border-2 border-[#e5e5e5] border-t-[#5e6ad2] rounded-full animate-spin"></div>
              <p className="mt-3 text-small text-[#8a8f98]">正在搜索...</p>
            </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-16 text-[#8a8f98]">
              <p className="text-3xl mb-3">🎵</p>
              <p className="text-sm">输入关键词搜索音乐</p>
            </div>
          ) : (
            tracks.map((track, index) => (
              <div key={track.id} className="list-row gap-4">
                <span className="hidden md:block w-10 text-center text-[#8a8f98] text-caption font-mono tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-comfortable bg-[#f5f6f7] flex items-center justify-center text-lg overflow-hidden shrink-0">
                    {track.cover ? (
                      <img src={track.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      '🎵'
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#1a1a1a] truncate" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
                      {track.title}
                    </div>
                    <div className="text-xs text-[#8a8f98] truncate">{track.artist}</div>
                  </div>
                </div>
                <span className="hidden md:block w-40 text-sm text-[#62666d] truncate">{track.album}</span>
                <span className="hidden md:block w-16 text-center text-xs text-[#8a8f98] font-mono tabular-nums">
                  {formatDuration(track.duration)}
                </span>
                <span className="hidden md:block w-20 text-center">
                  <span className="badge text-[11px]">{getSourceLabel(track.source)}</span>
                </span>
                <button className="w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-[#5e6ad2] hover:bg-[#828fff] flex items-center justify-center transition-colors">
                    <span className="text-white text-[10px]">▶</span>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
