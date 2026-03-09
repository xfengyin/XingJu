import { IpcMain, BrowserWindow } from 'electron'
import { searchMusic, searchVideo, searchNovel, searchManga } from './content'
import { getSettings, updateSettings, resetSettings, getSetting, setSetting } from './settings'
import { startDownload, pauseDownload, getDownloadProgress, resumeDownload, cancelDownload } from './download'

export function setupIpcHandlers(ipcMain: IpcMain) {
  // 内容搜索
  ipcMain.handle('search-music', async (_, query: string) => {
    return await searchMusic(query)
  })

  ipcMain.handle('search-video', async (_, query: string) => {
    return await searchVideo(query)
  })

  ipcMain.handle('search-novel', async (_, query: string) => {
    return await searchNovel(query)
  })

  ipcMain.handle('search-manga', async (_, query: string) => {
    return await searchManga(query)
  })

  // 设置管理
  ipcMain.handle('get-settings', async () => {
    return await getSettings()
  })

  ipcMain.handle('update-settings', async (_, settings: any) => {
    return await updateSettings(settings)
  })

  ipcMain.handle('reset-settings', async () => {
    return await resetSettings()
  })

  ipcMain.handle('get-setting', async (_, key: string) => {
    return await getSetting(key as any)
  })

  ipcMain.handle('set-setting', async (_, key: string, value: any) => {
    return await setSetting(key as any, value)
  })

  // 下载管理
  ipcMain.handle('start-download', async (_, task: { url: string; type: 'music' | 'video' | 'novel' | 'manga'; title: string }) => {
    return await startDownload(task)
  })

  ipcMain.handle('pause-download', async (_, taskId: string) => {
    return await pauseDownload(taskId)
  })

  ipcMain.handle('resume-download', async (_, taskId: string) => {
    return await resumeDownload(taskId)
  })

  ipcMain.handle('cancel-download', async (_, taskId: string) => {
    return await cancelDownload(taskId)
  })

  ipcMain.handle('get-download-progress', async (_, taskIds?: string[]) => {
    return await getDownloadProgress(taskIds)
  })

  // 窗口控制
  ipcMain.on('window-minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  // 获取窗口状态
  ipcMain.handle('get-window-state', async () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) {
      return {
        isMaximized: false,
        isMinimized: false,
        isVisible: false,
      }
    }
    return {
      isMaximized: win.isMaximized(),
      isMinimized: win.isMinimized(),
      isVisible: win.isVisible(),
    }
  })
}
