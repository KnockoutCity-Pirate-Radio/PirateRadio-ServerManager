import { createFileRoute } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { Divider, Flex, Grid } from 'styled-system/jsx';
import { ConnectedPlayersTable } from '~/components/dashboard/connected-players-table';
import { StatCard } from '~/components/dashboard/stat-card';
import { Show } from '~/components/helper/show';
import type { DenyPeriod, Stats } from '~/data/types';
import { usePolling } from '~/hooks/use-polling';
import { Alert, Heading, Spinner, Text, toaster } from '~/ui';

const fetchMaintenance = async (): Promise<DenyPeriod[]> => {
  const r = await fetch('/api/maintenance');
  if (!r.ok) return [];
  return r.json();
};

const fetchStats = async (): Promise<Stats> => {
  const r = await fetch('/api/stats');
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

const RouteComponent = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePeriods, setActivePeriods] = useState<DenyPeriod[]>([]);

  const load = useCallback(() => {
    const now = DateTime.now().toSeconds();
    Promise.all([fetchStats(), fetchMaintenance()])
      .then(([data, periods]) => {
        setStats(data);
        setActivePeriods(
          periods.filter((p) => p.startTime <= now && p.endTime >= now),
        );
      })
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: 'Failed to load stats',
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  usePolling(load, 10_000);

  const isLoading = loading && stats === null;
  const inMaintenance = activePeriods.length > 0;
  const maintenanceMessage = activePeriods[0]?.messages.find(
    (m) => m.languageCode === 'en',
  )?.message;
  const maintenanceEnd = activePeriods[0]
    ? DateTime.fromSeconds(activePeriods[0].endTime).toFormat(
        'yyyy-MM-dd HH:mm',
      )
    : null;

  return (
    <Flex gap="4" flexDirection="column">
      <Flex justify="space-between" align="center">
        <Heading>Dashboard</Heading>
        {!isLoading && <Spinner size="sm" color="fg.muted" />}
      </Flex>

      <Text textStyle="sm">
        Live overview of the server and connected players.
      </Text>

      <Show when={inMaintenance}>
        <Alert.Root status="error" variant="solid" p="5">
          <Alert.Indicator />
          <Alert.Content gap="1">
            <Alert.Title textStyle="md" fontWeight="bold">
              Server is in Maintenance Mode
            </Alert.Title>
            <Alert.Description>
              {maintenanceMessage ?? 'Players are currently unable to log in.'}
              <Show when={maintenanceEnd}>
                {(end) => (
                  <Text as="span" fontWeight="medium">
                    {' '}
                    Scheduled end: {end} UTC
                  </Text>
                )}
              </Show>
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Show>

      <Divider />

      <Grid gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap="4">
        <StatCard
          label="Connected Players"
          value={stats?.connectedPlayers.length}
          loading={isLoading}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUserCount}
          loading={isLoading}
        />
        <StatCard
          label="Average Ping"
          value={stats ? `${stats.averagePing} ms` : undefined}
          loading={isLoading}
        />
        <StatCard
          label="Lowest Ping"
          value={
            stats?.lowestPing
              ? `${stats.lowestPing.ping} ms`
              : stats
                ? '—'
                : undefined
          }
          loading={isLoading}
        />
        <StatCard
          label="Highest Ping"
          value={
            stats?.highestPing
              ? `${stats.highestPing.ping} ms`
              : stats
                ? '—'
                : undefined
          }
          loading={isLoading}
        />
      </Grid>

      <Divider />

      <Heading textStyle="lg">Connected Players</Heading>

      <ConnectedPlayersTable
        players={stats?.connectedPlayers ?? null}
        loading={isLoading}
      />
    </Flex>
  );
};

export const Route = createFileRoute('/')({
  component: RouteComponent,
});
