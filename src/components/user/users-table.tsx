import { DateTime } from 'luxon';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import type { User } from '~/data/types';
import { Badge, SkeletonText, Text } from '~/ui';
import * as Table from '~/ui/table';
import { UserDetailDialog } from './user-detail-dialog';

interface Props {
  /** Filtered list of users to render */
  users: User[];
  /** Active search query (used for empty-state messaging) */
  search: string;
  /** ID of the currently selected user (keeps the detail dialog open) */
  selectedId: string | undefined;
  /** Called when the detail dialog open state changes for a given user */
  onOpenChange: (userId: string, open: boolean) => void;
  /** Called after a user action that requires a data refresh */
  onReload: () => void;
  /** When true, renders skeleton rows instead of data */
  loading: boolean;
}

const formatTs = (ts: number | null) => {
  if (ts === null) return '—';
  return DateTime.fromMillis(ts).toLocaleString(DateTime.DATETIME_MED);
};

/** Sortable table of users with search-aware empty state and per-row detail dialogs. */
export const UsersTable = (props: Props) => {
  const { users, search, selectedId, onOpenChange, onReload, loading } = props;
  return (
    <Show when={!loading} fallback={<SkeletonText noOfLines={6} />}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.Header>ID</Table.Header>
            <Table.Header>Username</Table.Header>
            <Table.Header>Visible</Table.Header>
            <Table.Header>Member Since</Table.Header>
            <Table.Header>Last Seen</Table.Header>
            <Table.Header />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Show
            when={users.length > 0}
            fallback={
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text textStyle="sm" color="fg.muted">
                    {search.trim()
                      ? 'No users match your search.'
                      : 'No users found.'}
                  </Text>
                </Table.Cell>
              </Table.Row>
            }
          >
            <For each={users}>
              {(user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Text textStyle="sm" fontFamily="mono" color="fg.muted">
                      {user.id}
                    </Text>
                  </Table.Cell>
                  <Table.Cell fontWeight="medium">{user.username}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="subtle"
                      colorPalette={user.usernameVisible ? 'green' : 'red'}
                    >
                      {user.usernameVisible ? 'Yes' : 'No'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm" color="fg.muted">
                      {formatTs(user.insertedAt)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm" color="fg.muted">
                      {formatTs(user.lastAuthenticatedAt)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <UserDetailDialog
                      user={user}
                      onReload={onReload}
                      open={selectedId === user.id}
                      onOpenChange={(open) => onOpenChange(user.id, open)}
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </For>
          </Show>
        </Table.Body>
      </Table.Root>
    </Show>
  );
};
