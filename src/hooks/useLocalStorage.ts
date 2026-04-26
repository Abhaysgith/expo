'use client';

import { useState, useEffect } from 'react';

/**
 * Persists state to localStorage with a given key.
 * Handles SSR (no localStorage on server) gracefully.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Quota exceeded or private mode — silently degrade
    }
  };

  return [storedValue, setValue] as const;
}
