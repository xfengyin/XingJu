/**
 * Hooks 统一导出
 * Hooks Index
 */

export { 
  useLocalStorage, 
  useLocalStorageWithDebounce, 
  useSessionStorage 
} from './useLocalStorage';

export { 
  useKeyboard, 
  useShortcut, 
  useReaderShortcuts,
  formatShortcut 
} from './useKeyboard';

export type { KeyboardShortcut, UseKeyboardOptions } from './useKeyboard';