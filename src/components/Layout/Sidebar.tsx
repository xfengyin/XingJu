import React from 'react'

interface SidebarProps {
  activeModule: 'music' | 'video' | 'novel' | 'manga'
  onModuleChange: (module: 'music' | 'video' | 'novel' | 'manga') => void
}

const menuItems = [
  { id: 'music', icon: '🎵', label: '音乐' },
  { id: 'video', icon: '🎬', label: '视频' },
  { id: 'novel', icon: '📚', label: '小说' },
  { id: 'manga', icon: '📖', label: '漫画' },
] as const

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="w-64 glass-panel m-4 rounded-2xl p-4">
      {/* Logo */}
      <div className="mb-8 p-4 text-center">
        <h1 className="text-3xl font-bold neon-text">XingJu</h1>
        <p className="text-sm text-cyber-gray-400 mt-1">星聚 v2.0</p>
      </div>
      
      {/* 导航菜单 */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activeModule === item.id
                ? 'bg-neon-blue/20 cyber-border text-white'
                : 'text-cyber-gray-400 hover:text-white hover:bg-cyber-panel'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* 底部设置 */}
      <div className="mt-auto pt-4 border-t border-cyber-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cyber-gray-400 hover:text-white hover:bg-cyber-panel transition-all">
          <span className="text-2xl">⚙️</span>
          <span className="font-medium">设置</span>
        </button>
      </div>
    </aside>
  )
}
