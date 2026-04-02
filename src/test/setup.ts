/* ========================================
   XingJu v2.1 - 测试配置
   ======================================== */

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 扩展expect匹配器
expect.extend(matchers)

// 每个测试后清理DOM
afterEach(() => {
  cleanup()
})

// 全局mock
vi.mock('@tauri-apps/api', () => ({
  invoke: vi.fn(),
  listen: vi.fn(() => Promise.resolve(() => {})),
  emit: vi.fn(),
}))