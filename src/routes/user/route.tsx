import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Divider, Flex } from 'styled-system/jsx';
import { UsersTable } from '~/components/user/users-table';
import type { User } from '~/data/types';
import { useApiData } from '~/hooks/use-api-data';
import { useSearchFilter } from '~/hooks/use-search-filter';
import { Heading, Input, Text } from '~/ui';

const fetchUsers = async (): Promise<User[]> => {
  const r = await fetch('/api/users');
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

function RouteComponent() {
  const { id: selectedId } = Route.useSearch();
  const navigate = useNavigate({ from: '/user' });

  const {
    data: users,
    isLoading,
    reload,
  } = useApiData(fetchUsers, {
    errorTitle: 'Failed to load users',
  });

  const { search, setSearch, filtered } = useSearchFilter(
    users,
    (u, q) =>
      u.username.toLowerCase().includes(q) ||
      (u.publisherUsername?.toLowerCase().includes(q) ?? false) ||
      u.id.includes(q),
  );

  const handleOpenChange = useCallback(
    (userId: string, open: boolean) => {
      navigate({ search: open ? { id: userId } : { id: undefined } });
    },
    [navigate],
  );

  return (
    <Flex gap="4" flexDirection="column">
      <Heading>Users</Heading>

      <Text textStyle="sm">
        Overview of all users that have an account on this server.
      </Text>

      <Divider />

      <Input
        placeholder="Search by username or ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        maxW="sm"
      />

      <UsersTable
        users={filtered}
        search={search}
        selectedId={selectedId}
        onOpenChange={handleOpenChange}
        onReload={reload}
        loading={isLoading}
      />
    </Flex>
  );
}

export const Route = createFileRoute('/user')({
  validateSearch: (search) => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: RouteComponent,
});
