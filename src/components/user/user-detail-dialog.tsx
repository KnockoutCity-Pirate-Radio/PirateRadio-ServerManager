import { Link as RouterLink } from '@tanstack/react-router';
import { BanIcon, LogOutIcon, UserIcon, XIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Divider, Grid, GridItem, HStack, Stack } from 'styled-system/jsx';
import { match } from 'ts-pattern';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import { CURRENCY_NAMES } from '~/data/currencies';
import type { User } from '~/data/types';
import { Badge, Button, Heading, Link, Text } from '~/ui';
import * as Dialog from '~/ui/dialog';
import { Icon } from '~/ui/icon';
import { IconButton } from '~/ui/icon-button';

const formatTs = (ts: number | null) => {
  if (ts === null) return '—';
  return DateTime.fromMillis(ts).toLocaleString(DateTime.DATETIME_MED);
};

const isPenaltyActive = (utc: number | null): boolean => {
  if (utc === null) return false;
  return utc > DateTime.now().toUnixInteger();
};

const formatPenaltyExpiry = (utc: number) =>
  DateTime.fromSeconds(utc).toLocaleString(DateTime.DATETIME_MED);

interface Props {
  user: User;
  onReload: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailDialog = (props: Props) => {
  const { user, onReload, open, onOpenChange } = props;
  const [clearingCooldown, setClearingCooldown] = useState(false);

  const clearCooldown = async () => {
    setClearingCooldown(true);
    try {
      await fetch(`/api/users/${user.id}/cooldown`, { method: 'DELETE' });
      onReload();
    } finally {
      setClearingCooldown(false);
    }
  };

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={({ open: o }) => onOpenChange(o)}
    >
      <Dialog.Trigger asChild>
        <IconButton variant="plain" size="sm" aria-label="View user details">
          <Icon size="sm">
            <UserIcon />
          </Icon>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content minW="40%">
          <Dialog.Header>
            <Dialog.Title>User Details</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap="6" w="full">
              <Grid columns={2} gap="4" w="full">
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Username
                    </Text>
                    <Text textStyle="sm" fontWeight="medium">
                      {user.username}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Publisher Username
                    </Text>
                    <Text textStyle="sm">{user.publisherUsername ?? '—'}</Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      User ID
                    </Text>
                    <Text textStyle="sm" fontFamily="mono" color="fg.muted">
                      {user.id}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Username Visible
                    </Text>
                    <Badge
                      variant="subtle"
                      colorPalette={user.usernameVisible ? 'green' : 'red'}
                      w="fit-content"
                    >
                      {user.usernameVisible ? 'Yes' : 'No'}
                    </Badge>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Member Since
                    </Text>
                    <Text textStyle="sm">{formatTs(user.insertedAt)}</Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Last Seen
                    </Text>
                    <Text textStyle="sm">
                      {formatTs(user.lastAuthenticatedAt)}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Total XP (S6)
                    </Text>
                    <Text textStyle="sm">
                      {user.rawXpS6 !== null
                        ? user.rawXpS6.toLocaleString()
                        : '—'}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      MMR
                    </Text>
                    <Text textStyle="sm">
                      {user.mmr !== null ? user.mmr.toLocaleString() : '—'}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Friends
                    </Text>
                    <Text textStyle="sm">
                      {user.friendCount != null
                        ? user.friendCount.toLocaleString()
                        : '—'}
                    </Text>
                  </Stack>
                </GridItem>
                <GridItem>
                  <Stack gap="1">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Blocks
                    </Text>
                    <Text textStyle="sm">
                      {user.blockCount != null
                        ? user.blockCount.toLocaleString()
                        : '—'}
                    </Text>
                  </Stack>
                </GridItem>
              </Grid>

              <Divider />

              <Stack gap="2">
                <Heading textStyle="sm">Matchmaking</Heading>
                <Grid columns={2} gap="4" w="full">
                  <GridItem>
                    <Stack gap="1">
                      <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                        Queue
                      </Text>
                      {match(user.matchmaking)
                        .with(null, () => (
                          <Badge
                            variant="subtle"
                            colorPalette="gray"
                            w="fit-content"
                          >
                            Not queuing
                          </Badge>
                        ))
                        .otherwise((mm) => (
                          <Stack gap="1">
                            <Badge
                              variant="subtle"
                              colorPalette="blue"
                              w="fit-content"
                            >
                              In Queue
                            </Badge>
                            <Text textStyle="xs" color="fg.muted">
                              Platform: {mm.platform} · Flow: {mm.matchFlow}
                              {mm.startTime !== null
                                ? ` · Since ${formatTs(mm.startTime)}`
                                : ''}
                            </Text>
                          </Stack>
                        ))}
                    </Stack>
                  </GridItem>
                  <GridItem>
                    <Stack gap="1">
                      <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                        Penalty
                      </Text>
                      {match(isPenaltyActive(user.penaltyUtc))
                        .with(true, () => (
                          <Stack gap="2">
                            <Stack gap="1">
                              <Badge
                                variant="subtle"
                                colorPalette="red"
                                w="fit-content"
                              >
                                Active
                              </Badge>
                              <Text textStyle="xs" color="fg.muted">
                                Expires{' '}
                                {user.penaltyUtc !== null
                                  ? formatPenaltyExpiry(user.penaltyUtc)
                                  : '—'}
                              </Text>
                            </Stack>
                            <Button
                              variant="outline"
                              size="sm"
                              colorPalette="red"
                              loading={clearingCooldown}
                              onClick={clearCooldown}
                              w="fit-content"
                            >
                              Clear Cooldown
                            </Button>
                          </Stack>
                        ))
                        .with(false, () => (
                          <Badge
                            variant="subtle"
                            colorPalette="green"
                            w="fit-content"
                          >
                            None
                          </Badge>
                        ))
                        .exhaustive()}
                    </Stack>
                  </GridItem>
                </Grid>
              </Stack>

              <Divider />

              <Stack gap="2">
                <Heading textStyle="sm">Crew</Heading>
                <Show
                  when={user.crew}
                  fallback={
                    <Text textStyle="sm" color="fg.muted">
                      —
                    </Text>
                  }
                >
                  {(crew) => (
                    <Stack gap="1">
                      <HStack gap="2">
                        <Link asChild fontWeight="medium" textStyle="sm">
                          <RouterLink to="/crew" search={{ guid: crew.guid }}>
                            {crew.name}
                          </RouterLink>
                        </Link>
                        <Text textStyle="xs" color="fg.muted">
                          #{crew.code}
                        </Text>
                        <Show when={crew.isCaptain}>
                          <Badge variant="subtle" colorPalette="yellow">
                            Captain
                          </Badge>
                        </Show>
                      </HStack>
                    </Stack>
                  )}
                </Show>
              </Stack>

              <Divider />

              <Stack gap="2">
                <Heading textStyle="sm">Funds</Heading>
                <Show
                  when={user.funds.length > 0}
                  fallback={
                    <Text textStyle="sm" color="fg.muted">
                      —
                    </Text>
                  }
                >
                  <Grid columns={2} gap="2" w="full">
                    <For each={user.funds}>
                      {(f) => (
                        <GridItem key={f.currency}>
                          <Stack gap="0">
                            <Text
                              textStyle="xs"
                              color="fg.muted"
                              fontWeight="medium"
                            >
                              {CURRENCY_NAMES[f.currency] ?? f.currency}
                            </Text>
                            <Text textStyle="sm">
                              {f.balance.toLocaleString()}
                            </Text>
                          </Stack>
                        </GridItem>
                      )}
                    </For>
                  </Grid>
                </Show>
              </Stack>

              <Divider />

              <Stack gap="2">
                <Heading textStyle="sm">Allowlist</Heading>
                <Show
                  when={user.allowlisted}
                  fallback={
                    <Badge variant="subtle" colorPalette="gray" w="fit-content">
                      Not allowlisted
                    </Badge>
                  }
                >
                  {(al) => (
                    <HStack gap="2" flexWrap="wrap">
                      <Show when={al.alwaysAllowLogin}>
                        <Badge variant="subtle" colorPalette="green">
                          Always Allow Login
                        </Badge>
                      </Show>
                      <Show when={al.forceCohortA}>
                        <Badge variant="subtle" colorPalette="teal">
                          Cohort A
                        </Badge>
                      </Show>
                      <Show when={al.forceCohortB}>
                        <Badge variant="subtle" colorPalette="teal">
                          Cohort B
                        </Badge>
                      </Show>
                      <Show when={al.contentUpdate}>
                        <Badge variant="subtle" colorPalette="purple">
                          Content Update
                        </Badge>
                      </Show>
                    </HStack>
                  )}
                </Show>
              </Stack>

              <Divider />

              <Stack gap="2">
                <Heading textStyle="sm">Actions</Heading>
                <HStack gap="2">
                  <Button
                    variant="outline"
                    size="sm"
                    colorPalette="orange"
                    disabled
                  >
                    <Icon size="sm">
                      <LogOutIcon />
                    </Icon>
                    Kick
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    colorPalette="red"
                    disabled
                  >
                    <Icon size="sm">
                      <BanIcon />
                    </Icon>
                    Ban
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <IconButton variant="outline" size="sm" aria-label="Close">
                <Icon size="sm">
                  <XIcon />
                </Icon>
              </IconButton>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
