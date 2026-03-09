// 下载管理 IPC 处理模块
import { storeUtils, AppSettings } from '../utils/store'
import { createWriteStream, existsSync, statSync, mkdirSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import { spawn } from 'child_process'

// 下载任务接口
export interface DownloadTask {
  id: string
  url: string
  type: 'music' | 'video' | 'novel' | 'manga'
  title: string
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed'
  progress: number
  speed?: number
  size?: number
  downloaded?: number
  createdAt: number
  startedAt?: number
  completedAt?: number
  errorMessage?: string
  outputPath?: string
}

// 下载进度接口
export interface DownloadProgress {
  id: string
  progress: number
  speed?: number
  downloaded?: number
  size?: number
  status: DownloadTask['status']
  eta?: number
}

// 开始下载响应
export interface StartDownloadResponse {
  success: boolean
  taskId?: string
  error?: string
}

// 暂停下载响应
export interface PauseDownloadResponse {
  success: boolean
  error?: string
}

// 获取下载进度响应
export interface GetDownloadProgressResponse {
  success: boolean
  data?: DownloadProgress[]
  error?: string
}

// 活动下载任务管理器
class DownloadManager {
  private activeDownloads = new Map<string, NodeJS.Timeout>()
  private downloadControllers = new Map<string, any>()
  private maxConcurrent: number = 3

  constructor() {
    // 从设置中获取最大并发数
    const settings = storeUtils.getSettings()
    this.maxConcurrent = settings.maxConcurrentDownloads
  }

  /**
   * 获取当前活动下载数量
   */
  getActiveCount(): number {
    let count = 0
    const queue = storeUtils.getDownloadQueue()
    queue.forEach(task => {
      if (task.status === 'downloading') count++
    })
    return count
  }

  /**
   * 开始下载
   */
  async startDownload(task: {
    url: string
    type: 'music' | 'video' | 'novel' | 'manga'
    title: string
  }): Promise<{ success: boolean; taskId?: string; error?: string }> {
    // 检查并发限制
    if (this.getActiveCount() >= this.maxConcurrent) {
      return {
        success: false,
        error: '已达到最大并发下载数',
      }
    }

    // 生成任务 ID
    const taskId = `${task.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // 获取下载路径
    const settings = storeUtils.getSettings()
    const downloadPath = settings.downloadPath || app.getPath('downloads')
    
    // 确保下载目录存在
    const typeDir = join(downloadPath, task.type)
    if (!existsSync(typeDir)) {
      mkdirSync(typeDir, { recursive: true })
    }

    // 创建下载任务
    const downloadTask: DownloadTask = {
      id: taskId,
      url: task.url,
      type: task.type,
      title: task.title,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      outputPath: join(typeDir, this.sanitizeFilename(task.title)),
    }

    // 添加到存储
    storeUtils.addDownloadTask({
      id: taskId,
      url: task.url,
      type: task.type,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
    })

    // 启动下载
    this.executeDownload(taskId)

    return {
      success: true,
      taskId,
    }
  }

  /**
   * 执行下载
   */
  private async executeDownload(taskId: string) {
    const queue = storeUtils.getDownloadQueue()
    const task = queue.find(t => t.id === taskId)
    
    if (!task) return

    // 更新状态为下载中
    storeUtils.updateDownloadTask(taskId, {
      status: 'downloading',
      startedAt: Date.now(),
    })

    try {
      // 使用 yt-dlp 或其他下载工具
      const outputPath = (task as DownloadTask).outputPath || task.url
      const controller = await this.startYtDlpDownload(task.url, outputPath, taskId)
      
      this.downloadControllers.set(taskId, controller)
    } catch (error) {
      console.error(`下载失败 [${taskId}]:`, error)
      storeUtils.updateDownloadTask(taskId, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : '下载失败',
      })
    }
  }

  /**
   * 使用 yt-dlp 下载
   */
  private startYtDlpDownload(url: string, outputPath: string, taskId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const args = [
        '--output', `${outputPath}.%(ext)s`,
        '--no-playlist',
        '--newline',
        '--progress',
        url,
      ]

      const process = spawn('yt-dlp', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      let lastDownloaded = 0
      let lastTime = Date.now()
      let speed = 0

      // 检查是否支持断点续传
      const existingFile = `${outputPath}.tmp`
      if (existsSync(existingFile)) {
        const stats = statSync(existingFile)
        lastDownloaded = stats.size
        args.unshift('--download-archive', existingFile)
      }

      process.stdout.on('data', (data) => {
        const output = data.toString()
        
        // 解析进度信息
        const progressMatch = output.match(/\[([^\]]+)\]\s+(\d+\.?\d*)%.*?(\d+\.?\d*)([KM]?iB)/)
        if (progressMatch) {
          const progress = parseFloat(progressMatch[2])
          const downloaded = parseFloat(progressMatch[3])
          const unit = progressMatch[4]
          
          // 计算速度
          const now = Date.now()
          const timeDiff = (now - lastTime) / 1000
          if (timeDiff > 0) {
            speed = (downloaded - lastDownloaded) / timeDiff
            lastDownloaded = downloaded
            lastTime = now
          }

          // 更新进度
          storeUtils.updateDownloadTask(taskId, {
            progress,
            speed,
            downloaded: downloaded * 1024 * 1024, // 转换为字节
          })
        }
      })

      process.stderr.on('data', (data) => {
        console.error(`yt-dlp 错误 [${taskId}]:`, data.toString())
      })

      process.on('close', (code) => {
        this.downloadControllers.delete(taskId)
        
        if (code === 0) {
          storeUtils.updateDownloadTask(taskId, {
            status: 'completed',
            progress: 100,
            completedAt: Date.now(),
          })
          resolve({ process })
        } else {
          reject(new Error(`下载进程退出，代码：${code}`))
        }
      })

      process.on('error', (error) => {
        this.downloadControllers.delete(taskId)
        reject(error)
      })

      resolve({ process })
    })
  }

  /**
   * 暂停下载
   */
  async pauseDownload(taskId: string): Promise<{ success: boolean; error?: string }> {
    const queue = storeUtils.getDownloadQueue()
    const task = queue.find(t => t.id === taskId)

    if (!task) {
      return { success: false, error: '任务不存在' }
    }

    if (task.status === 'completed' || task.status === 'failed') {
      return { success: false, error: '任务已完成或失败，无法暂停' }
    }

    // 停止下载进程
    const controller = this.downloadControllers.get(taskId)
    if (controller?.process) {
      controller.process.kill('SIGSTOP')
    }

    // 更新状态
    storeUtils.updateDownloadTask(taskId, {
      status: 'paused',
    })

    console.log('暂停下载:', taskId)
    return { success: true }
  }

  /**
   * 恢复下载
   */
  async resumeDownload(taskId: string): Promise<{ success: boolean; error?: string }> {
    const queue = storeUtils.getDownloadQueue()
    const task = queue.find(t => t.id === taskId)

    if (!task) {
      return { success: false, error: '任务不存在' }
    }

    if (task.status !== 'paused') {
      return { success: false, error: '任务未暂停' }
    }

    // 恢复下载进程
    const controller = this.downloadControllers.get(taskId)
    if (controller?.process) {
      controller.process.kill('SIGCONT')
    } else {
      // 如果没有控制器，重新启动下载
      this.executeDownload(taskId)
    }

    // 更新状态
    storeUtils.updateDownloadTask(taskId, {
      status: 'downloading',
    })

    console.log('恢复下载:', taskId)
    return { success: true }
  }

  /**
   * 取消下载
   */
  async cancelDownload(taskId: string): Promise<{ success: boolean; error?: string }> {
    // 停止下载进程
    const controller = this.downloadControllers.get(taskId)
    if (controller?.process) {
      controller.process.kill('SIGTERM')
    }

    // 从存储中删除任务
    storeUtils.removeDownloadTask(taskId)
    this.downloadControllers.delete(taskId)

    console.log('取消下载:', taskId)
    return { success: true }
  }

  /**
   * 获取下载进度
   */
  getDownloadProgress(taskIds?: string[]): GetDownloadProgressResponse {
    try {
      const queue = storeUtils.getDownloadQueue()

      // 过滤指定任务
      let filteredQueue = queue
      if (taskIds && taskIds.length > 0) {
        filteredQueue = queue.filter(task => taskIds.includes(task.id))
      }

      // 转换为进度格式
      const progressList: DownloadProgress[] = filteredQueue.map(task => ({
        id: task.id,
        progress: task.progress,
        speed: (task as DownloadTask).speed,
        downloaded: (task as DownloadTask).downloaded,
        size: (task as DownloadTask).size,
        status: task.status,
        eta: task.status === 'downloading' && task.startedAt && task.progress > 0
          ? Math.max(0, (Date.now() - task.startedAt) / task.progress * (100 - task.progress))
          : undefined,
      }))

      return {
        success: true,
        data: progressList,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取下载进度失败',
      }
    }
  }

  /**
   * 清理文件名
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100)
  }
}

// 创建下载管理器实例
const downloadManager = new DownloadManager()

/**
 * 开始下载
 */
export async function startDownload(task: {
  url: string
  type: 'music' | 'video' | 'novel' | 'manga'
  title: string
}): Promise<StartDownloadResponse> {
  try {
    if (!task.url || !task.type || !task.title) {
      return {
        success: false,
        error: '下载参数不完整',
      }
    }

    return await downloadManager.startDownload(task)
  } catch (error) {
    console.error('开始下载失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '开始下载失败',
    }
  }
}

/**
 * 暂停下载
 */
export async function pauseDownload(taskId: string): Promise<PauseDownloadResponse> {
  return await downloadManager.pauseDownload(taskId)
}

/**
 * 恢复下载
 */
export async function resumeDownload(taskId: string): Promise<PauseDownloadResponse> {
  return await downloadManager.resumeDownload(taskId)
}

/**
 * 取消下载
 */
export async function cancelDownload(taskId: string): Promise<PauseDownloadResponse> {
  return await downloadManager.cancelDownload(taskId)
}

/**
 * 获取下载进度
 */
export async function getDownloadProgress(taskIds?: string[]): Promise<GetDownloadProgressResponse> {
  return downloadManager.getDownloadProgress(taskIds)
}
