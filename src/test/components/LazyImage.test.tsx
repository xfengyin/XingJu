/* ========================================
   XingJu v2.1 - LazyImage 组件测试
   ======================================== */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import { LazyImage } from '../../components/common/LazyImage'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn((element) => {
    // 模拟元素进入视口
    setTimeout(() => {
      callback([{ isIntersecting: true, target: element }])
    }, 0)
  }),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))

describe('LazyImage', () => {
  const mockSrc = 'https://example.com/image.jpg'
  const mockAlt = 'Test Image'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该显示占位符', () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} />)
    
    // 检查占位符是否存在
    expect(screen.getByText('🖼️')).toBeInTheDocument()
  })

  it('应该在图片进入视口时加载', async () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} />)
    
    // 等待IntersectionObserver触发
    await waitFor(() => {
      const img = screen.queryByAltText(mockAlt)
      expect(img).toBeInTheDocument()
    })
  })

  it('应该在图片加载完成后显示图片', async () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} />)
    
    await waitFor(() => {
      const img = screen.getByAltText(mockAlt)
      // 模拟图片加载完成
      fireEvent.load(img)
      expect(img).toHaveClass('opacity-100')
    })
  })

  it('应该使用自定义占位符', () => {
    render(<LazyImage src={mockSrc} alt={mockAlt} placeholder="Loading..." />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
