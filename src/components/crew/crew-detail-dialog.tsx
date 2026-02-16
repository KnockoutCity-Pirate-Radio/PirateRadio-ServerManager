import { Link as RouterLink } from '@tanstack/react-router';
import { ShieldIcon, XIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import { Divider, HStack, Stack } from 'styled-system/jsx';
import { match } from 'ts-pattern';
import { For } from '~/components/helper/for';
import { Show } from '~/components/helper/show';
import type { Crew } from '~/data/types';
import { Badge, Heading, Link, Text } from '~/ui';
import * as Dialog from '~/ui/dialog';
import { Icon } from '~/ui/icon';
import { IconButton } from '~/ui/icon-button';
import * as Table from '~/ui/table';

const formatTs = (ts: number | null) => {
  if (ts === null) return '—';
  return DateTime.fromMillis(ts).toLocaleString(DateTime.DATETIME_MED);
};

interface Props {
  crew: Crew;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CrewDetailDialog = (props: Props) => {
  const { crew, open, onOpenChange } = props;

  return (
    <Dialog.Root
      size="lg"
      open={open}
      onOpenChange={({ open: o }) => onOpenChange(o)}
    >
      <Dialog.Trigger asChild>
        <IconButton variant="plain" size="sm" aria-label="View crew details">
          <Icon size="sm">
            <ShieldIcon />
          </Icon>
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content minW="40%">
          <Dialog.Header>
            <Dialog.Title>Crew Details</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap="6" w="full">
              <Stack gap="3">
                <Heading textStyle="sm">Info</Heading>
                <Stack gap="2">
                  <HStack justify="space-between">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Name
                    </Text>
                    <HStack gap="2">
                      <Text textStyle="sm" fontWeight="medium">
                        {crew.name}
                      </Text>
                      <Show when={!crew.nameVisible}>
                        <Badge variant="subtle" colorPalette="gray">
                          Hidden
                        </Badge>
                      </Show>
                    </HStack>
                  </HStack>
                  <HStack justify="space-between">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Code
                    </Text>
                    <Text textStyle="sm">#{crew.code}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      GUID
                    </Text>
                    <Text textStyle="sm" fontFamily="mono" color="fg.muted">
                      {crew.guid}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                      Created
                    </Text>
                    <Text textStyle="sm">{formatTs(crew.createdAt)}</Text>
                  </HStack>
                  <Show when={crew.updatedAt !== null}>
                    <HStack justify="space-between">
                      <Text textStyle="xs" color="fg.muted" fontWeight="medium">
                        Last Updated
                      </Text>
                      <Text textStyle="sm">{formatTs(crew.updatedAt)}</Text>
                    </HStack>
                  </Show>
                </Stack>
              </Stack>

              <Divider />

              <Stack gap="3">
                <HStack justify="space-between">
                  <Heading textStyle="sm">Members</Heading>
                  <Badge variant="subtle" colorPalette="gray">
                    {crew.memberCount}
                  </Badge>
                </HStack>
                <Show
                  when={crew.members.length > 0}
                  fallback={
                    <Text textStyle="sm" color="fg.muted">
                      No members.
                    </Text>
                  }
                >
                  <Table.Root size="md">
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>Username</Table.Header>
                        <Table.Header>Role</Table.Header>
                        <Table.Header>Joined</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      <For each={crew.members}>
                        {(member) => (
                          <Table.Row key={member.id}>
                            <Table.Cell fontWeight="medium">
                              <Link asChild>
                                <RouterLink
                                  to="/user"
                                  search={{ id: member.id }}
                                >
                                  {member.username}
                                </RouterLink>
                              </Link>
                            </Table.Cell>
                            <Table.Cell>
                              {match(member.isCaptain)
                                .with(true, () => (
                                  <Badge variant="subtle" colorPalette="yellow">
                                    Captain
                                  </Badge>
                                ))
                                .with(false, () => (
                                  <Text textStyle="xs" color="fg.muted">
                                    Member
                                  </Text>
                                ))
                                .exhaustive()}
                            </Table.Cell>
                            <Table.Cell>
                              <Text textStyle="sm" color="fg.muted">
                                {formatTs(member.joinedAt)}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </For>
                    </Table.Body>
                  </Table.Root>
                </Show>
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
