import { createFileRoute } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { Divider, Flex } from 'styled-system/jsx';
import { EmptyBox } from '~/components/helper/empty-box';
import { Show } from '~/components/helper/show';
import { AddAllowlistUserDialog } from '~/components/maintenance/add-allowlist-user-dialog';
import { AllowlistTable } from '~/components/maintenance/allowlist-table';
import { DenyPeriodForm } from '~/components/maintenance/deny-period-form';
import { DenyPeriodsTable } from '~/components/maintenance/deny-periods-table';
import type { AllowlistEntry, DenyPeriod } from '~/data/types';
import { useApiData } from '~/hooks/use-api-data';
import { Alert, Button, Heading, SkeletonText, Text, toaster } from '~/ui';

export const Route = createFileRoute('/maintenance')({
  component: RouteComponent,
});

const fetchMaintenance = async (): Promise<DenyPeriod[]> => {
  const r = await fetch('/api/maintenance');
  if (!r.ok) {
    const body = (await r.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

const fetchAllowlist = async (): Promise<AllowlistEntry[]> => {
  const r = await fetch('/api/maintenance/allowlist');
  if (!r.ok) {
    const body = (await r.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

const deletePeriod = async (id: number): Promise<void> => {
  const r = await fetch(`/api/maintenance/${id}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 204) {
    const body = (await r.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
};

const removeAllowlistUser = async (userId: number): Promise<void> => {
  const r = await fetch(`/api/maintenance/allowlist/${userId}`, {
    method: 'DELETE',
  });
  if (!r.ok && r.status !== 204) {
    const body = (await r.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
};

function RouteComponent() {
  const [formOpen, setFormOpen] = useState(false);
  const [addAllowlistOpen, setAddAllowlistOpen] = useState(false);

  const {
    data: periods,
    isLoading: isPeriodsLoading,
    reload: reloadPeriods,
  } = useApiData(fetchMaintenance, {
    errorTitle: 'Failed to load maintenance periods',
  });

  const {
    data: allowlist,
    isLoading: isAllowlistLoading,
    reload: reloadAllowlist,
  } = useApiData(fetchAllowlist, { errorTitle: 'Failed to load allowlist' });

  const handleDeletePeriod = (period: DenyPeriod) => {
    deletePeriod(period.id)
      .then(() => {
        toaster.create({ type: 'success', title: 'Deny period deleted' });
        reloadPeriods();
      })
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: 'Failed to delete',
          description: err.message,
        });
      });
  };

  const handleRemoveAllowlist = (entry: AllowlistEntry) => {
    removeAllowlistUser(entry.userId)
      .then(() => {
        toaster.create({
          type: 'success',
          title: `${entry.username ?? entry.userId} removed from allowlist`,
        });
        reloadAllowlist();
      })
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: 'Failed to remove',
          description: err.message,
        });
      });
  };

  const now = DateTime.now().toSeconds();
  const sorted = [...(periods ?? [])].sort((a, b) => b.startTime - a.startTime);
  const active = sorted.filter((p) => p.startTime <= now && p.endTime >= now);

  const allowlistedUserIds = useMemo(
    () => new Set((allowlist ?? []).map((e) => String(e.userId))),
    [allowlist],
  );

  return (
    <>
      <Flex gap="6" flexDirection="column">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Flex flexDirection="column" gap="1">
            <Heading>Maintenance</Heading>
            <Text textStyle="sm" color="fg.muted">
              Configuration and overview of the maintenance mode for the server.
            </Text>
          </Flex>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            New Deny Period
          </Button>
        </Flex>

        <Show when={!isPeriodsLoading && active.length > 0}>
          <Alert.Root status="error" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Maintenance is active</Alert.Title>
              <Alert.Description>
                {active.length === 1
                  ? 'There is currently 1 active deny period. Players cannot log in.'
                  : `There are ${active.length} active deny periods. Players cannot log in.`}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Show>

        {/* Deny Periods */}
        <Show
          when={!isPeriodsLoading}
          fallback={<SkeletonText noOfLines={6} />}
        >
          <Show
            when={sorted.length > 0}
            fallback={<EmptyBox>No deny periods configured.</EmptyBox>}
          >
            <DenyPeriodsTable periods={sorted} onDelete={handleDeletePeriod} />
          </Show>
        </Show>

        <Divider />

        {/* Allowlist */}
        <Flex justify="space-between" align="center">
          <Flex flexDirection="column" gap="1">
            <Heading textStyle="lg">Login Allowlist</Heading>
            <Text textStyle="sm" color="fg.muted">
              Users who can log in even during active deny periods.
            </Text>
          </Flex>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddAllowlistOpen(true)}
          >
            Add User
          </Button>
        </Flex>

        <Show
          when={!isAllowlistLoading}
          fallback={<SkeletonText noOfLines={4} />}
        >
          <Show
            when={(allowlist ?? []).length > 0}
            fallback={<EmptyBox>No users on the allowlist.</EmptyBox>}
          >
            <AllowlistTable
              entries={allowlist ?? []}
              onRemove={handleRemoveAllowlist}
            />
          </Show>
        </Show>
      </Flex>

      <DenyPeriodForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setFormOpen(false);
          reloadPeriods();
        }}
      />

      <AddAllowlistUserDialog
        open={addAllowlistOpen}
        allowlistedUserIds={allowlistedUserIds}
        onClose={() => setAddAllowlistOpen(false)}
        onSuccess={() => {
          setAddAllowlistOpen(false);
          reloadAllowlist();
        }}
      />
    </>
  );
}
