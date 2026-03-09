// 内容搜索 IPC 处理模块
import { spawn } from 'child_process'
import { join } from 'path'

// 搜索结果接口
export interface SearchResult {
  id: string
  title: string
  artist?: string
  album?: string
  cover?: string
  url?: string
  duration?: number
  source: string
  type: 'music' | 'video' | 'novel' | 'manga'
}

// 音乐搜索结果
export interface MusicResult extends SearchResult {
  type: 'music'
  artist: string
  album?: string
  duration: number
}

// 视频搜索结果
export interface VideoResult extends SearchResult {
  type: 'video'
  artist?: string
  duration?: number
  views?: number
}

// 小说搜索结果
export interface NovelResult extends SearchResult {
  type: 'novel'
  author: string
  chapters?: number
  status?: string
  description?: string
}

// 漫画搜索结果
export interface MangaResult extends SearchResult {
  type: 'manga'
  author: string
  chapters?: number
  status?: string
  description?: string
}

// 搜索响应接口
export interface SearchResponse {
  success: boolean
  data: SearchResult[]
  error?: string
  total?: number
}

// Python 后端配置
const PYTHON_BACKEND = {
  enabled: process.env.ENABLE_PYTHON_BACKEND === 'true',
  script: join(__dirname, '../../python/search.py'),
  timeout: 30000, // 30 秒超时
}

/**
 * 调用 Python 后端进行搜索
 */
async function callPythonBackend(
  searchType: 'music' | 'video' | 'novel' | 'manga',
  query: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [PYTHON_BACKEND.script, searchType, query], {
      cwd: join(__dirname, '../../python'),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    let hasError = false

    const timeout = setTimeout(() => {
      pythonProcess.kill()
      hasError = true
      reject(new Error('搜索超时'))
    }, PYTHON_BACKEND.timeout)

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
      console.error('Python 错误:', stderr)
    })

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout)
      
      if (hasError) return
      
      if (code === 0) {
        try {
          const result = JSON.parse(stdout)
          resolve(result)
        } catch (error) {
          console.error('解析 Python 输出失败:', error)
          resolve([])
        }
      } else {
        console.error(`Python 进程退出，代码：${code}`)
        resolve([])
      }
    })

    pythonProcess.on('error', (error) => {
      clearTimeout(timeout)
      console.error('启动 Python 进程失败:', error)
      resolve([])
    })
  })
}

/**
 * 重试包装器
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`尝试 ${attempt}/${maxRetries} 失败:`, lastError.message)
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
      }
    }
  }
  
  throw lastError || new Error('操作失败')
}

/**
 * 搜索音乐
 * @param query 搜索关键词
 * @returns 音乐搜索结果
 */
export async function searchMusic(query: string): Promise<SearchResponse> {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        data: [],
        error: '搜索关键词不能为空',
      }
    }

    console.log('搜索音乐:', query)

    // 尝试调用 Python 后端
    if (PYTHON_BACKEND.enabled) {
      try {
        const results = await withRetry(() => callPythonBackend('music', query))
        return {
          success: true,
          data: results as SearchResult[],
          total: results.length,
        }
      } catch (error) {
        console.warn('Python 后端搜索失败，使用备用方案:', error)
      }
    }

    // 备用方案：返回空结果（前端可以显示提示）
    return {
      success: true,
      data: [],
      total: 0,
      error: '暂未配置音乐搜索源',
    }
  } catch (error) {
    console.error('音乐搜索失败:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '音乐搜索失败',
    }
  }
}

/**
 * 搜索视频
 * @param query 搜索关键词
 * @returns 视频搜索结果
 */
export async function searchVideo(query: string): Promise<SearchResponse> {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        data: [],
        error: '搜索关键词不能为空',
      }
    }

    console.log('搜索视频:', query)

    // 尝试调用 Python 后端
    if (PYTHON_BACKEND.enabled) {
      try {
        const results = await withRetry(() => callPythonBackend('video', query))
        return {
          success: true,
          data: results as SearchResult[],
          total: results.length,
        }
      } catch (error) {
        console.warn('Python 后端搜索失败，使用备用方案:', error)
      }
    }

    // 备用方案
    return {
      success: true,
      data: [],
      total: 0,
      error: '暂未配置视频搜索源',
    }
  } catch (error) {
    console.error('视频搜索失败:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '视频搜索失败',
    }
  }
}

/**
 * 搜索小说
 * @param query 搜索关键词
 * @returns 小说搜索结果
 */
export async function searchNovel(query: string): Promise<SearchResponse> {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        data: [],
        error: '搜索关键词不能为空',
      }
    }

    console.log('搜索小说:', query)

    // 尝试调用 Python 后端
    if (PYTHON_BACKEND.enabled) {
      try {
        const results = await withRetry(() => callPythonBackend('novel', query))
        return {
          success: true,
          data: results as SearchResult[],
          total: results.length,
        }
      } catch (error) {
        console.warn('Python 后端搜索失败，使用备用方案:', error)
      }
    }

    // 备用方案
    return {
      success: true,
      data: [],
      total: 0,
      error: '暂未配置小说搜索源',
    }
  } catch (error) {
    console.error('小说搜索失败:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '小说搜索失败',
    }
  }
}

/**
 * 搜索漫画
 * @param query 搜索关键词
 * @returns 漫画搜索结果
 */
export async function searchManga(query: string): Promise<SearchResponse> {
  try {
    if (!query || query.trim() === '') {
      return {
        success: false,
        data: [],
        error: '搜索关键词不能为空',
      }
    }

    console.log('搜索漫画:', query)

    // 尝试调用 Python 后端
    if (PYTHON_BACKEND.enabled) {
      try {
        const results = await withRetry(() => callPythonBackend('manga', query))
        return {
          success: true,
          data: results as SearchResult[],
          total: results.length,
        }
      } catch (error) {
        console.warn('Python 后端搜索失败，使用备用方案:', error)
      }
    }

    // 备用方案
    return {
      success: true,
      data: [],
      total: 0,
      error: '暂未配置漫画搜索源',
    }
  } catch (error) {
    console.error('漫画搜索失败:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '漫画搜索失败',
    }
  }
}
