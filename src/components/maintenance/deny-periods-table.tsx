import { Trash2Icon } from 'lucide-react';
import { DateTime } from 'luxon';
import { Flex } from 'styled-system/jsx';
import { For } from '~/components/helper/for';
import type { DenyPeriod } from '~/data/types';
import { Badge, Button, Icon, Text } from '~/ui';
import * as Table from '~/ui/table';
import { getPeriodStatus, PeriodStatusBadge } from './period-status-badge';

interface Props {
  /** Deny periods to display, pre-sorted as needed by the caller */
  periods: DenyPeriod[];
  /** Called when the user clicks the delete button for a period */
  onDelete: (period: DenyPeriod) => void;
}

const formatTime = (secs: number) =>
  `${DateTime.fromSeconds(secs).toFormat('yyyy-MM-dd HH:mm')} UTC`;

/** Table of deny periods showing status, start/end times, and language badges. */
export const DenyPeriodsTable = (props: Props) => {
  const { periods, onDelete } = props;
  return (
    <Table.Root variant="surface">
      <Table.Head>
        <Table.Row>
          <Table.Header>Status</Table.Header>
          <Table.Header>Start</Table.Header>
          <Table.Header>End</Table.Header>
          <Table.Header>Languages</Table.Header>
          <Table.Header w="16" textAlign="right">
            Actions
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <For each={periods}>
          {(period) => (
            <Table.Row key={period.id}>
              <Table.Cell>
                <PeriodStatusBadge status={getPeriodStatus(period)} />
              </Table.Cell>
              <Table.Cell>
                <Text textStyle="sm">{formatTime(period.startTime)}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text textStyle="sm">{formatTime(period.endTime)}</Text>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="1" flexWrap="wrap">
                  <For
                    each={period.messages}
                    fallback={
                      <Text textStyle="xs" color="fg.subtle">
                        —
                      </Text>
                    }
                  >
                    {(m) => (
                      <Badge
                        key={m.languageCode}
                        size="sm"
                        variant="outline"
                        colorPalette="gray"
                      >
                        {m.languageCode.toUpperCase()}
                      </Badge>
                    )}
                  </For>
                </Flex>
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Button
                  size="xs"
                  variant="plain"
                  colorPalette="red"
                  onClick={() => onDelete(period)}
                  aria-label="Delete deny period"
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
