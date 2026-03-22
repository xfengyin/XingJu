/**
 * 键盘快捷键 Hook
 * Keyboard Shortcut Hook
 */

import { useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════════════════════════════════════════

/** 修饰键状态 */
interface ModifierState {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

/** 快捷键配置 */
export interface KeyboardShortcut {
  /** 按键（不区分大小写） */
  key: string;
  /** 是否需要 Ctrl 键 */
  ctrl?: boolean;
  /** 是否需要 Shift 键 */
  shift?: boolean;
  /** 是否需要 Alt 键 */
  alt?: boolean;
  /** 是否需要 Meta 键（Cmd/Windows） */
  meta?: boolean;
  /** 触发的回调函数 */
  action: () => void;
  /** 快捷键描述（用于帮助提示） */
  description?: string;
  /** 是否阻止默认行为 */
  preventDefault?: boolean;
  /** 是否阻止事件冒泡 */
  stopPropagation?: boolean;
  /** 是否启用 */
  enabled?: boolean;
}

/** useKeyboard Hook 配置 */
export interface UseKeyboardOptions {
  /** 是否启用（默认 true） */
  enabled?: boolean;
  /** 目标元素（默认 document） */
  target?: HTMLElement | null;
  /** 是否阻止所有快捷键的默认行为 */
  preventDefaultAll?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 辅助函数
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 检查键盘事件是否匹配快捷键配置
 */
function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  // 检查按键
  const eventKey = event.key.toLowerCase();
  const shortcutKey = shortcut.key.toLowerCase();
  
  if (eventKey !== shortcutKey) {
    // 特殊按键映射
    const keyMap: Record<string, string[]> = {
      'arrowleft': ['arrowleft', 'left'],
      'arrowright': ['arrowright', 'right'],
      'arrowup': ['arrowup', 'up'],
      'arrowdown': ['arrowdown', 'down'],
      ' ': [' ', 'space'],
      'escape': ['escape', 'esc'],
      'enter': ['enter', 'return'],
    };
    
    const mappedKeys = keyMap[eventKey] || [eventKey];
    if (!mappedKeys.includes(shortcutKey)) {
      return false;
    }
  }

  // 检查修饰键
  const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
  const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
  const altMatch = shortcut.alt ? event.altKey : !event.altKey;
  const metaMatch = shortcut.meta ? event.metaKey : true; // meta 可选

  return ctrlMatch && shiftMatch && altMatch && metaMatch;
}

/**
 * 格式化快捷键为可读字符串
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.meta) parts.push('⌘');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  
  // 格式化按键
  let key = shortcut.key.toUpperCase();
  if (key === ' ') key = 'Space';
  if (key === 'ARROWLEFT') key = '←';
  if (key === 'ARROWRIGHT') key = '→';
  if (key === 'ARROWUP') key = '↑';
  if (key === 'ARROWDOWN') key = '↓';
  if (key === 'ESCAPE') key = 'Esc';
  if (key === 'ENTER') key = '↵';
  
  parts.push(key);
  
  return parts.join('+');
}

// ═══════════════════════════════════════════════════════════════════════════════
// 主 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 键盘快捷键 Hook
 * @param shortcuts 快捷键配置数组
 * @param options 配置选项
 */
export function useKeyboard(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardOptions = {}
): void {
  const {
    enabled = true,
    target = null,
    preventDefaultAll = false,
  } = options;

  // 使用 ref 存储最新的 shortcuts，避免频繁绑定/解绑
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 忽略输入框内的按键（除非明确指定）
      const target = event.target as HTMLElement;
      const isInputElement = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      // 遍历所有快捷键配置
      for (const shortcut of shortcutsRef.current) {
        // 检查是否启用
        if (shortcut.enabled === false) continue;
        
        // 输入框内只响应特定快捷键（如 Escape）
        if (isInputElement && !['Escape', 'Enter'].includes(shortcut.key)) {
          continue;
        }

        if (matchesShortcut(event, shortcut)) {
          // 阻止默认行为
          if (shortcut.preventDefault !== false || preventDefaultAll) {
            event.preventDefault();
          }
          
          // 阻止事件冒泡
          if (shortcut.stopPropagation) {
            event.stopPropagation();
          }
          
          // 执行回调
          shortcut.action();
          return;
        }
      }
    };

    const targetElement = target || document;
    targetElement.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [enabled, target, preventDefaultAll]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 便捷 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 单个快捷键 Hook
 * @param key 按键
 * @param action 回调函数
 * @param options 额外选项
 */
export function useShortcut(
  key: string,
  action: () => void,
  options: Omit<KeyboardShortcut, 'key' | 'action'> & UseKeyboardOptions = {}
): void {
  const {
    ctrl,
    shift,
    alt,
    meta,
    description,
    preventDefault = true,
    stopPropagation = false,
    enabled = true,
    target,
    preventDefaultAll,
  } = options;

  const shortcut: KeyboardShortcut = {
    key,
    action,
    ctrl,
    shift,
    alt,
    meta,
    description,
    preventDefault,
    stopPropagation,
    enabled,
  };

  useKeyboard([shortcut], { enabled, target, preventDefaultAll });
}

/**
 * 阅读器常用快捷键预设
 */
export function useReaderShortcuts(handlers: {
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  onToggleMode?: () => void;
  onToggleFullscreen?: () => void;
  onBack?: () => void;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}, enabled: boolean = true): void {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onPrevPage) {
    shortcuts.push(
      { key: 'ArrowLeft', action: handlers.onPrevPage, description: '上一页' },
      { key: 'ArrowUp', action: handlers.onPrevPage, description: '上一页' },
    );
  }

  if (handlers.onNextPage) {
    shortcuts.push(
      { key: 'ArrowRight', action: handlers.onNextPage, description: '下一页' },
      { key: 'ArrowDown', action: handlers.onNextPage, description: '下一页' },
      { key: ' ', action: handlers.onNextPage, description: '下一页' },
    );
  }

  if (handlers.onPrevChapter) {
    shortcuts.push(
      { key: 'PageUp', action: handlers.onPrevChapter, description: '上一章' },
    );
  }

  if (handlers.onNextChapter) {
    shortcuts.push(
      { key: 'PageDown', action: handlers.onNextChapter, description: '下一章' },
    );
  }

  if (handlers.onToggleMode) {
    shortcuts.push(
      { key: 'm', action: handlers.onToggleMode, description: '切换阅读模式' },
      { key: 'M', action: handlers.onToggleMode, description: '切换阅读模式' },
    );
  }

  if (handlers.onToggleFullscreen) {
    shortcuts.push(
      { key: 'f', action: handlers.onToggleFullscreen, description: '全屏' },
      { key: 'F', action: handlers.onToggleFullscreen, description: '全屏' },
      { key: 'F11', action: handlers.onToggleFullscreen, description: '全屏' },
    );
  }

  if (handlers.onBack) {
    shortcuts.push(
      { key: 'Escape', action: handlers.onBack, description: '返回/退出' },
    );
  }

  if (handlers.onOpenMenu) {
    shortcuts.push(
      { key: 'm', ctrl: true, action: handlers.onOpenMenu, description: '打开菜单' },
    );
  }

  if (handlers.onOpenSettings) {
    shortcuts.push(
      { key: 's', ctrl: true, action: handlers.onOpenSettings, description: '打开设置' },
    );
  }

  useKeyboard(shortcuts, { enabled });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 默认导出
// ═══════════════════════════════════════════════════════════════════════════════

export default useKeyboard;