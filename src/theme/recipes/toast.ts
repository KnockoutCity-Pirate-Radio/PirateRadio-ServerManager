import { toastAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const toast = defineSlotRecipe({
  className: 'toast',
  slots: toastAnatomy.keys(),
  base: {
    root: {
      alignItems: 'start',
      background: 'gray.surface.bg',
      borderRadius: 'l3',
      boxShadow: 'lg',
      display: 'flex',
      gap: '4',
      height: 'var(--height)',
      minWidth: 'sm',
      opacity: 'var(--opacity)',
      overflowWrap: 'anywhere',
      p: '4',
      position: 'relative',
      scale: 'var(--scale)',
      transitionDuration: 'slow',
      transitionProperty: 'translate, scale, opacity, height',
      transitionTimingFunction: 'default',
      translate: 'var(--x) var(--y)',
      width: 'full',
      willChange: 'translate, opacity, scale',
      zIndex: 'var(--z-index)',
      '&[data-type="error"]': {
        background: 'red.3',
        borderWidth: '1px',
        borderColor: 'red.6',
        color: 'red.11',
      },
      '&[data-type="success"]': {
        background: 'green.3',
        borderWidth: '1px',
        borderColor: 'green.6',
        color: 'green.11',
      },
      '&[data-type="warning"]': {
        background: 'orange.3',
        borderWidth: '1px',
        borderColor: 'orange.6',
        color: 'orange.11',
      },
    },
    title: {
      color: 'fg.default',
      fontWeight: 'medium',
      textStyle: 'sm',
    },
    description: {
      color: 'fg.muted',
      textStyle: 'sm',
    },
    actionTrigger: {
      color: 'colorPalette.plain.fg',
      cursor: 'pointer',
      fontWeight: 'semibold',
      textStyle: 'sm',
    },
    closeTrigger: {
      position: 'absolute',
      top: '2',
      insetEnd: '2',
    },
  },
});
