import React, { useState } from 'react'
import '../../styles/design-system.css'

interface Manga {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  chapters: number
  status: string
  category: string
  latestChapter: string
  source: string
}

export default function MangaModule({ query }: { query: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  // 模拟数据
  const mockManga: Manga[] = [
    {
      id: '1',
      title: '鬼灭之刃',
      author: '吾峠呼世晴',
      cover: '⚔️',
      rating: 4.9,
      chapters: 205,
      status: '已完结',
      category: '热血',
      latestChapter: '第 205 话 生命',
      source: 'bilibili',
    },
    {
      id: '2',
      title: '进击的巨人',
      author: '谏山创',
      cover: '🔱',
      rating: 4.8,
      chapters: 139,
      status: '已完结',
      category: '热血',
      latestChapter: '第 139 话 向那棵树',
      source: 'bilibili',
    },
    {
      id: '3',
      title: '咒术回战',
      author: '芥见下下',
      cover: '👻',
      rating: 4.7,
      chapters: 245,
      status: '连载中',
      category: '热血',
      latestChapter: '第 245 话 人间',
      source: 'bilibili',
    },
    {
      id: '4',
      title: '间谍过家家',
      author: '远藤达哉',
      cover: '👨‍👩‍👧',
      rating: 4.9,
      chapters: 95,
      status: '连载中',
      category: '喜剧',
      latestChapter: '第 95 话',
      source: 'bilibili',
    },
    {
      id: '5',
      title: '海贼王',
      author: '尾田荣一郎',
      cover: '🏴‍☠️',
      rating: 4.8,
      chapters: 1100,
      status: '连载中',
      category: '热血',
      latestChapter: '第 1100 话 感谢',
      source: 'tencent',
    },
    {
      id: '6',
      title: '名侦探柯南',
      author: '青山刚昌',
      cover: '🔍',
      rating: 4.7,
      chapters: 1100,
      status: '连载中',
      category: '推理',
      latestChapter: '第 1100 话 秘密',
      source: 'tencent',
    },
    {
      id: '7',
      title: '一拳超人',
      author: 'ONE',
      cover: '👊',
      rating: 4.6,
      chapters: 195,
      status: '连载中',
      category: '热血',
      latestChapter: '第 195 话 英雄',
      source: 'tencent',
    },
    {
      id: '8',
      title: '我推的孩子',
      author: '赤坂明',
      cover: '⭐',
      rating: 4.8,
      chapters: 130,
      status: '连载中',
      category: '剧情',
      latestChapter: '第 130 话 舞台',
      source: 'bilibili',
    },
  ]

  const sources = [
    { id: 'all', name: '全部', icon: '🌐' },
    { id: 'bilibili', name: '哔哩哔哩', icon: '📺' },
    { id: 'tencent', name: '腾讯动漫', icon: '🎭' },
    { id: 'kuaikan', name: '快看', icon: '💨' },
  ]

  const categories = ['全部', '热血', '喜剧', '推理', '剧情', '恋爱', '奇幻', '冒险', '科幻']

  return (
    <div className="space-y-8">
      {/* 顶部区域 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2" style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📖 漫画聚合</h1>
          <p className="text-text-secondary">精彩漫画，实时更新</p>
        </div>
        
        {/* 源选择器 + 视图切换 */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => setActiveSource(source.id)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSource === source.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'glass-panel text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{source.icon}</span>
                <span className="hidden sm:inline">{source.name}</span>
              </button>
            ))}
          </div>
          
          {/* 视图切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white/20 text-white'
                  : 'text-text-tertiary hover:text-white hover:bg-white/10'
              }`}
            >
              网格
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white/20 text-white'
                  : 'text-text-tertiary hover:text-white hover:bg-white/10'
              }`}
            >
              列表
            </button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white/20 text-white'
                  : 'text-text-tertiary hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 热门推荐 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
            热门推荐
          </h2>
          <button className="text-sm text-text-tertiary hover:text-emerald-400 transition-colors">
            排行榜 →
          </button>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {mockManga.map((manga, index) => (
              <div
                key={manga.id}
                className="group cyber-card p-3 cursor-pointer text-center"
                style={{
                  animation: 'fade-in-up 0.5s ease forwards',
                  animationDelay: `${index * 60}ms`,
                  opacity: 0
                }}
              >
                {/* 封面 */}
                <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-2 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/20 group-hover:to-teal-500/20 transition-all duration-500"></div>
                  {manga.cover}
                  
                  {/* 更新标签 */}
                  {manga.status === '连载中' && (
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  )}
                </div>
                
                {/* 信息 */}
                <h3 className="font-semibold text-white text-xs truncate mb-1 group-hover:text-emerald-400 transition-colors">
                  {manga.title}
                </h3>
                <p className="text-xs text-text-tertiary truncate">{manga.latestChapter}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockManga.map((manga, index) => (
              <div
                key={manga.id}
                className="group cyber-card p-4 cursor-pointer"
                style={{
                  animation: 'fade-in-up 0.5s ease forwards',
                  animationDelay: `${index * 60}ms`,
                  opacity: 0
                }}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex-shrink-0 flex items-center justify-center text-3xl">
                    {manga.cover}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {manga.title}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1">{manga.author}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="flex items-center gap-1 text-amber-400">
                        ⭐ {manga.rating}
                      </span>
                      <span className="text-text-tertiary">|</span>
                      <span className="text-text-tertiary">{manga.latestChapter}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 最新更新列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></span>
            {query ? `搜索：${query}` : '最新更新'}
          </h2>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-text-secondary">正在加载...</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {mockManga.map((manga, index) => (
                <div
                  key={manga.id}
                  className="group flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: 'fade-in-up 0.4s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  {/* 封面 */}
                  <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex-shrink-0 flex items-center justify-center text-4xl relative">
                    {manga.cover}
                    {manga.status === '连载中' && (
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* 信息 */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-lg group-hover:text-emerald-400 transition-colors">
                          {manga.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          manga.status === '连载中' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {manga.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-tertiary mt-1">{manga.author}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary mt-2">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">⭐</span>
                        <span className="text-white">{manga.rating}</span>
                      </span>
                      <span>{manga.chapters}话</span>
                      <span className="badge px-2 py-1" style={{ borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', background: 'rgba(0, 243, 255, 0.1)' }}>
                        {manga.category}
                      </span>
                      <span className="text-emerald-400 ml-auto">{manga.latestChapter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
