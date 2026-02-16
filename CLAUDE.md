# CLAUDE.md

## Stack

- **Framework:** TanStack Router (file-based routing in `src/routes/`)
- **Runtime:** Bun
- **Build:** Vite 7
- **Language:** TypeScript 5.9 (strict)
- **Linting:** Biome — single quotes, no semicolons, 100-char lines, kebab-case filenames
- **Deploy:** Nitro with bun preset

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run lint` — run `biome lint`

## Design System (`~/ui` + `styled-system/jsx`)

Custom component library built on PandaCSS. **Not** shadcn/Tailwind.

### UI components — deep imports:

```tsx
import {
  Accordion,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Input,
  Tabs,
  Text,
  Textarea,
  toaster,
} from '~/ui';
```

### Layout primitives — from styled-system:

```tsx
import { Stack, HStack, VStack, Grid, GridItem, Box, Flex, Container, Divider } from 'styled-system/jsx'
```

### Icons — Lucide React:

```tsx
import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic' // render icon by name string
```

Always wrap Lucide icons with the `Icon` component instead of sizing them directly:

```tsx
// correct
import { Icon } from '~/ui'
<Icon size="sm">
  <StarIcon />
</Icon>

// wrong — never size icons directly
<StarIcon size={16} />
```

### Styling — PandaCSS props (not Tailwind classes):

- Layout: `gap="4"`, `p="5"`, `px="8"`, `boxSize="full"`
- Colors: `color="fg.muted"`, `color="fg.subtle"`, `bg="gray.surface.bg"`, `colorPalette="teal"`
- Typography: `textStyle="sm"`, `textStyle="xs"`, `textStyle="label"`, `fontWeight="medium"`
- Recipes: `layerStyle="card"`, `borderRadius="l3"`
- Pseudo: `_hover={{ color: 'fg.default' }}`, `_currentPage`, `_focusWithin`

### Compound components — dot notation:

```tsx
<Dialog.Root> <Dialog.Trigger> <Dialog.Content>
<Card.Header> <Card.Body>
<Steps.Root> <Steps.Item> <Steps.Content>
<Tabs.Root> <Tabs.List> <Tabs.Trigger> <Tabs.Content>
<SelectField.Root> <SelectField.Item> <SelectField.ItemIndicator>
```

### Forms — React Hook Form + Zod:

```tsx
const schema = z.object({ name: z.string().min(1) })
type Values = z.infer<typeof schema>
const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '' } })

<Form value={form} onSubmit={form.handleSubmit(handler)}>
  <InputField name="name" label="Name" placeholder="..." />
  <SelectField.Root name="type" label="Type" collection={collection}>
    {collection.items.map(item => (
      <SelectField.Item item={item} key={item.value}>{item.label}<SelectField.ItemIndicator /></SelectField.Item>
    ))}
  </SelectField.Root>
</Form>
```

## Component Conventions

- Default boilerplate:
  ```tsx
  interface Props {
    x: string
    y: number
  }

  export const ComponentFoo = (props: Props) => {
    const { x, y, ...rest } = props
    return (
      <Stack gap="4" {...rest}>
        ...
      </Stack>
    )
  }
  ```
- `asChild` pattern for polymorphic rendering (e.g., `<Dialog.Trigger asChild><Button>...`)
- Path aliases: `~/` → `./src/`, `~server/` → `./server/`
- Data currently mocked in `src/content/*.ts`
- Route components named `RouteComponent`, loader data via `Route.useLoaderData()`
- Server functions via `createServerFn` from `@tanstack/react-start`

## Key Directories

```
src/
  routes/          # TanStack file-based routes
  ui/              # UI Components
  data/            # Static Data
  theme/           # Theme Data
```