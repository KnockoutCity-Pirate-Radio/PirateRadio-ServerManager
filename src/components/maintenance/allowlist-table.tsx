import { Trash2Icon } from 'lucide-react';
import { For } from '~/components/helper/for';
import type { AllowlistEntry } from '~/data/types';
import { Button, Icon, Text } from '~/ui';
import * as Table from '~/ui/table';

interface Props {
  /** Allowlist entries to render */
  entries: AllowlistEntry[];
  /** Called when the user clicks the remove button for an entry */
  onRemove: (entry: AllowlistEntry) => void;
}

/** Table of allowlisted users who may log in during active deny periods. */
export const AllowlistTable = (props: Props) => {
  const { entries, onRemove } = props;
  return (
    <Table.Root variant="surface">
      <Table.Head>
        <Table.Row>
          <Table.Header>Username</Table.Header>
          <Table.Header>User ID</Table.Header>
          <Table.Header w="16" textAlign="right">
            Actions
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <For each={entries}>
          {(entry) => (
            <Table.Row key={entry.userId}>
              <Table.Cell fontWeight="medium">
                {entry.username ?? '—'}
              </Table.Cell>
              <Table.Cell>
                <Text textStyle="sm" fontFamily="mono" color="fg.muted">
                  {entry.userId}
                </Text>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Button
                  size="xs"
                  variant="plain"
                  colorPalette="red"
                  onClick={() => onRemove(entry)}
                  aria-label="Remove from allowlist"
                >
                  <Icon size="sm">
                    <Trash2Icon />
                  </Icon>
                </Button>
              </Table.Cell>
            </Table.Row>
          )}
        </For>
      </Table.Body>
    </Table.Root>
  );
};
