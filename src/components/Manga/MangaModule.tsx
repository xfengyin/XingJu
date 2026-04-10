import React, { useState, useEffect } from 'react'
import { searchManga, Manga } from '../../services/api'
import { LazyImage } from '../common/LazyImage'

interface Props {
  query: string
}

export default function MangaModule({ query }: Props) {
  const [mangas, setMangas] = useState<Manga[]>([])
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
      const results = await searchManga({ query: searchQuery, limit: 20 })
      setMangas(results)
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
          漫画聚合
        </h1>
        <p className="text-small text-[#62666d] mt-1">探索精彩漫画世界</p>
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
          {['热血', '恋爱', '搞笑', '悬疑', '科幻', '冒险', '日常', '奇幻'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="btn-subtle text-xs"
            >
              {['🔥', '💕', '😂', '🔍', '🚀', '⚔️', '🏠', '✨'][i]} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 漫画列表 */}
      <section>
        <h2 className="text-caption-lg font-medium text-[#62666d] uppercase tracking-wider mb-3" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
          {query ? `搜索结果：${query}` : '推荐漫画'}
        </h2>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-[#e5e5e5] border-t-[#5e6ad2] rounded-full animate-spin"></div>
            <p className="mt-3 text-small text-[#8a8f98]">正在搜索...</p>
          </div>
        ) : mangas.length === 0 ? (
          <div className="text-center py-16 text-[#8a8f98]">
            <p className="text-3xl mb-3">📚</p>
            <p className="text-sm">输入关键词搜索漫画</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {mangas.map((manga) => (
              <div key={manga.id} className="linear-card-interactive overflow-hidden cursor-pointer p-0">
                {/* 封面 */}
                <div className="aspect-[3/4] bg-[#f5f6f7] flex items-center justify-center text-4xl relative overflow-hidden">
                  {manga.cover ? (
                    <LazyImage src={manga.cover} alt={manga.title} className="w-full h-full" placeholder="📚" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">📚</div>
                  )}
                </div>

                {/* 信息 */}
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-[#1a1a1a] truncate hover:text-[#5e6ad2] transition-colors" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
                    {manga.title}
                  </h3>
                  <p className="text-[11px] text-[#8a8f98] truncate mt-0.5">{manga.author}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      manga.status === '已完结' ? 'badge-success' : 'badge'
                    }`}>
                      {manga.status}
                    </span>
                    <span className="text-[10px] text-[#8a8f98]">{manga.chapters}话</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#8a8f98] truncate">{manga.source}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
