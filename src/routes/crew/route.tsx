import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { Divider, Flex } from 'styled-system/jsx';
import { CrewsTable } from '~/components/crew/crews-table';
import type { Crew } from '~/data/types';
import { useApiData } from '~/hooks/use-api-data';
import { useSearchFilter } from '~/hooks/use-search-filter';
import { Heading, Input, Text } from '~/ui';

const fetchCrews = async (): Promise<Crew[]> => {
  const r = await fetch('/api/crews');
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

function RouteComponent() {
  const { guid: selectedGuid } = Route.useSearch();
  const navigate = useNavigate({ from: '/crew' });

  const { data: crews, isLoading } = useApiData(fetchCrews, {
    errorTitle: 'Failed to load crews',
  });

  const { search, setSearch, filtered } = useSearchFilter(
    crews,
    (c, q) =>
      c.name.toLowerCase().includes(q) ||
      c.captain.username.toLowerCase().includes(q) ||
      String(c.code).includes(q),
  );

  const handleOpenChange = useCallback(
    (crewGuid: string, open: boolean) => {
      navigate({ search: open ? { guid: crewGuid } : { guid: undefined } });
    },
    [navigate],
  );

  return (
    <Flex gap="4" flexDirection="column">
      <Heading>Crews</Heading>

      <Text textStyle="sm">Overview of all crews on this server.</Text>

      <Divider />

      <Input
        placeholder="Search by name, captain or code…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        maxW="sm"
      />

      <CrewsTable
        crews={filtered}
        search={search}
        selectedGuid={selectedGuid}
        onOpenChange={handleOpenChange}
        loading={isLoading}
      />
    </Flex>
  );
}

export const Route = createFileRoute('/crew')({
  validateSearch: (search) => ({
    guid: typeof search.guid === 'string' ? search.guid : undefined,
  }),
  component: RouteComponent,
});
