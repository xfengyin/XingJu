import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Player from './components/Layout/Player'
import MusicModule from './components/Music/MusicModule'
import VideoModule from './components/Video/VideoModule'
import NovelModule from './components/Novel/NovelModule'
import MangaModule from './components/Manga/MangaModule'

function App() {
  const [activeModule, setActiveModule] = useState<'music' | 'video' | 'novel' | 'manga'>('music')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-hidden">
      {/* 赛博朋克背景 */}
      <div className="fixed inset-0 cyber-grid -z-10"></div>
      <div className="fixed inset-0 scanlines pointer-events-none -z-10"></div>
      
      {/* 主布局 */}
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        
        {/* 主内容区 */}
        <div className="flex-1 flex flex-col">
          {/* 头部 */}
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          {/* 内容区域 */}
          <main className="flex-1 overflow-y-auto p-6">
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
