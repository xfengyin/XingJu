import React from 'react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="h-16 glass-panel m-4 mt-0 rounded-2xl flex items-center justify-between px-6">
      {/* 搜索框 */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索音乐、视频、小说、漫画..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="cyber-input w-full pl-12 pr-4 py-3"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </span>
        </div>
      </div>
      
      {/* 右侧操作 */}
      <div className="flex items-center gap-4">
        <button className="p-3 rounded-xl hover:bg-cyber-panel transition-all">
          🔔
        </button>
        <button className="p-3 rounded-xl hover:bg-cyber-panel transition-all">
          👤
        </button>
      </div>
    </header>
  )
}
