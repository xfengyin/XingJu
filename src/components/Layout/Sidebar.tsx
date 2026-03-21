import React from 'react'

interface SidebarProps {
  activeModule: 'music' | 'video' | 'novel' | 'manga'
  onModuleChange: (module: 'music' | 'video' | 'novel' | 'manga') => void
}

const menuItems = [
  { id: 'music', icon: '🎵', label: '音乐', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'video', icon: '🎬', label: '视频', gradient: 'from-purple-500 to-pink-500' },
  { id: 'novel', icon: '📚', label: '小说', gradient: 'from-amber-500 to-orange-500' },
  { id: 'manga', icon: '📖', label: '漫画', gradient: 'from-emerald-500 to-teal-500' },
] as const

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="w-72 glass-panel m-4 rounded-3xl p-6 flex flex-col h-[calc(100vh-2rem)]">
      {/* Logo 区域 */}
      <div className="mb-10 p-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
        <div className="relative">
          <h1 className="text-4xl font-black gradient-text tracking-tight">XingJu</h1>
          <p className="text-xs text-text-tertiary mt-2 uppercase tracking-widest">星聚 v2.0</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="badge">PRO</span>
          </div>
        </div>
      </div>
      
      {/* 导航菜单 */}
      <nav className="space-y-3 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onModuleChange(item.id)}
            className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              activeModule === item.id
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
            style={{
              animation: `fade-in-up 0.5s ease forwards`,
              animationDelay: `${index * 100}ms`,
              opacity: 0
            }}
          >
            {/* 激活状态的渐变背景 */}
            {activeModule === item.id && (
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20`}></div>
            )}
            
            {/* 图标容器 */}
            <span className={`text-3xl relative z-10 transition-transform duration-300 ${
              activeModule === item.id ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              {item.icon}
            </span>
            
            {/* 文字 */}
            <span className="font-semibold text-base relative z-10">{item.label}</span>
            
            {/* 右侧指示器 */}
            <span className={`ml-auto w-2 h-2 rounded-full transition-all duration-300 ${
              activeModule === item.id 
                ? `bg-gradient-to-r ${item.gradient} scale-100` 
                : 'bg-white/20 scale-0 group-hover:scale-100'
            }`}></span>
          </button>
        ))}
      </nav>
      
      {/* 分隔线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>
      
      {/* 底部功能区 */}
      <div className="space-y-2">
        <button className="w-full group flex items-center gap-4 px-5 py-4 rounded-2xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
          <span className="text-2xl">⚙️</span>
          <span className="font-medium">设置</span>
        </button>
        
        <button className="w-full group flex items-center gap-4 px-5 py-4 rounded-2xl text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300">
          <span className="text-2xl">💬</span>
          <span className="font-medium">反馈</span>
        </button>
      </div>
      
      {/* 用户信息 */}
      <div className="mt-6 p-4 glass-panel rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
          K
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Kk</p>
          <p className="text-xs text-text-tertiary truncate">Premium Member</p>
        </div>
      </div>
    </aside>
  )
}
