/* ========================================
   XingJu v2.1 - 测试工具函数
   ======================================== */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AppStore, createStore } from '../../store'

// 扩展render函数，自动包裹Provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
}

export function renderWithProviders(
  ui: ReactElement,
  { store = createStore(), ...renderOptions }: CustomRenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // 这里可以添加Provider包装
    return <>{children}</>
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// 重新导出所有testing-library内容
export * from '@testing-library/react'
export { renderWithProviders }
