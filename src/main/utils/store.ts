import Store from 'electron-store'

// 定义快捷键配置
export interface ShortcutConfig {
  showHide: string
  minimize: string
  download: string
}

// 定义设置接口
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  downloadPath: string
  maxConcurrentDownloads: number
  searchProviders: {
    music: string[]
    video: string[]
    novel: string[]
    manga: string[]
  }
  autoUpdate: boolean
  startOnBoot: boolean
  minimizeToTray: boolean
  shortcuts?: ShortcutConfig
}

// 定义默认设置
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  downloadPath: '',
  maxConcurrentDownloads: 3,
  searchProviders: {
    music: ['netease', 'qq'],
    video: ['bilibili'],
    novel: ['qidian'],
    manga: ['bilibili'],
  },
  autoUpdate: true,
  startOnBoot: false,
  minimizeToTray: true,
  shortcuts: {
    showHide: 'CommandOrControl+Shift+X',
    minimize: 'CommandOrControl+Shift+M',
    download: 'CommandOrControl+Shift+D',
  },
}

// 创建 store 实例
const store = new Store<{
  settings: AppSettings
  downloadQueue: Array<{
    id: string
    url: string
    type: 'music' | 'video' | 'novel' | 'manga'
    status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed'
    progress: number
    createdAt: number
  }>
}>({
  name: 'xingju-settings',
  defaults: {
    settings: defaultSettings,
    downloadQueue: [],
  },
})

// 类型安全的存储操作方法
export const storeUtils = {
  // 获取设置
  getSettings(): AppSettings {
    return store.get('settings')
  },

  // 更新设置
  updateSettings(partialSettings: Partial<AppSettings>): AppSettings {
    const currentSettings = store.get('settings')
    const newSettings = { ...currentSettings, ...partialSettings }
    store.set('settings', newSettings)
    return newSettings
  },

  // 获取特定设置项
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return store.get('settings')[key]
  },

  // 设置特定设置项
  setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    const settings = store.get('settings')
    store.set('settings', { ...settings, [key]: value })
  },

  // 获取下载队列
  getDownloadQueue() {
    return store.get('downloadQueue')
  },

  // 添加下载任务
  addDownloadTask(task: {
    id: string
    url: string
    type: 'music' | 'video' | 'novel' | 'manga'
    status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed'
    progress: number
    createdAt: number
  }): void {
    const queue = store.get('downloadQueue')
    queue.push(task)
    store.set('downloadQueue', queue)
  },

  // 更新下载任务
  updateDownloadTask(id: string, updates: Partial<typeof store.get('downloadQueue')[0]>): void {
    const queue = store.get('downloadQueue')
    const index = queue.findIndex(task => task.id === id)
    if (index !== -1) {
      queue[index] = { ...queue[index], ...updates }
      store.set('downloadQueue', queue)
    }
  },

  // 删除下载任务
  removeDownloadTask(id: string): void {
    const queue = store.get('downloadQueue').filter(task => task.id !== id)
    store.set('downloadQueue', queue)
  },

  // 清空下载队列
  clearDownloadQueue(): void {
    store.set('downloadQueue', [])
  },
}

export default store
