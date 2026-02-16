import { Wrap } from 'styled-system/jsx';
import { Badge } from '~/ui';
import type { Tag } from './tunable';

type Props = {
  tags: Tag[];
  activeTags: Set<string>;
  onToggle: (text: string) => void;
};

export const TagFilter = ({ tags, activeTags, onToggle }: Props) => {
  return (
    <Wrap gap="2">
      {tags.map((tag) => (
        <Badge
          key={tag.text}
          colorPalette={tag.colorPalette}
          variant={activeTags.has(tag.text) ? 'solid' : 'outline'}
          cursor="pointer"
          userSelect="none"
          onClick={() => onToggle(tag.text)}
        >
          {tag.text}
        </Badge>
      ))}
    </Wrap>
  );
};
