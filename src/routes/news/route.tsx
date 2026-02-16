import { createFileRoute } from '@tanstack/react-router';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Flex } from 'styled-system/jsx';
import { Show } from '~/components/helper/show';
import { NewsForm } from '~/components/news/news-form';
import { NEWS_NO_END_DATE, type NewsEntry } from '~/components/news/news-item';
import { NewsTable } from '~/components/news/news-table';
import { useApiData } from '~/hooks/use-api-data';
import {
  Alert,
  Badge,
  Button,
  Heading,
  SkeletonText,
  Tabs,
  Text,
  toaster,
} from '~/ui';

const fetchNews = async (): Promise<NewsEntry[]> => {
  const r = await fetch('/api/news');
  if (!r.ok) {
    const body = (await r.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
  return r.json();
};

const deleteNews = async (name: string): Promise<void> => {
  const r = await fetch(`/api/news/${encodeURIComponent(name)}`, {
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
  const [editEntry, setEditEntry] = useState<NewsEntry | null>(null);

  const {
    data: entries,
    isLoading,
    reload,
  } = useApiData(fetchNews, {
    errorTitle: 'Failed to load news',
  });

  const handleDelete = (entry: NewsEntry) => {
    deleteNews(entry.name)
      .then(() => {
        toaster.create({ type: 'success', title: `"${entry.name}" deleted` });
        reload();
      })
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: 'Failed to delete',
          description: err.message,
        });
      });
  };

  const openCreate = () => {
    setEditEntry(null);
    setFormOpen(true);
  };

  const openEdit = (entry: NewsEntry) => {
    setEditEntry(entry);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditEntry(null);
    reload();
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditEntry(null);
  };

  const now = DateTime.now().toSeconds();
  const active =
    entries?.filter((e) => {
      const start = parseInt(e.startAt, 10);
      const end =
        e.endAt !== NEWS_NO_END_DATE ? parseInt(e.endAt, 10) : Infinity;
      return start <= now && now <= end;
    }) ?? [];
  const upcoming = entries?.filter((e) => parseInt(e.startAt, 10) > now) ?? [];
  const inactive =
    entries?.filter(
      (e) => e.endAt !== NEWS_NO_END_DATE && parseInt(e.endAt, 10) < now,
    ) ?? [];

  return (
    <>
      <Flex gap="6" flexDirection="column">
        <Flex justify="space-between" align="center">
          <Flex flexDirection="column" gap="1">
            <Heading>News</Heading>
            <Text textStyle="sm" color="fg.muted">
              News displayed when a user logs into the server.
            </Text>
          </Flex>
          <Button size="sm" onClick={openCreate}>
            New News Entry
          </Button>
        </Flex>

        <Alert.Root status="info" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Level 5+ only</Alert.Title>
            <Alert.Description>
              News entries are only shown to users with level 5 or above. This
              is hardcoded in the Private Server Edition and cannot be changed
              without modification.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>

        <Show when={!isLoading} fallback={<SkeletonText noOfLines={8} />}>
          <Tabs.Root defaultValue="active">
            <Tabs.List>
              <Tabs.Trigger value="active">
                Active
                <Badge
                  size="sm"
                  variant="subtle"
                  colorPalette={active.length > 0 ? 'green' : 'gray'}
                  ml="1.5"
                >
                  {active.length}
                </Badge>
              </Tabs.Trigger>
              <Tabs.Trigger value="upcoming">
                Upcoming
                <Badge size="sm" variant="subtle" colorPalette="gray" ml="1.5">
                  {upcoming.length}
                </Badge>
              </Tabs.Trigger>
              <Tabs.Trigger value="inactive">
                Inactive
                <Badge size="sm" variant="subtle" colorPalette="gray" ml="1.5">
                  {inactive.length}
                </Badge>
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="active">
              <NewsTable
                entries={active}
                emptyText="No active news entries."
                onEdit={openEdit}
                onRemove={handleDelete}
              />
            </Tabs.Content>
            <Tabs.Content value="upcoming">
              <NewsTable
                entries={upcoming}
                emptyText="No upcoming news entries."
                onEdit={openEdit}
                onRemove={handleDelete}
              />
            </Tabs.Content>
            <Tabs.Content value="inactive">
              <NewsTable
                entries={inactive}
                emptyText="No inactive news entries."
                onEdit={openEdit}
                onRemove={handleDelete}
              />
            </Tabs.Content>
          </Tabs.Root>
        </Show>
      </Flex>

      <NewsForm
        open={formOpen}
        editEntry={editEntry}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}

export const Route = createFileRoute('/news')({
  component: RouteComponent,
});
