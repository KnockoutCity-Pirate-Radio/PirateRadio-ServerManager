import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import type { ConnectedPlayer } from '~/data/types';
import { SkeletonText, Text } from '~/ui';
import * as Table from '~/ui/table';

interface Props {
  /** Currently connected players to display, or null while loading */
  players: ConnectedPlayer[] | null;
  /** When true, renders skeleton rows instead of data */
  loading: boolean;
}

/** Table of currently connected players showing username, region, and ping. */
export const ConnectedPlayersTable = (props: Props) => {
  const { players, loading } = props;
  return (
    <Show when={!loading} fallback={<SkeletonText noOfLines={4} />}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.Header>Username</Table.Header>
            <Table.Header>Region</Table.Header>
            <Table.Header>Ping</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Show
            when={(players?.length ?? 0) > 0}
            fallback={
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <Text textStyle="sm" color="fg.muted">
                    No players currently connected.
                  </Text>
                </Table.Cell>
              </Table.Row>
            }
          >
            <For each={players}>
              {(player) => (
                <Table.Row key={player.userId}>
                  <Table.Cell>{player.username}</Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm" color="fg.muted">
                      {player.region}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{player.ping} ms</Table.Cell>
                </Table.Row>
              )}
            </For>
          </Show>
        </Table.Body>
      </Table.Root>
    </Show>
  );
};
