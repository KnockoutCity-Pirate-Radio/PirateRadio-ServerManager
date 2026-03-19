import { Flex } from 'styled-system/jsx';
import { Text } from '~/ui';
import pkg from '../../../../package.json';

export const Navbar = () => {
  return (
    <Flex px="6" pt="3" justifyContent="flex-end" alignItems="center" gap="3">
      <Text textStyle="xs" color="fg.subtle">
        Made by Tandashi
      </Text>
      <Text textStyle="xs" color="fg.muted" fontWeight="medium">
        v{pkg.version}
      </Text>
    </Flex>
  );
};
