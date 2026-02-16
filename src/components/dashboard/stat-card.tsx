import { Flex } from 'styled-system/jsx';
import { Skeleton, Text } from '~/ui';

interface Props {
  /** Label displayed above the value */
  label: string;
  /** Formatted value to display; renders '—' when undefined */
  value: string | number | undefined;
  /** When true, renders a skeleton placeholder instead of the value */
  loading: boolean;
}

/** Single statistic card with a label and a large numeric value. */
export const StatCard = (props: Props) => {
  const { label, value, loading } = props;
  return (
    <Flex
      flexDirection="column"
      gap="1"
      borderWidth="1px"
      borderRadius="l2"
      p="4"
    >
      <Text
        textStyle="xs"
        color="fg.muted"
        textTransform="uppercase"
        fontWeight="medium"
      >
        {label}
      </Text>
      {loading ? (
        <Skeleton h="8" w="16" />
      ) : (
        <Text textStyle="2xl" fontWeight="bold">
          {value ?? '—'}
        </Text>
      )}
    </Flex>
  );
};
