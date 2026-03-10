import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // 当前模块
  activeModule: 'music' | 'video' | 'novel' | 'manga'
  setActiveModule: (module: 'music' | 'video' | 'novel' | 'manga') => void
  
  // 搜索
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // 播放状态
  currentTrack: any | null
  isPlaying: boolean
  progress: number
  setCurrentTrack: (track: any) => void
  setIsPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
  
  // 主题
  theme: 'cyberpunk' | 'dark' | 'light'
  setTheme: (theme: 'cyberpunk' | 'dark' | 'light') => void
  
  // 设置
  settings: {
    autoPlay: boolean
    showLyrics: boolean
    cacheSize: number
  }
  updateSettings: (settings: Partial<any>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 当前模块
      activeModule: 'music',
      setActiveModule: (module) => set({ activeModule: module }),
      
      // 搜索
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // 播放状态
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setProgress: (progress) => set({ progress }),
      
      // 主题
      theme: 'cyberpunk',
      setTheme: (theme) => set({ theme }),
      
      // 设置
      settings: {
        autoPlay: true,
        showLyrics: true,
        cacheSize: 1024,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'xingju-storage',
    }
  )
)
