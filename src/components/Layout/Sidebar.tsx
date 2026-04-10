import React, { useState } from 'react'

interface SidebarProps {
  activeModule: 'music' | 'video' | 'novel' | 'manga'
  onModuleChange: (module: 'music' | 'video' | 'novel' | 'manga') => void
}

const menuItems = [
  { id: 'music' as const, icon: '🎵', label: '音乐' },
  { id: 'video' as const, icon: '🎬', label: '视频' },
  { id: 'novel' as const, icon: '📚', label: '小说' },
  { id: 'manga' as const, icon: '📖', label: '漫画' },
] as const

/** 汉堡菜单图标 */
function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

/** 关闭图标 */
function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/** 设置图标 */
function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

/** 反馈图标 */
function FeedbackIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleModuleChange = (module: typeof activeModule) => {
    onModuleChange(module)
    setIsOpen(false)
  }

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-comfortable bg-white border border-[#e5e5e5] text-[#62666d] hover:bg-[#f5f6f7] transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* 移动端遮罩层 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边栏 - 极窄 Linear 风格 */}
      <aside
        className={`
          w-56 bg-white border-r border-[#e5e5e5] flex flex-col h-screen
          fixed md:relative z-40 md:z-auto
          transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo 区域 - 紧凑 */}
        <div className="h-12 flex items-center gap-2 px-4 border-b border-[#ededed]">
          <div className="w-6 h-6 rounded-standard bg-[#5e6ad2] flex items-center justify-center">
            <span className="text-white text-xs font-bold" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>X</span>
          </div>
          <span className="text-sm font-medium text-[#1a1a1a] tracking-tight" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>XingJu</span>
        </div>

        {/* 导航菜单 - 紧凑 */}
        <nav className="flex-1 py-2 px-2 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleModuleChange(item.id)}
              className={`nav-item ${activeModule === item.id ? 'nav-item-active' : ''}`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 分隔线 */}
        <div className="divider mx-3"></div>

        {/* 底部功能区 - 紧凑 */}
        <div className="py-2 px-2 space-y-0.5">
          <button className="nav-item">
            <SettingsIcon />
            <span>设置</span>
          </button>
          <button className="nav-item">
            <FeedbackIcon />
            <span>反馈</span>
          </button>
        </div>

        {/* 用户信息 - 极简 */}
        <div className="p-3 border-t border-[#ededed]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#5e6ad2] flex items-center justify-center text-white text-xs font-medium">
              K
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#1a1a1a] truncate" style={{ fontFeatureSettings: "'cv01', 'ss03'" }}>Kk</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
