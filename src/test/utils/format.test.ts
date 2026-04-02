/* ========================================
   XingJu v2.1 - 工具函数测试
   ======================================== */

import { describe, it, expect } from 'vitest'
import { formatDuration } from '../../services/api'

describe('formatDuration', () => {
  it('应该正确格式化秒数为 mm:ss', () => {
    expect(formatDuration(125)).toBe('2:05')
  })

  it('应该正确处理小于60秒的时间', () => {
    expect(formatDuration(45)).toBe('0:45')
  })

  it('应该正确处理超过一小时的时间', () => {
    expect(formatDuration(3661)).toBe('61:01')
  })

  it('应该正确处理0秒', () => {
    expect(formatDuration(0)).toBe('0:00')
  })
})
