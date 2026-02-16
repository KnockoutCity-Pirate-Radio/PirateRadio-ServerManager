import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { Container, Grid } from 'styled-system/jsx';
import { Navbar } from '~/components/navigation/navbar';
import { Sidebar } from '~/components/navigation/sidebar';
import { Spinner, Toaster } from '~/ui';

export const Route = createRootRoute({
  component: () => (
    <>
      <Grid
        gridTemplateRows="auto 1fr"
        h="dvh"
        overflow="hidden"
        bg="gray.surface.bg"
      >
        <Navbar />
        <Grid gridTemplateColumns="auto 1fr" overflow="hidden">
          <Sidebar />
          <Container
            width="full"
            bg="canvas"
            py="8"
            borderTopLeftRadius="3xl"
            borderStartWidth="1px"
            borderTopWidth="1px"
            overflowY="auto"
            maxW="unset"
          >
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </Container>
        </Grid>
      </Grid>
      <Toaster />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
});
