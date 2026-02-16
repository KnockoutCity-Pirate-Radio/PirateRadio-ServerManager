import { useMemo, useState } from 'react';

interface UseSearchFilterResult<T> {
  /** Current search query string */
  search: string;
  /** Update the search query */
  setSearch: (value: string) => void;
  /** Items filtered by the current search query, or all items when query is empty */
  filtered: T[];
}

/**
 * Manages a search query and filters `items` using `predicate`.
 * When the query is empty the full list is returned unfiltered.
 * Returns `{ search, setSearch, filtered }`.
 */
export const useSearchFilter = <T>(
  items: T[] | null,
  predicate: (item: T, query: string) => boolean,
): UseSearchFilterResult<T> => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const list = items ?? [];
    const query = search.trim();
    if (!query) return list;
    const lower = query.toLowerCase();
    return list.filter((item) => predicate(item, lower));
  }, [items, search, predicate]);

  return { search, setSearch, filtered };
};
