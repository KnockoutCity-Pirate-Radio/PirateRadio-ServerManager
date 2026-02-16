import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { useState } from 'react';
import { Box, Grid, Stack } from 'styled-system/jsx';
import { IconButton } from '~/ui/icon-button';
import { type SideBarItemProps, SidebarItem } from './sidebar-item';

const sidebarItems: Array<SideBarItemProps> = [
  { to: '/', icon: 'home', label: 'Overview' },
  { to: '/user', icon: 'users', label: 'Users' },
  { to: '/crew', icon: 'shield', label: 'Crews' },
  { to: '/tunables', icon: 'bolt', label: 'Tunables' },
  { to: '/news', icon: 'newspaper', label: 'News' },
  { to: '/maintenance', icon: 'construction', label: 'Maintenance' },
] as const;

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Grid
      gridTemplateRows="1fr auto"
      width={collapsed ? '64px' : '2xs'}
      transition="width 0.2s ease-in-out"
    >
      <Stack
        overflowY="auto"
        py="5"
        px="2"
        pr="0"
        gap="0.5"
        alignItems={collapsed ? 'center' : 'start'}
      >
        {sidebarItems.map((item) => (
          <SidebarItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </Stack>
      <Box position="sticky" bottom="0" px="3" py="2" bg="gray.surface.bg">
        <IconButton
          variant="plain"
          onClick={() => setCollapsed(!collapsed)}
          color="fg.muted"
        >
          {collapsed ? <PanelLeftOpenIcon /> : <PanelLeftCloseIcon />}
        </IconButton>
      </Box>
    </Grid>
  );
};
