import { Flex } from 'styled-system/jsx';
import { Text } from '~/ui';

interface Props {
  /** Message to display in the empty state */
  children: string;
}

/** Dashed-border placeholder shown when a list or table has no items. */
export const EmptyBox = (props: Props) => {
  const { children } = props;
  return (
    <Flex
      align="center"
      justify="center"
      py="12"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="border.subtle"
      rounded="lg"
    >
      <Text textStyle="sm" color="fg.muted" fontStyle="italic">
        {children}
      </Text>
    </Flex>
  );
};
