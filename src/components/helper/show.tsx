import { isValidElement, type ReactNode } from 'react';

export interface ShowProps<T = unknown> {
  when: T | null | undefined;
  fallback?: ReactNode;
  children: ReactNode | ((value: T) => ReactNode);
}

export function Show<T = unknown>(props: ShowProps<T>): ReactNode {
  const { when, fallback, children } = props;

  if (!when) {
    return fallback ?? null;
  }

  const result = typeof children === 'function' ? children(when) : children;

  // biome-ignore lint/complexity/noUselessFragments: Fragments are necessary here to handle non-element ReactNodes
  return isValidElement(result) ? result : <>{result}</>;
}
