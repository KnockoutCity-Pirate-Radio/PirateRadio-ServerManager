import { Box, Flex, Wrap } from 'styled-system/jsx';
import type { UtilityValues } from 'styled-system/types/prop-type';
import { Badge, Heading, NumberInput, Text } from '~/ui';
import { For } from '../helper/for';
import { Show } from '../helper/show';

export type Tag = { text: string; colorPalette: UtilityValues['colorPalette'] };

export type Props = {
  id: string;
  description: string;
  tags: Tag[];

  defaultValue?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const Tunable = ({
  id,
  description,
  tags,
  defaultValue,
  value,
  onValueChange,
  min,
  max,
  step,
}: Props) => {
  const isDirty = value !== undefined && value !== String(defaultValue ?? '');
  return (
    <Flex
      flexDirection="column"
      gap="2"
      borderWidth="1px"
      borderRadius="l2"
      p="4"
      borderColor={isDirty ? 'colorPalette.emphasized' : undefined}
      colorPalette={isDirty ? 'teal' : undefined}
    >
      <Heading>{id}</Heading>
      <Wrap>
        <For each={tags}>
          {(tag) => <Badge colorPalette={tag.colorPalette}>{tag.text}</Badge>}
        </For>
      </Wrap>
      <Box>
        <Text textStyle="sm">{description}</Text>
        <Show when={defaultValue !== undefined}>
          <Text textStyle="sm" fontStyle="italic">
            Default: {defaultValue}
          </Text>
        </Show>
      </Box>

      <NumberInput.Root
        size="sm"
        value={value ?? defaultValue?.toString() ?? ''}
        onValueChange={(details) => onValueChange?.(details.value)}
        min={min}
        max={max}
        step={step}
      >
        <NumberInput.Control />
        <NumberInput.Input />
      </NumberInput.Root>
    </Flex>
  );
};
