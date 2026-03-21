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
    <div className="space-y-8">
      {/* 标题 */}
      <div>
        <h1 className="text-4xl font-black gradient-text mb-2">📖 小说聚合</h1>
        <p className="text-text-secondary">探索精彩小说世界</p>
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
          <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
          热门分类
        </h2>
        <div className="flex flex-wrap gap-3">
          {['玄幻', '仙侠', '都市', '历史', '科幻', '游戏', '军事', '悬疑'].map((cat, i) => (
            <button
              key={i}
              onClick={() => performSearch(cat)}
              className="glass-panel px-5 py-3 rounded-xl hover:bg-white/10 transition-all font-medium text-text-secondary hover:text-cyan-400"
            >
              {['🐉', '⚔️', '🏙️', '📜', '🚀', '🎮', '🎖️', '🔍'][i]} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 小说列表 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
          {query ? `搜索结果：${query}` : '推荐小说'}
        </h2>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-text-secondary">正在搜索...</p>
          </div>
        ) : novels.length === 0 ? (
          <div className="text-center py-20 text-text-tertiary">
            <p className="text-5xl mb-4">📖</p>
            <p>输入关键词搜索小说</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {novels.map((novel, i) => (
              <div
                key={novel.id}
                className="group cyber-card p-4 flex gap-4 cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* 封面 */}
                <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                  {novel.cover || '📖'}
                </div>
                
                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {novel.title}
                  </h3>
                  <p className="text-sm text-text-tertiary mt-1">{novel.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      novel.status === '已完结' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {novel.status}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      {novel.chapters}章
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-text-tertiary">
                    来源: {novel.source}
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