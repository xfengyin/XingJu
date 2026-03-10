import { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Player from './components/Layout/Player'
import Header from './components/Layout/Header'

function App() {
  const [activeModule, setActiveModule] = useState<'music' | 'video' | 'novel' | 'manga'>('music')

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
          <Header />
          
          {/* 内容区域 */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="cyber-grid">
              <h1 className="text-4xl font-bold neon-text mb-2">
                {activeModule === 'music' && '🎵 音乐聚合'}
                {activeModule === 'video' && '🎬 视频聚合'}
                {activeModule === 'novel' && '📚 小说聚合'}
                {activeModule === 'manga' && '📖 漫画聚合'}
              </h1>
              <p className="text-cyber-gray-400">
                赛博朋克风格 · 多平台聚合 · 一站式体验
              </p>
              
              {/* 模块内容 */}
              <div className="mt-8 glass-panel p-8">
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">
                    {activeModule === 'music' && '🎵'}
                    {activeModule === 'video' && '🎬'}
                    {activeModule === 'novel' && '📚'}
                    {activeModule === 'manga' && '📖'}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {activeModule === 'music' && '音乐模块开发中'}
                    {activeModule === 'video' && '视频模块开发中'}
                    {activeModule === 'novel' && '小说模块开发中'}
                    {activeModule === 'manga' && '漫画模块开发中'}
                  </h2>
                  <p className="text-cyber-gray-400">
                    敬请期待...
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* 底部播放器 */}
      <Player />
    </div>
  )
}

export default App
