import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, globalShortcut, screen } from 'electron'
import { join } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { setupIpcHandlers } from './ipc'
import { storeUtils } from './utils/store'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false

/**
 * 保存窗口状态
 */
function saveWindowState() {
  if (!mainWindow) return
  
  const bounds = mainWindow.getBounds()
  const isMaximized = mainWindow.isMaximized()
  
  try {
    const statePath = join(app.getPath('userData'), 'window-state.json')
    writeFileSync(statePath, JSON.stringify({
      ...bounds,
      isMaximized,
    }))
  } catch (error) {
    console.error('保存窗口状态失败:', error)
  }
}

/**
 * 恢复窗口状态
 */
function restoreWindowState(): Partial<Electron.Rectangle> & { isMaximized?: boolean } | null {
  try {
    const statePath = join(app.getPath('userData'), 'window-state.json')
    if (existsSync(statePath)) {
      const state = JSON.parse(readFileSync(statePath, 'utf-8'))
      return state
    }
  } catch (error) {
    console.error('恢复窗口状态失败:', error)
  }
  return null
}

/**
 * 创建主窗口
 */
function createWindow() {
  const savedState = restoreWindowState()
  const { width = 1200, height = 800, x, y, isMaximized = false } = savedState || {}
  
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  // 开发模式
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    if (isMaximized) {
      mainWindow?.maximize()
    }
  })

  // 保存窗口状态
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
    saveWindowState()
  })

  mainWindow.on('resize', () => {
    if (!mainWindow.isMaximized()) {
      saveWindowState()
    }
  })

  mainWindow.on('move', () => {
    if (!mainWindow.isMaximized()) {
      saveWindowState()
    }
  })
}

/**
 * 创建托盘
 */
function createTray() {
  const settings = storeUtils.getSettings()
  
  if (!settings.minimizeToTray) {
    return
  }

  // 创建托盘图标 (使用 base64 或默认图标)
  let iconPath = join(__dirname, '../../assets/tray.png')
  
  if (!existsSync(iconPath)) {
    // 如果没有图标文件，创建一个简单的图标
    iconPath = join(app.getAppPath(), 'assets', 'tray.png')
  }

  try {
    if (existsSync(iconPath)) {
      tray = new Tray(iconPath)
    } else {
      // 使用系统默认图标
      tray = new Tray(nativeImage.createEmpty())
    }
  } catch (error) {
    console.error('创建托盘失败:', error)
    tray = new Tray(nativeImage.createEmpty())
  }

  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '显示主窗口', 
      click: () => {
        mainWindow?.show()
        mainWindow?.focus()
      } 
    },
    { type: 'separator' },
    { 
      label: '退出', 
      click: () => {
        isQuitting = true
        app.exit()
      } 
    },
  ])

  tray.setContextMenu(contextMenu)
  
  tray.setToolTip('星聚 - 多元内容聚合工具')
  
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })
}

/**
 * 注册全局快捷键
 */
function registerShortcuts() {
  // Ctrl+Shift+X: 显示/隐藏主窗口
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  // Ctrl+Shift+M: 最小化到托盘
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    mainWindow?.hide()
  })
}

/**
 * 注销全局快捷键
 */
function unregisterShortcuts() {
  globalShortcut.unregisterAll()
}

/**
 * 设置开机自启动
 */
function setupAutoLaunch() {
  const settings = storeUtils.getSettings()
  const shouldAutoLaunch = settings.startOnBoot
  
  try {
    app.setLoginItemSettings({
      openAtLogin: shouldAutoLaunch,
      openAsHidden: true,
      args: [],
    })
  } catch (error) {
    console.error('设置开机自启动失败:', error)
  }
}

/**
 * 设置 IPC 处理器
 */
function setupWindowIpc() {
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
    const settings = storeUtils.getSettings()
    
    if (settings.minimizeToTray && tray) {
      win?.hide()
    } else {
      isQuitting = true
      win?.close()
    }
  })

  // 获取窗口状态
  ipcMain.handle('get-window-state', () => {
    return {
      isMaximized: mainWindow?.isMaximized() ?? false,
      isMinimized: mainWindow?.isMinimized() ?? false,
      isVisible: mainWindow?.isVisible() ?? false,
    }
  })
}

// 应用启动
app.whenReady().then(async () => {
  // 设置开机自启动
  setupAutoLaunch()
  
  // 注册快捷键
  registerShortcuts()
  
  // 创建窗口和托盘
  createWindow()
  createTray()
  
  // 设置 IPC 处理
  setupIpcHandlers(ipcMain)
  setupWindowIpc()
})

// 应用退出前清理
app.on('will-quit', () => {
  unregisterShortcuts()
  saveWindowState()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    mainWindow?.show()
    mainWindow?.focus()
  }
})

// 处理第二个实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
