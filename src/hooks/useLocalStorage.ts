/**
 * 本地存储 Hook
 * Local Storage Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════════════════════════════════════════

interface UseLocalStorageOptions<T> {
  /** 是否在组件挂载时同步外部更改 */
  listenToStorageEvents?: boolean;
  /** 自定义序列化函数 */
  serialize?: (value: T) => string;
  /** 自定义反序列化函数 */
  deserialize?: (value: string) => T;
  /** 初始化时的回调 */
  onInit?: (value: T) => void;
  /** 更新时的回调 */
  onChange?: (newValue: T, oldValue: T) => void;
}

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// 主 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * localStorage 状态管理 Hook
 * @param key 存储键名
 * @param initialValue 初始值或初始值函数
 * @param options 配置选项
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): [T, SetValue<T>, () => void] {
  const {
    listenToStorageEvents = true,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onInit,
    onChange,
  } = options;

  // 用于存储旧值的引用
  const prevValueRef = useRef<T | null>(null);

  // 获取初始值
  const getStoredValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        // 如果没有存储值，使用初始值
        const initial = initialValue instanceof Function ? initialValue() : initialValue;
        return initial;
      }
      return deserialize(item) as T;
    } catch (error) {
      console.error(`[useLocalStorage] Error reading key "${key}":`, error);
      const initial = initialValue instanceof Function ? initialValue() : initialValue;
      return initial;
    }
  }, [key, initialValue, deserialize]);

  // 状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = getStoredValue();
    prevValueRef.current = value;
    onInit?.(value);
    return value;
  });

  // 设置值
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // 支持函数式更新
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // 更新状态
        setStoredValue(valueToStore);

        // 更新 localStorage
        localStorage.setItem(key, serialize(valueToStore));

        // 触发变更回调
        if (prevValueRef.current !== valueToStore) {
          onChange?.(valueToStore, prevValueRef.current as T);
          prevValueRef.current = valueToStore;
        }
      } catch (error) {
        console.error(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key, storedValue, serialize, onChange]
  );

  // 删除值
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      const initial = initialValue instanceof Function ? initialValue() : initialValue;
      setStoredValue(initial);
      prevValueRef.current = initial;
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  // 监听 storage 事件（跨标签页同步）
  useEffect(() => {
    if (!listenToStorageEvents) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) return;

      if (e.newValue === null) {
        // 值被删除
        const initial = initialValue instanceof Function ? initialValue() : initialValue;
        setStoredValue(initial);
        prevValueRef.current = initial;
      } else {
        // 值被更新
        try {
          const newValue = deserialize(e.newValue) as T;
          setStoredValue(newValue);
          prevValueRef.current = newValue;
        } catch (error) {
          console.error(`[useLocalStorage] Error parsing storage event:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, listenToStorageEvents, deserialize]);

  return [storedValue, setValue, removeValue];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 便捷 Hook
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 带有自动保存延迟的 localStorage Hook
 * @param key 存储键名
 * @param initialValue 初始值
 * @param delayMs 延迟保存时间（毫秒）
 */
export function useLocalStorageWithDebounce<T>(
  key: string,
  initialValue: T,
  delayMs: number = 500
): [T, SetValue<T>, () => void, boolean] {
  const [storedValue, setValue, removeValue] = useLocalStorage<T>(key, initialValue, {
    listenToStorageEvents: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const pendingValueRef = useRef<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSetValue: SetValue<T> = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      pendingValueRef.current = valueToStore;
      setIsSaving(true);

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // 设置新的延迟保存
      timeoutRef.current = setTimeout(() => {
        if (pendingValueRef.current !== null) {
          setValue(pendingValueRef.current);
          pendingValueRef.current = null;
        }
        setIsSaving(false);
      }, delayMs);
    },
    [storedValue, setValue, delayMs]
  );

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [storedValue, debouncedSetValue, removeValue, isSaving];
}

/**
 * 会话存储 Hook（使用 sessionStorage）
 * @param key 存储键名
 * @param initialValue 初始值
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, SetValue<T>, () => void] {
  const getStoredValue = useCallback((): T => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return initialValue instanceof Function ? initialValue() : initialValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[useSessionStorage] Error reading key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`[useSessionStorage] Error setting key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
    } catch (error) {
      console.error(`[useSessionStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ═══════════════════════════════════════════════════════════════════════════════
// 默认导出
// ═══════════════════════════════════════════════════════════════════════════════

export default useLocalStorage;