# 测试基础设施

本项目使用 **Vitest** 作为测试框架，配合 **React Testing Library** 进行组件测试。

## 目录结构

```
src/
├── __tests__/
│   ├── setup.ts                    # 测试环境配置
│   ├── components/                 # 组件测试
│   │   └── MangaReader.test.tsx
│   └── services/                   # 服务层测试
│       ├── api.test.ts
│       └── novelService.test.ts
├── services/                       # API 服务层
│   ├── api.ts                      # 基础请求封装
│   ├── novelService.ts             # 小说服务
│   └── index.ts
└── components/                     # React 组件
```

## 测试命令

```bash
# 运行测试（监视模式）
npm test

# 运行测试（单次执行）
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# 启动测试 UI 界面
npm run test:ui
```

## 技术栈

- **Vitest** - 快速的 Vite 原生测试框架
- **@testing-library/react** - React 测试工具
- **@testing-library/jest-dom** - DOM 匹配器扩展
- **jsdom** - 模拟浏览器环境
- **@vitest/coverage-v8** - V8 引擎覆盖率

## 测试示例

### 服务层测试

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from '../../services/api';

vi.mock('../../services/api', () => ({
  get: vi.fn(),
}));

describe('Novel Service', () => {
  it('should search novels', async () => {
    const mockResult = { novels: [], total: 0 };
    
    mockGet.mockResolvedValueOnce({
      data: mockResult,
      error: null,
      status: 200,
    });

    const result = await searchNovels({ keyword: 'test' });
    expect(result.data).toEqual(mockResult);
  });
});
```

### 组件测试

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MangaReader } from '../../components/Manga/MangaReader';

describe('MangaReader', () => {
  it('should render chapter title', () => {
    render(<MangaReader chapters={mockChapters} currentChapterIndex={0} />);
    expect(screen.getByText('第一章')).toBeInTheDocument();
  });
});
```

## 配置说明

- **vitest.config.ts** - Vitest 测试配置
- **tsconfig.json** - TypeScript 配置（包含 vitest/globals 类型）
- **src/__tests__/setup.ts** - 测试环境初始化（localStorage mock, etc.）

## 最佳实践

1. **测试文件命名**: 使用 `.test.ts` 或 `.spec.ts` 后缀
2. **测试组织**: 使用 `describe` 分组，`it` 定义具体测试
3. **Mock 策略**: 对外部依赖使用 `vi.mock()` 进行模拟
4. **清理**: 测试后自动清理 DOM 和 mock 状态
5. **异步测试**: 使用 `async/await` 处理异步操作