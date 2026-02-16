import { EmptyBox } from '~/components/helper/empty-box';
import { For } from '~/components/helper/for';
import * as Table from '~/ui/table';
import { type NewsEntry, NewsItem } from './news-item';

interface Props {
  /** News entries to display in the table */
  entries: NewsEntry[];
  /** Message shown when `entries` is empty */
  emptyText: string;
  /** Called when the user clicks Edit on an entry */
  onEdit: (entry: NewsEntry) => void;
  /** Called when the user clicks Remove on an entry */
  onRemove: (entry: NewsEntry) => void;
}

/** Table of news entries with an empty state and per-row edit/remove actions. */
export const NewsTable = (props: Props) => {
  const { entries, emptyText, onEdit, onRemove } = props;

  if (entries.length === 0) {
    return <EmptyBox>{emptyText}</EmptyBox>;
  }

  return (
    <Table.Root mt="3" variant="surface">
      <Table.Head>
        <Table.Row>
          <Table.Header>Slots</Table.Header>
          <Table.Header>Start</Table.Header>
          <Table.Header>End</Table.Header>
          <Table.Header w="24" textAlign="right">
            Actions
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <For each={entries}>
          {(entry) => (
            <NewsItem
              key={entry.name}
              entry={entry}
              onEdit={() => onEdit(entry)}
              onRemove={() => onRemove(entry)}
            />
          )}
        </For>
      </Table.Body>
    </Table.Root>
  );
};
