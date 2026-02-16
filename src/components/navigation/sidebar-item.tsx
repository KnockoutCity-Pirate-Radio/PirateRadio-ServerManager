import { Link } from '@tanstack/react-router';
// @ts-expect-error See https://github.com/lucide-icons/lucide/issues/4027
import { DynamicIcon } from 'lucide-react/dynamic.mjs';
import { HStack } from 'styled-system/jsx';
import type { FileRouteTypes } from '~/route-tree.gen';
import { Button } from '~/ui/button';
import { Text } from '~/ui/text';
import { Tooltip } from '~/ui/tooltip';

export interface SideBarItemProps {
  icon: string;
  label: string;
  collapsed?: boolean;
  to: FileRouteTypes['to'];
}

export const SidebarItem = (props: SideBarItemProps) => {
  const { label, icon, to, collapsed } = props;
  return (
    <Tooltip content={label} disabled={!collapsed}>
      <Button
        asChild
        variant="plain"
        justifyContent="start"
        textStyle="sm"
        px="2.5"
        color="fg.muted"
        width={collapsed ? '10' : 'auto'}
        _currentPage={{ color: 'fg.default' }}
      >
        <Link to={to}>
          <HStack py="1">
            <DynamicIcon name={icon} />
            {!collapsed && (
              <Text
                as="span"
                transition="opacity 0.2s ease-in-out, width 0.2s ease-in-out"
                whiteSpace="nowrap"
              >
                {label}
              </Text>
            )}
          </HStack>
        </Link>
      </Button>
    </Tooltip>
  );
};
