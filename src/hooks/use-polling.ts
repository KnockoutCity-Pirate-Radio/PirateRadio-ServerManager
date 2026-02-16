import { useEffect } from 'react';

/**
 * Calls `callback` immediately on mount, then on every `intervalMs` interval.
 * Cleans up the interval on unmount or when dependencies change.
 * Pass a stable (`useCallback`-wrapped) `callback` to avoid interval resets.
 */
export const usePolling = (callback: () => void, intervalMs: number): void => {
  useEffect(() => {
    callback();
    const id = setInterval(callback, intervalMs);
    return () => clearInterval(id);
  }, [callback, intervalMs]);
};
