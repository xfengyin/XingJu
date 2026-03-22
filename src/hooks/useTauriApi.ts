/** Tauri API 调用 Hook - XingJu v2.0 */
import { useCallback, useState } from 'react'

/** 检查是否在 Tauri 环境中运行 */
const isTauri = () => {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

/** Tauri API Hook */
export function useTauriApi() {
  const [error, setError] = useState<string | null>(null)

  /** 调用 Tauri 后端命令 */
  const invoke = useCallback(async <T,>(cmd: string, args?: Record<string, unknown>): Promise<T | null> => {
    setError(null)

    if (!isTauri()) {
      console.warn(`[Tauri] Not in Tauri environment, skipping command: ${cmd}`)
      return null
    }

    try {
      // 动态导入 Tauri API (v1 uses @tauri-apps/api/tauri)
      const tauriModule = await import('@tauri-apps/api/tauri')
      const result = await tauriModule.invoke<T>(cmd, args)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      console.error(`[Tauri] Command ${cmd} failed:`, msg)
      return null
    }
  }, [])

  return { invoke, error, isTauri: isTauri() }
}