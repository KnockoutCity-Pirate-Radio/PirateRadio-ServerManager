import { Box, Container } from 'styled-system/jsx';

export const Navbar = () => {
  return (
    <Box
      as="header"
      bg="gray.surface.bg"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Container maxW="unset" p="5">
        {/* <Text>Pirate Radio: Server Manager</Text> */}
      </Container>
    </Box>
  );
};
