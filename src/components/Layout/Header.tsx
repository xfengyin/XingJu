import React from 'react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

/** 搜索图标 */
function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

/** 通知图标 */
function BellIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

/** 快捷键图标 */
function ShortcutIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-[#ededed] flex items-center justify-between px-6 relative">
      {/* 左侧 - 搜索框 (Linear Command Palette 风格) */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8f98]">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="搜索音乐、视频、小说、漫画..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[#8a8f98] bg-[#f0f0f2] rounded-micro border border-[#e5e5e5]" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>
              ⌘K
            </kbd>
          </span>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#f0f0f2] hover:bg-[#e5e5e7] flex items-center justify-center text-[#62666d] transition-all text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 右侧 - 操作按钮 */}
      <div className="flex items-center gap-1 ml-4">
        {/* 通知按钮 */}
        <button className="btn-icon relative">
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5e6ad2]"></span>
        </button>

        {/* 分隔线 */}
        <div className="w-px h-5 bg-[#ededed] mx-2"></div>

        {/* 用户头像 */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-comfortable hover:bg-[#f5f6f7] transition-all">
          <div className="w-6 h-6 rounded-full bg-[#5e6ad2] flex items-center justify-center text-white text-[10px] font-medium">
            K
          </div>
        </button>
      </div>
    </header>
  )
}
