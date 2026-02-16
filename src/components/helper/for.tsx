import type { ReactNode } from 'react';

export interface ForProps<T> {
  /**
   * The array to iterate over
   */
  each: T[] | readonly T[] | undefined | null;
  /**
   * The fallback content to render when the array is empty or undefined
   */
  fallback?: ReactNode;
  /**
   * The render function to render each item in the array
   */
  children: (item: T, index: number) => ReactNode;
}

export function For<T>(props: ForProps<T>): ReactNode {
  const { each, fallback, children } = props;

  if (!each || each.length === 0) {
    return fallback ?? null;
  }

  return each.map((item, index) => children(item, index));
}
