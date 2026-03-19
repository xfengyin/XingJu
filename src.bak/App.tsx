import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Player from './components/Layout/Player'
import MusicModule from './components/Music/MusicModule'
import VideoModule from './components/Video/VideoModule'
import NovelModule from './components/Novel/NovelModule'
import MangaModule from './components/Manga/MangaModule'
import './styles/design-system.css'

function App() {
  const [activeModule, setActiveModule] = useState<'music' | 'video' | 'novel' | 'manga'>('music')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-void-black text-white overflow-hidden">
      {/* 动态背景层 */}
      <div className="cyber-background"></div>
      <div className="grid-overlay"></div>
      
      {/* 粒子效果 */}
      <div className="particle-field">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* 主布局 */}
      <div className="flex h-screen p-4 gap-4">
        {/* 侧边栏 */}
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        
        {/* 主内容区 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 头部 */}
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          {/* 内容区域 */}
          <main className="flex-1 overflow-y-auto p-6 pt-2">
            {activeModule === 'music' && <MusicModule query={searchQuery} />}
            {activeModule === 'video' && <VideoModule query={searchQuery} />}
            {activeModule === 'novel' && <NovelModule query={searchQuery} />}
            {activeModule === 'manga' && <MangaModule query={searchQuery} />}
          </main>
        </div>
      </div>
      
      {/* 底部播放器 */}
      <Player />
    </div>
  )
}

export default App
