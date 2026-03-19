import React, { useState } from 'react'
import '../../styles/design-system.css'

interface Novel {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  chapters: number
  status: string
  category: string
  description: string
  source: string
}

export default function NovelModule({ query }: { query: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<string>('all')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // 模拟数据
  const mockNovels: Novel[] = [
    {
      id: '1',
      title: '星际穿越：无尽征途',
      author: '宇宙行者',
      cover: '🚀',
      rating: 4.8,
      chapters: 1280,
      status: '连载中',
      category: '科幻',
      description: '人类文明迈向星际时代的史诗篇章，探索未知宇宙的奥秘...',
      source: 'qidian',
    },
    {
      id: '2',
      title: '都市修仙：隐世高人',
      author: '红尘散人',
      cover: '⚡',
      rating: 4.6,
      chapters: 856,
      status: '连载中',
      category: '都市',
      description: '繁华都市中的修仙者，低调修行，高调做事...',
      source: 'jinjiang',
    },
    {
      id: '3',
      title: '异界大陆：最强法师',
      author: '魔法导师',
      cover: '🔮',
      rating: 4.7,
      chapters: 2100,
      status: '已完结',
      category: '玄幻',
      description: '穿越异界，觉醒最强魔法天赋，踏上巅峰之路...',
      source: 'qidian',
    },
    {
      id: '4',
      title: '历史架空：帝国崛起',
      author: '史官',
      cover: '👑',
      rating: 4.5,
      chapters: 680,
      status: '连载中',
      category: '历史',
      description: '重生古代，建立不朽帝国，改写历史进程...',
      source: 'zongheng',
    },
    {
      id: '5',
      title: '悬疑推理：真相背后',
      author: '侦探小说家',
      cover: '🔍',
      rating: 4.9,
      chapters: 320,
      status: '连载中',
      category: '悬疑',
      description: '每一个案件背后，都隐藏着不为人知的真相...',
      source: 'jinjiang',
    },
    {
      id: '6',
      title: '游戏竞技：全职高手',
      author: '电竞选手',
      cover: '🎮',
      rating: 4.8,
      chapters: 1560,
      status: '已完结',
      category: '游戏',
      description: '职业电竞选手的热血竞技之路...',
      source: 'qidian',
    },
  ]

  const sources = [
    { id: 'all', name: '全部', icon: '🌐' },
    { id: 'qidian', name: '起点', icon: '📖' },
    { id: 'jinjiang', name: '晋江', icon: '📚' },
    { id: 'zongheng', name: '纵横', icon: '📕' },
  ]

  const categories = ['全部', '科幻', '玄幻', '都市', '历史', '悬疑', '游戏', '言情', '武侠']

  return (
    <div className="space-y-8">
      {/* 顶部区域 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">📚 小说聚合</h1>
          <p className="text-text-secondary">海量小说资源，尽在掌握</p>
        </div>
        
        {/* 源选择器 */}
        <div className="flex gap-2 flex-wrap">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeSource === source.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                  : 'glass-panel text-text-secondary hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{source.icon}</span>
              <span className="hidden sm:inline">{source.name}</span>
            </button>
          ))}
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

      {/* 热门推荐 - 网格布局 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
            热门推荐
          </h2>
          <button className="text-sm text-text-tertiary hover:text-amber-400 transition-colors">
            排行榜 →
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mockNovels.map((novel, index) => (
            <div
              key={novel.id}
              className="group cyber-card p-4 cursor-pointer text-center"
              style={{
                animation: 'fade-in-up 0.5s ease forwards',
                animationDelay: `${index * 80}ms`,
                opacity: 0
              }}
            >
              {/* 封面 */}
              <div className="aspect-[2/3] rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/20 group-hover:to-orange-500/20 transition-all duration-500"></div>
                {novel.cover}
                
                {/* 状态标签 */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                  novel.status === '连载中' 
                    ? 'bg-green-500/80 text-white' 
                    : 'bg-blue-500/80 text-white'
                }`}>
                  {novel.status === '连载中' ? '连载' : '完结'}
                </div>
              </div>
              
              {/* 信息 */}
              <h3 className="font-semibold text-white text-sm truncate mb-1 group-hover:text-amber-400 transition-colors">
                {novel.title}
              </h3>
              <p className="text-xs text-text-tertiary truncate mb-2">{novel.author}</p>
              
              {/* 评分 */}
              <div className="flex items-center justify-center gap-1 text-xs">
                <span className="text-amber-400">⭐</span>
                <span className="text-white font-medium">{novel.rating}</span>
              </div>
              
              {/* 章节数 */}
              <p className="text-xs text-text-tertiary mt-1">{novel.chapters}章</p>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索结果列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></span>
            {query ? `搜索：${query}` : '最新更新'}
          </h2>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-text-secondary">正在加载...</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {mockNovels.map((novel, index) => (
                <div
                  key={novel.id}
                  className="group flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: 'fade-in-up 0.4s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  {/* 封面 */}
                  <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex-shrink-0 flex items-center justify-center text-4xl">
                    {novel.cover}
                  </div>
                  
                  {/* 信息 */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-lg group-hover:text-amber-400 transition-colors">
                          {novel.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          novel.status === '连载中' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {novel.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-tertiary mt-1">{novel.author}</p>
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                        {novel.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary mt-2">
                      <span className="flex items-center gap-1">
                        <span className="text-amber-400">⭐</span>
                        <span className="text-white">{novel.rating}</span>
                      </span>
                      <span>{novel.chapters}章</span>
                      <span className="badge px-2 py-1" style={{ borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)', background: 'rgba(0, 243, 255, 0.1)' }}>
                        {novel.category}
                      </span>
                      <span className="badge-violet px-2 py-1 ml-auto">
                        {novel.source === 'qidian' ? '起点' : novel.source === 'jinjiang' ? '晋江' : '纵横'}
                      </span>
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
