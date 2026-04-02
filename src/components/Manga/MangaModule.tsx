import React, { useState, useEffect } from 'react'
import { searchManga, Manga } from '../../services/api'

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
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-4xl font-black gradient-text mb-2">📚 漫画聚合</h1>
        <p className="text-text-secondary">探索精彩漫画世界</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="glass-panel p-4 rounded-xl text-red-400 bg-red-500/10">
          {error}
        </div>
      )}

      {/* 分类 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
          热门分类
        </h2>
        <div className="flex flex-wrap gap-3">
          {['热血', '恋爱', '搞笑', '悬疑', '科幻', '冒险', '日常', '奇幻'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="glass-panel px-5 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-text-secondary hover:text-cyan-400"
            >
              {['🔥', '💕', '😂', '🔍', '🚀', '⚔️', '🏠', '✨'][i]} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 漫画列表 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></span>
          {query ? `搜索结果：${query}` : '推荐漫画'}
        </h2>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-text-secondary">正在搜索...</p>
          </div>
        ) : mangas.length === 0 ? (
          <div className="text-center py-20 text-text-tertiary">
            <p className="text-5xl mb-4">📚</p>
            <p>输入关键词搜索漫画</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mangas.map((manga, i) => (
              <div
                key={manga.id}
                className="group cyber-card overflow-hidden cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* 封面 */}
                <div className="aspect-[3/4] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-6xl relative overflow-hidden">
                  {manga.cover ? (
                    <LazyImage
                      src={manga.cover}
                      alt={manga.title}
                      className="w-full h-full"
                      placeholder="📚"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">📚</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* 信息 */}
                <div className="p-3">
                  <h3 className="font-bold text-white truncate text-sm group-hover:text-cyan-400 transition-colors">
                    {manga.title}
                  </h3>
                  <p className="text-xs text-text-tertiary truncate mt-1">{manga.author}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      manga.status === '已完结' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {manga.status}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {manga.chapters}话
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-text-tertiary truncate">
                    {manga.source}
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