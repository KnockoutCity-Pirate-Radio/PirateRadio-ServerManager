import { DateTime } from 'luxon';
import { HStack } from 'styled-system/jsx';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import type { Crew } from '~/data/types';
import { Badge, SkeletonText, Text } from '~/ui';
import * as Table from '~/ui/table';
import { CrewDetailDialog } from './crew-detail-dialog';

interface Props {
  /** Filtered list of crews to render */
  crews: Crew[];
  /** Active search query (used for empty-state messaging) */
  search: string;
  /** GUID of the currently selected crew (keeps the detail dialog open) */
  selectedGuid: string | undefined;
  /** Called when the detail dialog open state changes for a given crew */
  onOpenChange: (crewGuid: string, open: boolean) => void;
  /** When true, renders skeleton rows instead of data */
  loading: boolean;
}

const formatTs = (ts: number | null) => {
  if (ts === null) return '—';
  return DateTime.fromMillis(ts).toLocaleString(DateTime.DATETIME_MED);
};

/** Table of crews with search-aware empty state and per-row detail dialogs. */
export const CrewsTable = (props: Props) => {
  const { crews, search, selectedGuid, onOpenChange, loading } = props;
  return (
    <Show when={!loading} fallback={<SkeletonText noOfLines={6} />}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header>Code</Table.Header>
            <Table.Header>Captain</Table.Header>
            <Table.Header>Members</Table.Header>
            <Table.Header>Created</Table.Header>
            <Table.Header />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Show
            when={crews.length > 0}
            fallback={
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text textStyle="sm" color="fg.muted">
                    {search.trim()
                      ? 'No crews match your search.'
                      : 'No crews found.'}
                  </Text>
                </Table.Cell>
              </Table.Row>
            }
          >
            <For each={crews}>
              {(crew) => (
                <Table.Row key={crew.guid}>
                  <Table.Cell fontWeight="medium">
                    <HStack gap="2">
                      {crew.name}
                      <Show when={!crew.nameVisible}>
                        <Badge variant="subtle" colorPalette="gray" size="sm">
                          Hidden
                        </Badge>
                      </Show>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm" color="fg.muted">
                      #{crew.code}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm">{crew.captain.username}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="gray">
                      {crew.memberCount}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text textStyle="sm" color="fg.muted">
                      {formatTs(crew.createdAt)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <CrewDetailDialog
                      crew={crew}
                      open={selectedGuid === crew.guid}
                      onOpenChange={(open) => onOpenChange(crew.guid, open)}
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
