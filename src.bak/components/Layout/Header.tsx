import React from 'react'
import '../../styles/design-system.css'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="h-20 glass-panel m-4 mt-0 rounded-3xl flex items-center justify-between px-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* 左侧 - 欢迎语 */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm text-text-tertiary">晚上好</p>
          <p className="text-lg font-semibold text-white">准备好探索了吗？✨</p>
        </div>
      </div>
      
      {/* 中间 - 搜索框 */}
      <div className="flex-1 max-w-3xl mx-8">
        <div className="relative group">
          {/* 搜索框光晕 */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative flex items-center">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-text-tertiary group-focus-within:text-cyan-400 transition-colors">
              🔍
            </span>
            <input
              type="text"
              placeholder="搜索音乐、视频、小说、漫画..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="cyber-input w-full pl-14 pr-12 py-4 bg-deep-space/80 text-base rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-text-secondary hover:text-white transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 右侧 - 操作按钮 */}
      <div className="flex items-center gap-3">
        {/* 通知按钮 */}
        <button className="relative p-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
          <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"></span>
        </button>
        
        {/* 分隔线 */}
        <div className="w-px h-8 bg-white/10"></div>
        
        {/* 用户头像 */}
        <button className="flex items-center gap-3 p-2 pr-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-deep-space flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
          </div>
          <span className="text-sm font-medium text-white hidden lg:block group-hover:text-cyan-400 transition-colors">
            Kk
          </span>
          <span className="text-text-tertiary hidden lg:block">▼</span>
        </button>
      </div>
    </header>
  )
}
