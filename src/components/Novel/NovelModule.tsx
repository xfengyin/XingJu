import React, { useState, useEffect } from 'react'
import { searchNovel, Novel } from '../../services/api'

interface Props {
  query: string
}

export default function NovelModule({ query }: Props) {
  const [novels, setNovels] = useState<Novel[]>([])
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
      const results = await searchNovel({ query: searchQuery, limit: 20 })
      setNovels(results)
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
          小说聚合
        </h1>
        <p className="text-small text-[#62666d] mt-1">探索精彩小说世界</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 rounded-comfortable text-sm bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* 分类 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          热门分类
        </h2>
        <div className="flex flex-wrap gap-2">
          {['玄幻', '仙侠', '都市', '历史', '科幻', '游戏', '军事', '悬疑'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="btn-subtle text-xs"
            >
              {['🐉', '⚔️', '🏙️', '📜', '🚀', '🎮', '🎖️', '🔍'][i]} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 小说列表 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          {query ? `搜索结果：${query}` : '推荐小说'}
        </h2>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-[#e5e5e5] border-t-[#5e6ad2] rounded-full animate-spin"></div>
            <p className="mt-3 text-small text-[#8a8f98]">正在搜索...</p>
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-16 text-[#8a8f98]">
            <p className="text-3xl mb-3">📖</p>
            <p className="text-sm">输入关键词搜索小说</p>
          </div>
        ) : (
          <div className="panel">
            {novels.map((novel) => (
              <div key={novel.id} className="list-row gap-4 p-4">
                {/* 封面 */}
                <div className="w-12 h-16 rounded-comfortable bg-[#f5f6f7] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {novel.cover || '📖'}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#1a1a1a] truncate hover:text-[#5e6ad2] transition-colors" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
                    {novel.title}
                  </h3>
                  <p className="text-xs text-[#8a8f98] mt-0.5">{novel.author}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      novel.status === '已完结' ? 'badge-success' : 'badge'
                    }`}>
                      {novel.status}
                    </span>
                    <span className="text-[11px] text-[#8a8f98]">{novel.chapters}章</span>
                  </div>
                </div>
                <div className="text-xs text-[#8a8f98]">{novel.source}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
