import React, { useState } from 'react'

interface Video {
  id: string
  title: string
  channel: string
  duration: string
  views: string
  cover: string
  source: string
  publishedAt: string
}

export default function VideoModule({ query }: { query: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeSource, setActiveSource] = useState<string>('all')
  const [activeCategory, setActiveCategory] = useState<string>('recommend')

  // 模拟数据
  const mockVideos: Video[] = [
    {
      id: '1',
      title: '赛博朋克 2077 - 完整游戏流程',
      channel: '游戏解说',
      duration: '02:30:45',
      views: '120 万',
      cover: '🎮',
      source: 'bilibili',
      publishedAt: '2 天前',
    },
    {
      id: '2',
      title: 'AI 如何改变我们的未来',
      channel: '科技前沿',
      duration: '15:32',
      views: '89 万',
      cover: '🤖',
      source: 'youtube',
      publishedAt: '1 周前',
    },
    {
      id: '3',
      title: '宇宙探索 - 黑洞的奥秘',
      channel: '科普中国',
      duration: '45:20',
      views: '256 万',
      cover: '🌌',
      source: 'bilibili',
      publishedAt: '3 天前',
    },
    {
      id: '4',
      title: '前端开发教程 - React 18 新特性',
      channel: '编程教室',
      duration: '1:20:15',
      views: '45 万',
      cover: '💻',
      source: 'youtube',
      publishedAt: '5 天前',
    },
    {
      id: '5',
      title: '美食探店 - 深圳必吃餐厅',
      channel: '美食达人',
      duration: '12:45',
      views: '67 万',
      cover: '🍜',
      source: 'youku',
      publishedAt: '1 天前',
    },
    {
      id: '6',
      title: '音乐现场 - 霓虹之夜演唱会',
      channel: '音乐频道',
      duration: '1:45:30',
      views: '320 万',
      cover: '🎵',
      source: 'bilibili',
      publishedAt: '1 周前',
    },
  ]

  const sources = [
    { id: 'all', name: '全部', icon: '🌐' },
    { id: 'bilibili', name: '哔哩哔哩', icon: '📺' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'youku', name: '优酷', icon: '🎬' },
  ]

  const categories = [
    { id: 'recommend', name: '推荐' },
    { id: 'gaming', name: '游戏' },
    { id: 'tech', name: '科技' },
    { id: 'music', name: '音乐' },
    { id: 'food', name: '美食' },
    { id: 'edu', name: '教育' },
  ]

  return (
    <div className="space-y-8">
      {/* 顶部区域 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">🎬 视频聚合</h1>
          <p className="text-text-secondary">汇聚全网优质视频内容</p>
        </div>
        
        {/* 源选择器 */}
        <div className="flex gap-2 flex-wrap">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeSource === source.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
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
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-white/20 text-white'
                  : 'text-text-tertiary hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 精选视频 - 大卡片 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
            精选推荐
          </h2>
          <button className="text-sm text-text-tertiary hover:text-purple-400 transition-colors">
            查看全部 →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockVideos.slice(0, 6).map((video, index) => (
            <div
              key={video.id}
              className="group cyber-card p-0 overflow-hidden cursor-pointer"
              style={{
                animation: 'fade-in-up 0.5s ease forwards',
                animationDelay: `${index * 80}ms`,
                opacity: 0
              }}
            >
              {/* 封面 */}
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
                {video.cover}
                
                {/* 时长标签 */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs font-mono text-white">
                  {video.duration}
                </div>
                
                {/* 播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <span className="text-3xl text-white ml-1">▶</span>
                  </div>
                </div>
              </div>
              
              {/* 信息 */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate mb-2 group-hover:text-purple-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-text-tertiary">
                  <span>{video.channel}</span>
                  <span>{video.views}次观看</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
                  <span className="badge-violet px-2 py-1">
                    {video.source === 'bilibili' ? 'B 站' : video.source === 'youtube' ? 'YouTube' : '优酷'}
                  </span>
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索结果列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
            {query ? `搜索：${query}` : '最近更新'}
          </h2>
        </div>
        
        <div className="glass-panel rounded-3xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-text-secondary">正在加载...</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {mockVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: 'fade-in-up 0.4s ease forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  {/* 缩略图 */}
                  <div className="w-48 h-28 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0 flex items-center justify-center text-4xl relative overflow-hidden">
                    {video.cover}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs font-mono">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* 信息 */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-text-tertiary mt-1">{video.channel}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      <span>{video.views}次观看</span>
                      <span>•</span>
                      <span>{video.publishedAt}</span>
                      <span className="badge-violet px-2 py-1 ml-auto">
                        {video.source === 'bilibili' ? 'B 站' : video.source === 'youtube' ? 'YouTube' : '优酷'}
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
