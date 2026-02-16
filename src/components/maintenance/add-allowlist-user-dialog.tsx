import { createListCollection } from '@ark-ui/react/combobox';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from 'styled-system/jsx';
import {
  Button,
  CloseButton,
  Combobox,
  Dialog,
  Field,
  Text,
  toaster,
} from '~/ui';

type UserOption = {
  id: string;
  username: string;
};

interface Props {
  open: boolean;
  allowlistedUserIds: Set<string>;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAllowlistUserDialog = (props: Props) => {
  const { open, allowlistedUserIds, onClose, onSuccess } = props;

  const [results, setResults] = useState<UserOption[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setInputValue('');
    setSelectedUserId(null);
    setResults([]);
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (inputValue.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetch(`/api/users/search?q=${encodeURIComponent(inputValue)}`)
        .then((r) => r.json() as Promise<UserOption[]>)
        .then((data) =>
          setResults(data.filter((u) => !allowlistedUserIds.has(u.id))),
        )
        .catch(() => toaster.create({ type: 'error', title: 'Search failed' }));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, allowlistedUserIds]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: results.map((u) => ({ label: u.username, value: u.id })),
      }),
    [results],
  );

  const handleSubmit = async () => {
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      const r = await fetch('/api/maintenance/allowlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(selectedUserId) }),
      });
      if (!r.ok) {
        const body = (await r.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(body?.message ?? `HTTP ${r.status}`);
      }
      onSuccess();
    } catch (err) {
      toaster.create({
        type: 'error',
        title: 'Failed to add user',
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="sm" w="full">
          <Dialog.Header>
            <Dialog.Title>Add User to Allowlist</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap="4">
              <Text textStyle="sm" color="fg.muted">
                The selected user will be able to log in even during active
                maintenance periods.
              </Text>

              <Field.Root>
                <Field.Label>User</Field.Label>
                <Combobox.Root
                  collection={collection}
                  inputValue={inputValue}
                  onInputValueChange={({ inputValue: v }) => {
                    setInputValue(v);
                    if (!v) setSelectedUserId(null);
                  }}
                  onValueChange={({ value }) =>
                    setSelectedUserId(value[0] ?? null)
                  }
                >
                  <Combobox.Control>
                    <Combobox.Input placeholder="Type at least 2 characters…" />
                    <Combobox.IndicatorGroup>
                      <Combobox.ClearTrigger />
                      <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                  </Combobox.Control>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.Empty>
                        <Text textStyle="sm" color="fg.muted" p="2">
                          {inputValue.trim().length < 2
                            ? 'Type to search…'
                            : 'No users found'}
                        </Text>
                      </Combobox.Empty>
                      <Combobox.ItemGroup>
                        {results.map((user) => (
                          <Combobox.Item
                            key={user.id}
                            item={{ label: user.username, value: user.id }}
                          >
                            <Combobox.ItemText>
                              {user.username}
                            </Combobox.ItemText>
                            <Combobox.ItemIndicator />
                          </Combobox.Item>
                        ))}
                      </Combobox.ItemGroup>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>
              </Field.Root>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!selectedUserId}
            >
              Add to Allowlist
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
