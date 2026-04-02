/* ========================================
   XingJu v2.1 - App Store 测试
   ======================================== */

import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from '../../store'

describe('App Store', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
  })

  it('应该有正确的初始状态', () => {
    expect(store.getState().activeModule).toBe('music')
    expect(store.getState().searchQuery).toBe('')
  })

  it('应该能切换模块', () => {
    store.getState().setActiveModule('video')
    expect(store.getState().activeModule).toBe('video')
  })

  it('应该能设置搜索关键词', () => {
    const query = 'test query'
    store.getState().setSearchQuery(query)
    expect(store.getState().searchQuery).toBe(query)
  })
})
