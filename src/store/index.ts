import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  cover?: string
  duration?: number
}

interface AppSettings {
  autoPlay: boolean
  showLyrics: boolean
  cacheSize: number
  volume: number
  quality: 'low' | 'medium' | 'high'
}

interface AppState {
  // 当前模块
  activeModule: 'music' | 'video' | 'novel' | 'manga'
  setActiveModule: (module: 'music' | 'video' | 'novel' | 'manga') => void

  // 搜索
  searchQuery: string
  setSearchQuery: (query: string) => void

  // 播放状态
  currentTrack: Track | null
  isPlaying: boolean
  progress: number
  volume: number
  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void

  // 主题
  theme: 'linear' | 'dark' | 'light'
  setTheme: (theme: 'linear' | 'dark' | 'light') => void

  // 设置
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
}

// 持久化配置
const persistConfig = {
  name: 'xingju-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state: AppState) => ({
    theme: state.theme,
    settings: state.settings,
    volume: state.volume,
  }),
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
      volume: 0.8,
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setProgress: (progress) => set({ progress }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      // 主题 (默认 Linear 风格)
      theme: 'linear',
      setTheme: (theme) => set({ theme }),

      // 设置
      settings: {
        autoPlay: true,
        showLyrics: true,
        cacheSize: 1024,
        volume: 0.8,
        quality: 'high',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    persistConfig
  )
)
