import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Flex, Grid, Stack } from 'styled-system/jsx';
import { match } from 'ts-pattern';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import { LANGUAGES } from '~/data/languages';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  Tabs,
  Text,
  toaster,
} from '~/ui';
import {
  NEWS_NO_END_DATE,
  type NewsEntry,
  type NewsItemData,
} from './news-item';
import { RichTextEditor } from './rich-text-editor';

type DateTimePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  errorText?: string;
};

const DateTimePickerField = (props: DateTimePickerFieldProps) => {
  const { label, value, onChange, disabled, invalid, errorText } = props;
  return (
    <Field.Root disabled={disabled} invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <Input
        type="datetime-local"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
      {errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
    </Field.Root>
  );
};

type TextForm = { language: string; title: string; message: string };

type ItemForm = {
  _id: string;
  priority: number;
  imageIndex: number;
  texts: TextForm[];
};

type FormState = {
  startAt: string;
  noEndDate: boolean;
  endAt: string;
  items: [ItemForm, ItemForm, ItemForm];
};

type SlotErrors = { title?: string; message?: string };

const toDatetimeLocal = (secs: string) =>
  DateTime.fromSeconds(parseInt(secs, 10)).toFormat("yyyy-MM-dd'T'HH:mm");

const fromDatetimeLocal = (dt: string) =>
  Math.floor(DateTime.fromISO(dt).toSeconds()).toString();

const makeDefaultTexts = (): TextForm[] =>
  LANGUAGES.map(({ value }) => ({ language: value, title: '', message: '' }));

const makeDefaultItem = (): ItemForm => ({
  _id: crypto.randomUUID(),
  priority: 1,
  imageIndex: 1,
  texts: makeDefaultTexts(),
});

const makeDefaultForm = (): FormState => ({
  startAt: DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
  noEndDate: true,
  endAt: DateTime.now().plus({ days: 7 }).toFormat("yyyy-MM-dd'T'HH:mm"),
  items: [makeDefaultItem(), makeDefaultItem(), makeDefaultItem()],
});

const itemFromData = (data: NewsItemData | undefined): ItemForm => ({
  _id: crypto.randomUUID(),
  priority: data?.priority ?? 1,
  imageIndex: data?.imageIndex ?? 1,
  texts: LANGUAGES.map(({ value }) => {
    const existing = data?.texts.find((t) => t.language === value);
    return {
      language: value,
      title: existing?.title ?? '',
      message: existing?.message ?? '',
    };
  }),
});

const initFromEntry = (entry: NewsEntry): FormState => ({
  startAt: toDatetimeLocal(entry.startAt),
  noEndDate:
    String(entry.endAt) === NEWS_NO_END_DATE || String(entry.endAt) === '-1',
  endAt:
    String(entry.endAt) !== NEWS_NO_END_DATE && String(entry.endAt) !== '-1'
      ? toDatetimeLocal(entry.endAt)
      : DateTime.now().plus({ days: 7 }).toFormat("yyyy-MM-dd'T'HH:mm"),
  items: [
    itemFromData(entry.items.find((i) => i.slot0)),
    itemFromData(entry.items.find((i) => i.slot1)),
    itemFromData(entry.items.find((i) => i.slot2)),
  ],
});

const validateForm = (
  items: FormState['items'],
): [SlotErrors, SlotErrors, SlotErrors] | null => {
  const slotErrors = items.map((item) => {
    const en = item.texts.find((t) => t.language === 'en');
    const errs: SlotErrors = {};
    if (!en?.title.trim()) errs.title = 'Title is required';
    if (!en?.message.trim()) errs.message = 'Message is required';
    return errs;
  }) as [SlotErrors, SlotErrors, SlotErrors];

  return slotErrors.some((e) => e.title || e.message) ? slotErrors : null;
};

type Props = {
  open: boolean;
  editEntry: NewsEntry | null;
  onClose: () => void;
  onSuccess: () => void;
};

export const NewsForm = ({ open, editEntry, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<FormState>(makeDefaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    [SlotErrors, SlotErrors, SlotErrors] | null
  >(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState('slot-0');

  useEffect(() => {
    if (open) {
      setForm(editEntry ? initFromEntry(editEntry) : makeDefaultForm());
      setErrors(null);
      setScheduleError(null);
      setActiveSlot('slot-0');
    }
  }, [open, editEntry]);

  const updateItem = (
    id: string,
    patch: Partial<Omit<ItemForm, '_id' | 'texts'>>,
  ) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((i) =>
        i._id === id ? { ...i, ...patch } : i,
      ) as FormState['items'],
    }));

  const updateText = (
    itemId: string,
    lang: string,
    patch: Partial<TextForm>,
  ) => {
    setForm((p) => ({
      ...p,
      items: p.items.map((i) =>
        i._id === itemId
          ? {
              ...i,
              texts: i.texts.map((t) =>
                t.language === lang ? { ...t, ...patch } : t,
              ),
            }
          : i,
      ) as FormState['items'],
    }));

    if (lang === 'en') {
      setErrors((prev) => {
        if (!prev) return prev;
        const idx = form.items.findIndex((i) => i._id === itemId);
        if (idx < 0) return prev;
        const next = [...prev] as typeof prev;
        if ('title' in patch && patch.title?.trim())
          next[idx] = { ...next[idx], title: undefined };
        if ('message' in patch && patch.message?.trim())
          next[idx] = { ...next[idx], message: undefined };
        return next.some((e) => e.title || e.message) ? next : null;
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !form.noEndDate &&
      fromDatetimeLocal(form.endAt) <= fromDatetimeLocal(form.startAt)
    ) {
      setScheduleError('End date must be after the start date');
      return;
    }

    const validationErrors = validateForm(form.items);
    if (validationErrors) {
      setErrors(validationErrors);
      const firstErrorIdx = validationErrors.findIndex(
        (e) => e.title || e.message,
      );
      if (firstErrorIdx >= 0) setActiveSlot(`slot-${firstErrorIdx}`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        startAt: fromDatetimeLocal(form.startAt),
        endAt: form.noEndDate
          ? NEWS_NO_END_DATE
          : fromDatetimeLocal(form.endAt),
        items: form.items.map((item, idx) => ({
          priority: item.priority,
          imageIndex: item.imageIndex,
          slot0: idx === 0,
          slot1: idx === 1,
          slot2: idx === 2,
          platforms: null,
          texts: item.texts.filter((t) => t.title.trim() || t.message.trim()),
        })),
      };

      const url = editEntry
        ? `/api/news/${encodeURIComponent(editEntry.name)}`
        : '/api/news';

      const r = await fetch(url, {
        method: editEntry ? 'PUT' : 'POST',
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
        title: editEntry ? 'Failed to update news' : 'Failed to create news',
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
        <Dialog.Content maxW="3xl" w="full">
          <Dialog.Header>
            <Dialog.Title>
              {editEntry ? `Edit "${editEntry.name}"` : 'New News Entry'}
            </Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap="6">
              {/* Timing */}
              <Stack gap="3">
                <Text
                  fontWeight="semibold"
                  textStyle="xs"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Schedule
                </Text>

                <Alert.Root status="info" variant="subtle">
                  <Alert.Indicator />
                  <Alert.Content>All times are in UTC.</Alert.Content>
                </Alert.Root>
                <Grid gridTemplateColumns="1fr 1fr" gap="4" alignItems="start">
                  <DateTimePickerField
                    label="Start"
                    value={form.startAt}
                    onChange={(v) => setForm((p) => ({ ...p, startAt: v }))}
                  />

                  <Stack gap="2">
                    <DateTimePickerField
                      label="End"
                      value={form.endAt}
                      onChange={(v) => {
                        setForm((p) => ({ ...p, endAt: v }));
                        setScheduleError(null);
                      }}
                      disabled={form.noEndDate}
                      invalid={!!scheduleError}
                      errorText={scheduleError ?? undefined}
                    />
                    <Checkbox.Root
                      checked={form.noEndDate}
                      onCheckedChange={({ checked }) => {
                        setForm((p) => ({ ...p, noEndDate: checked === true }));
                        setScheduleError(null);
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Label>No end date</Checkbox.Label>
                    </Checkbox.Root>
                  </Stack>
                </Grid>
              </Stack>

              {/* Slots */}
              <Stack gap="3">
                <Text
                  fontWeight="semibold"
                  textStyle="xs"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Slots
                </Text>

                <Tabs.Root
                  value={activeSlot}
                  onValueChange={({ value }) => setActiveSlot(value)}
                >
                  <Tabs.List>
                    <For each={form.items}>
                      {(item, idx) => {
                        const hasError = !!(
                          errors?.[idx]?.title || errors?.[idx]?.message
                        );
                        return (
                          <Tabs.Trigger key={item._id} value={`slot-${idx}`}>
                            Slot {idx}
                            <Show when={hasError}>
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
                            </Show>
                          </Tabs.Trigger>
                        );
                      }}
                    </For>
                  </Tabs.List>

                  <For each={form.items}>
                    {(item, idx) => (
                      <Tabs.Content key={item._id} value={`slot-${idx}`}>
                        <Stack gap="5" pt="4">
                          {/* Priority / Image Index */}
                          <Flex gap="4" alignItems="flex-end">
                            <Field.Root w="28">
                              <Field.Label>Priority</Field.Label>
                              <Input
                                type="number"
                                min={1}
                                value={item.priority}
                                onChange={(e) =>
                                  updateItem(item._id, {
                                    priority: parseInt(e.target.value, 10) || 1,
                                  })
                                }
                              />
                            </Field.Root>
                            <Field.Root w="28">
                              <Field.Label>Image Index</Field.Label>
                              <Input
                                type="number"
                                min={0}
                                value={item.imageIndex}
                                onChange={(e) =>
                                  updateItem(item._id, {
                                    imageIndex:
                                      parseInt(e.target.value, 10) || 0,
                                  })
                                }
                              />
                            </Field.Root>
                            <img
                              src={`/news/${item.imageIndex}.png`}
                              alt={`News slot preview ${item.imageIndex}`}
                              style={{
                                height: '80px',
                                borderRadius: '6px',
                                objectFit: 'cover',
                              }}
                            />
                          </Flex>

                          {/* Language text */}
                          <Stack gap="2">
                            <Text
                              textStyle="sm"
                              fontWeight="medium"
                              color="fg.muted"
                            >
                              Localized Text
                            </Text>
                            <Tabs.Root defaultValue="en" w="full">
                              <Tabs.List flexWrap="wrap">
                                <For each={LANGUAGES}>
                                  {({ label, value: lang }) => {
                                    const text = item.texts.find(
                                      (t) => t.language === lang,
                                    );
                                    const hasError =
                                      lang === 'en' &&
                                      !!(
                                        errors?.[idx]?.title ||
                                        errors?.[idx]?.message
                                      );
                                    const hasContent = !!(
                                      text?.title.trim() || text?.message.trim()
                                    );
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
                                  const text = item.texts.find(
                                    (t) => t.language === lang,
                                  );
                                  return (
                                    <Tabs.Content key={lang} value={lang}>
                                      <Stack gap="3" pt="3">
                                        <Field.Root
                                          invalid={
                                            lang === 'en' &&
                                            !!errors?.[idx]?.title
                                          }
                                        >
                                          <Field.Label>Title</Field.Label>
                                          <Input
                                            value={text?.title ?? ''}
                                            onChange={(e) =>
                                              updateText(item._id, lang, {
                                                title: e.target.value,
                                              })
                                            }
                                          />
                                          <Show
                                            when={
                                              lang === 'en' &&
                                              errors?.[idx]?.title
                                            }
                                          >
                                            {(err) => (
                                              <Field.ErrorText>
                                                {err}
                                              </Field.ErrorText>
                                            )}
                                          </Show>
                                        </Field.Root>
                                        <Field.Root
                                          invalid={
                                            lang === 'en' &&
                                            !!errors?.[idx]?.message
                                          }
                                        >
                                          <Field.Label>Message</Field.Label>
                                          <RichTextEditor
                                            value={text?.message ?? ''}
                                            rows={4}
                                            invalid={
                                              lang === 'en' &&
                                              !!errors?.[idx]?.message
                                            }
                                            onChange={(v) =>
                                              updateText(item._id, lang, {
                                                message: v,
                                              })
                                            }
                                          />
                                          <Show
                                            when={
                                              lang === 'en' &&
                                              errors?.[idx]?.message
                                            }
                                          >
                                            {(err) => (
                                              <Field.ErrorText>
                                                {err}
                                              </Field.ErrorText>
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
                      </Tabs.Content>
                    )}
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
              {editEntry ? 'Save Changes' : 'Create Entry'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
