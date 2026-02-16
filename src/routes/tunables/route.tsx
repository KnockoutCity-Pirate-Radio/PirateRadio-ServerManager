import { createFileRoute } from '@tanstack/react-router';
import Fuse from 'fuse.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Divider, Flex, Grid } from 'styled-system/jsx';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import { PendingChangesBar } from '~/components/tunable/pending-changes-bar';
import { TagFilter } from '~/components/tunable/tag-filter';
import { type Tag, Tunable } from '~/components/tunable/tunable';
import { useDebouncedSearch } from '~/hooks/use-debounced-search';
import { Alert, Heading, Input, Text, toaster } from '~/ui';
import { TUNABLES } from '../../data/tunables.data';

const fuse = new Fuse(TUNABLES, {
  keys: ['id', 'description'],
  threshold: 0.4,
});

const fetchSavedValues = async (): Promise<Record<string, number>> => {
  const r = await fetch('/api/tunables');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

const putTunables = async (changes: Record<string, number>): Promise<void> => {
  const r = await fetch('/api/tunables', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${r.status}`);
  }
};

/**
 * Configure tunables and other settings in the server
 */
const RouteComponent = () => {
  const { inputValue, onInputChange, search } = useDebouncedSearch(150);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  // Committed values loaded from the DB (id → numeric string)
  const [savedValues, setSavedValues] = useState<Record<string, string>>({});
  // Pending edits not yet saved (id → numeric string)
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>(
    {},
  );
  const [saving, setSaving] = useState(false);

  // Load saved values from API on mount
  useEffect(() => {
    fetchSavedValues()
      .then((data) => {
        const stringified: Record<string, string> = {};
        for (const [k, v] of Object.entries(data)) {
          stringified[k] = String(v);
        }
        setSavedValues(stringified);
      })
      .catch((err: Error) => {
        toaster.create({
          type: 'error',
          title: 'Failed to load tunables',
          description: err.message,
        });
      });
  }, []);

  const allTags = useMemo(() => {
    const seen = new Map<string, Tag>();
    for (const tunable of TUNABLES) {
      for (const tag of tunable.tags) {
        if (!seen.has(tag.text)) {
          seen.set(tag.text, tag);
        }
      }
    }
    return Array.from(seen.values()).sort((a, b) =>
      a.text.localeCompare(b.text),
    );
  }, []);

  const filtered = useMemo(() => {
    const searched = search ? fuse.search(search).map((r) => r.item) : TUNABLES;
    if (activeTags.size === 0) return searched;
    return searched.filter((t) =>
      t.tags.some((tag) => activeTags.has(tag.text)),
    );
  }, [search, activeTags]);

  const toggleTag = (text: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(text)) {
        next.delete(text);
      } else {
        next.add(text);
      }
      return next;
    });
  };

  const handleValueChange = useCallback(
    (id: string, defaultValue: number | undefined, newValue: string) => {
      setPendingChanges((prev) => {
        const committed = savedValues[id] ?? String(defaultValue ?? '');
        if (newValue === committed) {
          const { [id]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [id]: newValue };
      });
    },
    [savedValues],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const numeric: Record<string, number> = {};
      for (const [id, val] of Object.entries(pendingChanges)) {
        numeric[id] = Number(val);
      }
      await putTunables(numeric);
      setSavedValues((prev) => ({ ...prev, ...pendingChanges }));
      setPendingChanges({});
      toaster.create({ type: 'success', title: 'Tunables saved' });
    } catch (err) {
      toaster.create({
        type: 'error',
        title: 'Failed to save tunables',
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    setPendingChanges({});
  };

  const handleRevertChange = (id: string) => {
    setPendingChanges(({ [id]: _, ...rest }) => rest);
  };

  const pendingChangesList = useMemo(() => {
    const tunableDefaults = Object.fromEntries(
      TUNABLES.map((t) => [t.id, t.defaultValue?.toString() ?? '']),
    );
    return Object.entries(pendingChanges).map(([id, to]) => ({
      id,
      from: savedValues[id] ?? tunableDefaults[id] ?? '',
      to,
    }));
  }, [pendingChanges, savedValues]);

  return (
    <Flex gap="4" flexDirection="column">
      <Heading>Tunables</Heading>

      <Text textStyle="sm">
        Configuration of the gameservers can be tweaked here.
      </Text>

      <Alert.Root status="warning" variant="subtle">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Caution</Alert.Title>
          <Alert.Description>
            Be aware that changing these without prior knowledge can break the
            server or cause playability issues!
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <Divider />

      <Input
        placeholder="Search tunables..."
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        maxW="sm"
      />

      <TagFilter tags={allTags} activeTags={activeTags} onToggle={toggleTag} />

      <Text textStyle="sm" color="fg.muted">
        Showing {filtered.length} / {TUNABLES.length} tunables
      </Text>

      <Grid gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap="4">
        <For each={filtered}>
          {(tunable) => (
            <Tunable
              key={tunable.id}
              {...tunable}
              value={
                pendingChanges[tunable.id] ??
                savedValues[tunable.id] ??
                tunable.defaultValue?.toString() ??
                ''
              }
              onValueChange={(val) =>
                handleValueChange(tunable.id, tunable.defaultValue, val)
              }
            />
          )}
        </For>
      </Grid>

      <Show when={pendingChangesList.length > 0}>
        <PendingChangesBar
          changes={pendingChangesList}
          saving={saving}
          onSave={handleSave}
          onRevert={handleRevert}
          onRevertChange={handleRevertChange}
        />
      </Show>
    </Flex>
  );
};

export const Route = createFileRoute('/tunables')({
  component: RouteComponent,
});
