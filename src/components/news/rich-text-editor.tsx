import { PaletteIcon, SmileIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Box, Flex, Stack } from 'styled-system/jsx';
import {
  Button,
  Field,
  IconButton,
  Input,
  Text,
  Textarea,
  Tooltip,
} from '~/ui';

const ICONS = [
  'button_add',
  'button_add_brawler',
  'button_bottom_face',
  'button_bullet',
  'button_close',
  'button_confirm',
  'button_contracts',
  'button_currency',
  'button_currency_event',
  'button_currency_event_test',
  'button_currency_variant',
  'button_dpad_down',
  'button_dpad_left',
  'button_dpad_right',
  'button_dpad_up',
  'button_friends',
  'button_group_channel',
  'button_leaderboard',
  'button_league_details',
  'button_left_face',
  'button_menu',
  'button_move',
  'button_mutual',
  'button_network_switch',
  'button_next_option',
  'button_next_option_alt_arrow',
  'button_off_channel',
  'button_pc_quit',
  'button_prev_option',
  'button_prev_option_alt_arrow',
  'button_reset',
  'button_select',
  'button_team_channel',
  'button_text_to_speech',
  'button_track',
  'button_tutorial_window',
  'button_unready',
  'button_velan_id',
  'button_warning',
  'button_xp',
  'keyboard_backspace',
  'keyboard_down_arrow',
  'keyboard_enter',
  'keyboard_esc',
  'keyboard_left_alt',
  'keyboard_left_arrow',
  'keyboard_left_ctrl',
  'keyboard_left_shift',
  'keyboard_left_super',
  'keyboard_right_alt',
  'keyboard_right_arrow',
  'keyboard_right_ctrl',
  'keyboard_right_shift',
  'keyboard_right_super',
  'keyboard_spacebar',
  'keyboard_t',
  'keyboard_tab',
  'keyboard_up_arrow',
  'mouse_button_left',
  'mouse_button_middle',
  'mouse_button_right',
  'mouse_x',
  'mouse_y',
  'pad_add',
  'pad_button_a',
  'pad_button_b',
  'pad_button_down',
  'pad_button_lb',
  'pad_button_left',
  'pad_button_ls',
  'pad_button_lt',
  'pad_button_minus',
  'pad_button_plus',
  'pad_button_rb',
  'pad_button_right',
  'pad_button_rs',
  'pad_button_rt',
  'pad_button_up',
  'pad_button_x',
  'pad_button_y',
  'pad_decimal',
  'pad_divide',
  'pad_enter',
  'pad_left_stick_x',
  'pad_left_stick_y',
  'pad_multiply',
  'pad_right_stick_x',
  'pad_right_stick_y',
  'pad_subtract',
] as const;

type Panel = 'color' | 'icon' | null;

interface Props {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  invalid?: boolean;
}

export const RichTextEditor = (props: Props) => {
  const { value, onChange, rows = 4, invalid } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [color, setColor] = useState('#ffffff');
  const [hexInput, setHexInput] = useState('#ffffff');
  const [iconSearch, setIconSearch] = useState('');

  const togglePanel = (p: Panel) => setPanel((prev) => (prev === p ? null : p));

  const getSelection = () => {
    const el = textareaRef.current;
    if (!el) return { start: 0, end: 0, selected: '' };
    return {
      start: el.selectionStart,
      end: el.selectionEnd,
      selected: value.slice(el.selectionStart, el.selectionEnd),
    };
  };

  const insertAt = (before: string, after = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const { start, end, selected } = getSelection();
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    const cursor = start + before.length + selected.length + after.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  const applyColor = () => {
    const hex = hexInput.replace(/^#/, '').toUpperCase();
    const tag = `:#${hex}FF:`;
    insertAt(tag, ':#endcolor:');
  };

  const handleColorChange = (v: string) => {
    setColor(v);
    setHexInput(v);
  };

  const handleHexInput = (v: string) => {
    setHexInput(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v);
  };

  const insertIcon = (name: string) => {
    insertAt(`:${name}:`);
  };

  const filteredIcons = iconSearch
    ? ICONS.filter((i) => i.includes(iconSearch.toLowerCase()))
    : ICONS;

  return (
    <Stack gap="1">
      {/* Toolbar */}
      <Flex
        gap="1"
        px="2"
        py="1"
        borderWidth="1px"
        borderColor={invalid ? 'border.error' : 'border.default'}
        borderBottomWidth="0"
        roundedTop="md"
        bg="bg.subtle"
      >
        <Tooltip content="Wrap selection with color">
          <IconButton
            size="xs"
            variant={panel === 'color' ? 'subtle' : 'plain'}
            colorPalette="gray"
            aria-label="Color"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePanel('color');
            }}
          >
            <PaletteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip content="Insert icon">
          <IconButton
            size="xs"
            variant={panel === 'icon' ? 'subtle' : 'plain'}
            colorPalette="gray"
            aria-label="Insert icon"
            onMouseDown={(e) => {
              e.preventDefault();
              togglePanel('icon');
            }}
          >
            <SmileIcon />
          </IconButton>
        </Tooltip>
      </Flex>

      {/* Color panel */}
      {panel === 'color' && (
        <Box
          borderWidth="1px"
          borderColor={invalid ? 'border.error' : 'border.default'}
          borderBottomWidth="0"
          bg="bg.canvas"
          px="3"
          py="2"
        >
          <Stack gap="2">
            <Text textStyle="xs" color="fg.muted" fontWeight="semibold">
              Color
            </Text>
            <Flex gap="2" align="center">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  padding: 2,
                  borderRadius: 4,
                }}
              />
              <Field.Root w="32">
                <Input
                  size="sm"
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#ffffff"
                  fontFamily="mono"
                />
              </Field.Root>
              <Button size="sm" onClick={applyColor}>
                Apply
              </Button>
            </Flex>
            <Text textStyle="xs" color="fg.subtle" fontStyle="italic">
              Select text first, then apply color. Outputs{' '}
              <Box as="code" fontFamily="mono">
                :#HEX:text:#endcolor:
              </Box>
            </Text>
          </Stack>
        </Box>
      )}

      {/* Icon panel */}
      {panel === 'icon' && (
        <Box
          borderWidth="1px"
          borderColor={invalid ? 'border.error' : 'border.default'}
          borderBottomWidth="0"
          bg="bg.canvas"
          px="3"
          py="2"
        >
          <Stack gap="2">
            <Text textStyle="xs" color="fg.muted" fontWeight="semibold">
              Insert Icon
            </Text>
            <Input
              size="sm"
              placeholder="Search icons..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
            />
            <Box
              overflowY="auto"
              maxH="40"
              borderWidth="1px"
              borderColor="border.subtle"
              rounded="md"
              p="1"
            >
              <Flex flexWrap="wrap" gap="1">
                {filteredIcons.map((icon) => (
                  <Tooltip key={icon} content={icon}>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="gray"
                      fontFamily="mono"
                      fontSize="2xs"
                      px="1.5"
                      onClick={() => insertIcon(icon)}
                    >
                      {icon}
                    </Button>
                  </Tooltip>
                ))}
                {filteredIcons.length === 0 && (
                  <Text
                    textStyle="xs"
                    color="fg.subtle"
                    fontStyle="italic"
                    p="1"
                  >
                    No icons found
                  </Text>
                )}
              </Flex>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        borderTopRadius="0"
        fontFamily="mono"
        textStyle="sm"
      />
    </Stack>
  );
};
