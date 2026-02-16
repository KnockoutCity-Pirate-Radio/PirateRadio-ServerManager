import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Grid, Stack } from 'styled-system/jsx';
import { match } from 'ts-pattern';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import { LANGUAGES } from '~/data/languages';
import {
  Alert,
  Badge,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Tabs,
  Textarea,
  toaster,
} from '~/ui';

type MessageForm = {
  languageCode: string;
  message: string;
};

type FormState = {
  startAt: string;
  endAt: string;
  messages: MessageForm[];
};

const fromDatetimeLocal = (dt: string) =>
  Math.floor(DateTime.fromISO(dt).toSeconds());

const makeDefaultMessages = (): MessageForm[] =>
  LANGUAGES.map(({ value }) => ({ languageCode: value, message: '' }));

const makeDefaultForm = (): FormState => ({
  startAt: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
  endAt: DateTime.now().plus({ hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm"),
  messages: makeDefaultMessages(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DenyPeriodForm = (props: Props) => {
  const { open, onClose, onSuccess } = props;

  const [form, setForm] = useState<FormState>(makeDefaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [enError, setEnError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(makeDefaultForm());
      setScheduleError(null);
      setEnError(null);
    }
  }, [open]);

  const updateMessage = (languageCode: string, message: string) => {
    setForm((p) => ({
      ...p,
      messages: p.messages.map((m) =>
        m.languageCode === languageCode ? { ...m, message } : m,
      ),
    }));
    if (languageCode === 'en' && message.trim()) {
      setEnError(null);
    }
  };

  const handleSubmit = async () => {
    const start = fromDatetimeLocal(form.startAt);
    const end = fromDatetimeLocal(form.endAt);

    if (end <= start) {
      setScheduleError('End time must be after the start time');
      return;
    }

    const enMsg = form.messages.find((m) => m.languageCode === 'en');
    if (!enMsg?.message.trim()) {
      setEnError('English message is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        startTime: start,
        endTime: end,
        messages: form.messages.filter((m) => m.message.trim()),
      };

      const r = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        title: 'Failed to create deny period',
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      scrollBehavior="inside"
      onOpenChange={({ open: o }) => !o && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl" w="full">
          <Dialog.Header>
            <Dialog.Title>New Deny Period</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap="6">
              <Stack gap="3">
                <Alert.Root status="info" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Content>All times are in UTC.</Alert.Content>
                </Alert.Root>

                <Grid gridTemplateColumns="1fr 1fr" gap="4">
                  <Field.Root invalid={!!scheduleError}>
                    <Field.Label>Start</Field.Label>
                    <Input
                      type="datetime-local"
                      value={form.startAt}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, startAt: e.target.value }));
                        setScheduleError(null);
                      }}
                    />
                  </Field.Root>

                  <Field.Root invalid={!!scheduleError}>
                    <Field.Label>End</Field.Label>
                    <Input
                      type="datetime-local"
                      value={form.endAt}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, endAt: e.target.value }));
                        setScheduleError(null);
                      }}
                    />
                    <Show when={scheduleError}>
                      {(err) => <Field.ErrorText>{err}</Field.ErrorText>}
                    </Show>
                  </Field.Root>
                </Grid>
              </Stack>

              <Stack gap="3">
                <Tabs.Root defaultValue="en" w="full">
                  <Tabs.List flexWrap="wrap">
                    <For each={LANGUAGES}>
                      {({ label, value: lang }) => {
                        const msg = form.messages.find(
                          (m) => m.languageCode === lang,
                        );
                        const hasError = lang === 'en' && !!enError;
                        const hasContent = !!msg?.message.trim();
                        return (
                          <Tabs.Trigger key={lang} value={lang}>
                            {label}
                            {match({ hasError, hasContent })
                              .with({ hasError: true }, () => (
                                <Badge
                                  size="sm"
                                  variant="solid"
                                  colorPalette="red"
                                  ml="1"
                                  w="1.5"
                                  h="1.5"
                                  p="0"
                                  rounded="full"
                                />
                              ))
                              .with({ hasContent: true }, () => (
                                <Badge
                                  size="sm"
                                  variant="solid"
                                  colorPalette="green"
                                  ml="1"
                                  w="1.5"
                                  h="1.5"
                                  p="0"
                                  rounded="full"
                                />
                              ))
                              .otherwise(() => null)}
                          </Tabs.Trigger>
                        );
                      }}
                    </For>
                  </Tabs.List>

                  <For each={LANGUAGES}>
                    {({ value: lang }) => {
                      const msg = form.messages.find(
                        (m) => m.languageCode === lang,
                      );
                      return (
                        <Tabs.Content key={lang} value={lang}>
                          <Stack gap="3" pt="3">
                            <Field.Root invalid={lang === 'en' && !!enError}>
                              <Field.Label>Message</Field.Label>
                              <Textarea
                                rows={4}
                                value={msg?.message ?? ''}
                                onChange={(e) =>
                                  updateMessage(lang, e.target.value)
                                }
                                placeholder={
                                  lang === 'en'
                                    ? 'Server is currently under maintenance. Please try again later.'
                                    : 'Optional — leave blank to skip this language'
                                }
                              />
                              <Show when={lang === 'en' && enError}>
                                {(err) => (
                                  <Field.ErrorText>{err}</Field.ErrorText>
                                )}
                              </Show>
                            </Field.Root>
                          </Stack>
                        </Tabs.Content>
                      );
                    }}
                  </For>
                </Tabs.Root>
              </Stack>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              Create Deny Period
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
