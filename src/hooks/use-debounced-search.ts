import debounce from 'lodash.debounce';
import { useRef, useState } from 'react';

interface UseDebouncedSearchResult {
  /** Raw input value to bind to the search input's `value` prop */
  inputValue: string;
  /** Call this with the new input string; updates the display value immediately and debounces the committed search */
  onInputChange: (value: string) => void;
  /** Debounced search string to use for filtering/querying */
  search: string;
}

/**
 * Manages a search input with a debounced committed value.
 * `inputValue` updates immediately (for controlled input); `search` updates after `delayMs`.
 * Returns `{ inputValue, onInputChange, search }`.
 */
export const useDebouncedSearch = (delayMs = 150): UseDebouncedSearchResult => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  const debouncedSetSearch = useRef(debounce(setSearch, delayMs)).current;

  const onInputChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  return { inputValue, onInputChange, search };
};
