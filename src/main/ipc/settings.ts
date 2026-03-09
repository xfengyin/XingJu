// 设置管理 IPC 处理模块
import { storeUtils, AppSettings } from '../utils/store'
import { app, globalShortcut } from 'electron'

/**
 * 获取应用设置
 * @returns 应用设置对象
 */
export async function getSettings(): Promise<{
  success: boolean
  data?: AppSettings
  error?: string
}> {
  try {
    const settings = storeUtils.getSettings()
    return {
      success: true,
      data: settings,
    }
  } catch (error) {
    console.error('获取设置失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取设置失败',
    }
  }
}

/**
 * 更新应用设置
 * @param partialSettings 部分设置对象
 * @returns 更新结果
 */
export async function updateSettings(
  partialSettings: Partial<AppSettings>
): Promise<{
  success: boolean
  data?: AppSettings
  error?: string
}> {
  try {
    if (!partialSettings || typeof partialSettings !== 'object') {
      return {
        success: false,
        error: '设置参数无效',
      }
    }

    // 验证设置项
    const validKeys: (keyof AppSettings)[] = [
      'theme',
      'language',
      'downloadPath',
      'maxConcurrentDownloads',
      'searchProviders',
      'autoUpdate',
      'startOnBoot',
      'minimizeToTray',
    ]

    for (const key in partialSettings) {
      if (!validKeys.includes(key as keyof AppSettings)) {
        console.warn(`无效的设置项：${key}`)
      }
    }

    // 处理特殊设置项
    if (partialSettings.startOnBoot !== undefined) {
      try {
        app.setLoginItemSettings({
          openAtLogin: partialSettings.startOnBoot,
          openAsHidden: true,
        })
      } catch (error) {
        console.error('设置开机自启动失败:', error)
      }
    }

    // 处理快捷键设置
    if (partialSettings.shortcuts) {
      // 重新注册快捷键
      // 注意：需要在主进程中处理
      console.log('快捷键设置更新:', partialSettings.shortcuts)
    }

    const updatedSettings = storeUtils.updateSettings(partialSettings)
    return {
      success: true,
      data: updatedSettings,
    }
  } catch (error) {
    console.error('更新设置失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新设置失败',
    }
  }
}

/**
 * 重置设置为默认值
 */
export async function resetSettings(): Promise<{
  success: boolean
  data?: AppSettings
  error?: string
}> {
  try {
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
    }

    const updatedSettings = storeUtils.updateSettings(defaultSettings)
    return {
      success: true,
      data: updatedSettings,
    }
  } catch (error) {
    console.error('重置设置失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '重置设置失败',
    }
  }
}

/**
 * 获取特定设置项
 */
export async function getSetting<K extends keyof AppSettings>(
  key: K
): Promise<{
  success: boolean
  data?: AppSettings[K]
  error?: string
}> {
  try {
    const value = storeUtils.getSetting(key)
    return {
      success: true,
      data: value,
    }
  } catch (error) {
    console.error(`获取设置项 ${key} 失败:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取设置失败',
    }
  }
}

/**
 * 设置特定设置项
 */
export async function setSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<{
  success: boolean
  data?: AppSettings[K]
  error?: string
}> {
  try {
    storeUtils.setSetting(key, value)
    
    // 处理特殊设置项
    if (key === 'startOnBoot') {
      try {
        app.setLoginItemSettings({
          openAtLogin: value as boolean,
          openAsHidden: true,
        })
      } catch (error) {
        console.error('设置开机自启动失败:', error)
      }
    }

    const newValue = storeUtils.getSetting(key)
    return {
      success: true,
      data: newValue,
    }
  } catch (error) {
    console.error(`设置设置项 ${key} 失败:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '设置失败',
    }
  }
}
