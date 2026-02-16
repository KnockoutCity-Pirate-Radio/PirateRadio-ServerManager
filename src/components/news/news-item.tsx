import { PenIcon, TrashIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { Box, Flex } from 'styled-system/jsx';
import { match } from 'ts-pattern';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import { Badge, ButtonGroup, IconButton, Table, Text, Tooltip } from '~/ui';

export const NEWS_NO_END_DATE = '2147483647';

export type NewsItemText = { language: string; title: string; message: string };

export type NewsItemData = {
  name: string;
  priority: number;
  slot0: boolean;
  slot1: boolean;
  slot2: boolean;
  platforms: string | null;
  imageIndex: number;
  texts: NewsItemText[];
};

export type NewsEntry = {
  name: string;
  startAt: string;
  endAt: string;
  items: NewsItemData[];
};

type Props = {
  entry: NewsEntry;
  onEdit: () => void;
  onRemove: () => void;
};

const formatTs = (secs: string) =>
  DateTime.fromSeconds(parseInt(secs, 10)).toFormat('MMM dd yyyy, HH:mm');

const getTitle = (item: NewsItemData) =>
  item.texts.find((t) => t.language === 'en')?.title ??
  item.texts[0]?.title ??
  null;

const SLOTS = [
  { key: 'slot0', match: (item: NewsItemData) => item.slot0 },
  { key: 'slot1', match: (item: NewsItemData) => item.slot1 },
  { key: 'slot2', match: (item: NewsItemData) => item.slot2 },
] as const;

export const NewsItem = ({ entry, onEdit, onRemove }: Props) => (
  <Table.Row>
    <Table.Cell>
      <Flex gap="2">
        <For each={SLOTS}>
          {({ key, match: matchFn }, idx) => {
            const item = entry.items.find(matchFn);
            return (
              <Show
                key={key}
                when={item}
                fallback={
                  <Box
                    px="2.5"
                    py="1.5"
                    borderWidth="1px"
                    borderStyle="dashed"
                    borderColor="border.subtle"
                    rounded="md"
                    w="44"
                    flexShrink="0"
                    opacity="0.5"
                  >
                    <Text
                      textStyle="xs"
                      color="fg.muted"
                      fontWeight="semibold"
                      mb="0.5"
                    >
                      Slot {idx}
                    </Text>
                    <Text textStyle="sm" color="fg.subtle" fontStyle="italic">
                      Empty
                    </Text>
                  </Box>
                }
              >
                {(i) => (
                  <Box
                    px="2.5"
                    py="1.5"
                    borderWidth="1px"
                    borderColor="border.default"
                    rounded="md"
                    minW="0"
                    w="44"
                    flexShrink="0"
                  >
                    <Text
                      textStyle="xs"
                      color="fg.muted"
                      fontWeight="semibold"
                      mb="0.5"
                    >
                      Slot {idx}
                    </Text>
                    <Text textStyle="sm" fontWeight="medium" truncate>
                      {getTitle(i) ?? (
                        <Text as="span" color="fg.subtle" fontStyle="italic">
                          No title
                        </Text>
                      )}
                    </Text>
                  </Box>
                )}
              </Show>
            );
          }}
        </For>
      </Flex>
    </Table.Cell>

    <Table.Cell whiteSpace="nowrap">
      <Badge colorPalette="mint" size="sm">
        {formatTs(entry.startAt)}
      </Badge>
    </Table.Cell>

    <Table.Cell whiteSpace="nowrap">
      {match(String(entry.endAt))
        .with(NEWS_NO_END_DATE, () => (
          <Badge colorPalette="gray" size="sm" variant="outline">
            No end date
          </Badge>
        ))
        .otherwise((endAt) => (
          <Badge colorPalette="amber" size="sm">
            {formatTs(endAt)}
          </Badge>
        ))}
    </Table.Cell>

    <Table.Cell>
      <ButtonGroup size="sm">
        <Tooltip content="Edit">
          <IconButton variant="plain" colorPalette="gray" onClick={onEdit}>
            <PenIcon />
          </IconButton>
        </Tooltip>
        <Tooltip content="Delete">
          <IconButton variant="plain" colorPalette="red" onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Table.Cell>
  </Table.Row>
);
