import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react';
import { Box, Divider, Flex, Stack } from 'styled-system/jsx';
import { Show } from '~/components/helper/show';
import { Button, Collapsible, Icon, IconButton, Spinner, Text } from '~/ui';

export interface PendingChange {
  id: string;
  from: string;
  to: string;
}

interface Props {
  changes: PendingChange[];
  saving: boolean;
  onSave: () => void;
  onRevert: () => void;
  onRevertChange: (id: string) => void;
}

export const PendingChangesBar = ({
  changes,
  saving,
  onSave,
  onRevert,
  onRevertChange,
}: Props) => {
  const count = changes.length;

  return (
    <Box
      position="fixed"
      bottom="6"
      left="50%"
      transform="translateX(-50%)"
      zIndex="toast"
      bg="gray.surface.bg"
      borderWidth="1px"
      borderRadius="l3"
      shadow="lg"
      minW="sm"
      maxW="lg"
      w="full"
      overflow="hidden"
    >
      <Collapsible.Root>
        <Flex align="center" gap="4" px="5" py="3">
          <Collapsible.Trigger asChild>
            <Flex
              align="center"
              gap="1"
              cursor="pointer"
              flex="1"
              _hover={{ color: 'fg.default' }}
              color="fg.muted"
            >
              <Text textStyle="sm" fontWeight="medium" color="fg.default">
                {count} unsaved {count === 1 ? 'change' : 'changes'}
              </Text>
              <Collapsible.Context>
                {({ open }) => (
                  <Icon>
                    <Show when={open} fallback={<ChevronDownIcon />}>
                      <ChevronUpIcon />
                    </Show>
                  </Icon>
                )}
              </Collapsible.Context>
            </Flex>
          </Collapsible.Trigger>

          <Flex gap="2" flexShrink="0">
            <Button
              size="sm"
              variant="plain"
              onClick={onRevert}
              disabled={saving}
            >
              Revert
            </Button>
            <Button
              size="sm"
              colorPalette="teal"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? <Spinner size="xs" /> : null}
              Save changes
            </Button>
          </Flex>
        </Flex>

        <Collapsible.Content>
          <Divider />
          <Stack gap="0" maxH="64" overflowY="auto">
            {changes.map((change) => (
              <Flex
                key={change.id}
                align="center"
                gap="3"
                px="5"
                py="2"
                _odd={{ bg: 'gray.subtle.bg' }}
              >
                <Text textStyle="xs" fontWeight="medium" flex="1" truncate>
                  {change.id}
                </Text>
                <Flex align="center" gap="2" flexShrink="0">
                  <Text textStyle="xs" color="fg.muted" fontFamily="mono">
                    {change.from || '—'}
                  </Text>
                  <Text textStyle="xs" color="fg.subtle">
                    →
                  </Text>
                  <Text
                    textStyle="xs"
                    color="teal.9"
                    fontWeight="medium"
                    fontFamily="mono"
                  >
                    {change.to}
                  </Text>
                  <IconButton
                    size="xs"
                    variant="plain"
                    aria-label="Revert change"
                    onClick={() => onRevertChange(change.id)}
                    disabled={saving}
                  >
                    <Icon size="sm">
                      <XIcon />
                    </Icon>
                  </IconButton>
                </Flex>
              </Flex>
            ))}
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
