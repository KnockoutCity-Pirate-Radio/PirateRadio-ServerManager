import { useCallback, useEffect, useState } from 'react';
import { toaster } from '~/ui';

interface UseApiDataOptions {
  /** Toast title shown on fetch error */
  errorTitle: string;
}

interface UseApiDataResult<T> {
  /** The fetched data, or null if not yet loaded */
  data: T | null;
  /** True while a fetch is in flight */
  loading: boolean;
  /** True only on the initial load before any data has arrived */
  isLoading: boolean;
  /** Re-runs the fetch and updates data */
  reload: () => void;
}

/**
 * Fetches data from `fetcher` on mount, managing loading/error state.
 * Shows an error toast on failure.
 * Pass a stable (module-level or `useCallback`-wrapped) `fetcher` to avoid re-fetch loops.
 * Returns `{ data, loading, isLoading, reload }`.
 */
export const useApiData = <T>(
  fetcher: () => Promise<T>,
  options: UseApiDataOptions,
): UseApiDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetcher()
      .then(setData)
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: options.errorTitle,
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  }, [fetcher, options.errorTitle]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, isLoading: loading && data === null, reload };
};
