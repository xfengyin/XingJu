import { useState, Suspense, lazy } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Player from './components/Layout/Player'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/design-system.css'

// 路由级别代码分割 - 懒加载模块
const MusicModule = lazy(() => import('./components/Music/MusicModule'))
const VideoModule = lazy(() => import('./components/Video/VideoModule'))
const NovelModule = lazy(() => import('./components/Novel/NovelModule'))
const MangaModule = lazy(() => import('./components/Manga/MangaModule'))

// 加载骨架屏
const ModuleSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-[#1a1a2e] rounded w-1/4"></div>
    <div className="grid grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-48 bg-[#1a1a2e] rounded-lg"></div>
      ))}
    </div>
  </div>
)

function App() {
  const [activeModule, setActiveModule] = useState<'music' | 'video' | 'novel' | 'manga'>('music')
  const [searchQuery, setSearchQuery] = useState('')

  // 渲染当前模块
  const renderModule = () => {
    const props = { query: searchQuery }
    const modules = {
      music: <MusicModule {...props} />,
      video: <VideoModule {...props} />,
      novel: <NovelModule {...props} />,
      manga: <MangaModule {...props} />
    }
    return modules[activeModule]
  }

  return (
    <ErrorBoundary>
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
            
            {/* 内容区域 - 带 Suspense 边界 */}
            <main className="flex-1 overflow-y-auto p-6 pt-2">
              <ErrorBoundary>
                <Suspense fallback={<ModuleSkeleton />}>
                  {renderModule()}
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </div>
        
        {/* 底部播放器 */}
        <Player />
      </div>
    </ErrorBoundary>
  )
}

export default App