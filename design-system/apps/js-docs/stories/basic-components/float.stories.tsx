import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Float } from '@jellyfish-ds/ui/float'
import { Circle } from '@jellyfish-ds/ui/circle'
import type { FloatPlacement } from '@jellyfish-ds/ui/float'

const meta: Meta<typeof Float> = {
  title: 'Basic Components/Float',
  component: Float,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `

Posiciona filhos de forma absoluta, centralizado em um canto ou borda do ancestral mais próximo com \`position: relative\`.

## Quando usar

- Badges de notificação sobre ícones ou avatares
- Indicadores de status (online, offline, ausente)
- Contadores de itens em elementos da UI

## Quando NÃO usar

- Para tooltips ou popovers (use Popover/Tooltip)
- Quando o posicionamento depender do viewport (use posicionamento fixo)

## Anatomia

O \`Float\` envolve o conteúdo em um \`div\` com \`position: absolute\`. O container pai **precisa** ter \`position: relative\`.

O ponto de ancoragem de cada \`placement\` é o **centro do elemento Float** sobre o canto/borda escolhido.

## Props de offset

| Prop | Comportamento |
|------|--------------|
| \`offset\` | Aplica o mesmo deslocamento em X e Y |
| \`offsetX\` | Deslocamento horizontal (sobrescreve \`offset\` em X) |
| \`offsetY\` | Deslocamento vertical (sobrescreve \`offset\` em Y) |

Valores numéricos são tratados como \`px\`. Qualquer CSS length válido é aceito.
        `,
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'bottom-end',
        'bottom-start',
        'top-end',
        'top-start',
        'bottom-center',
        'top-center',
        'middle-center',
        'middle-end',
        'middle-start',
      ] satisfies FloatPlacement[],
      description: 'Posição âncora dentro do container relativo.',
      table: {
        type: { summary: 'FloatPlacement' },
        defaultValue: { summary: 'bottom-end' },
      },
    },
    offsetX: {
      control: 'text',
      description: 'Deslocamento horizontal. Números = px.',
    },
    offsetY: {
      control: 'text',
      description: 'Deslocamento vertical. Números = px.',
    },
    offset: {
      control: 'text',
      description: 'Atalho para offsetX + offsetY.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Float>

/** Container base com position: relative usado em todas as stories. */
function Box({ children, size = 64 }: { children?: React.ReactNode; size?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: size,
        height: size,
        borderRadius: 'var(--jf-corner-radius-lg)',
        background: 'var(--jf-color-bg-surface-secondary)',
        border: '1px solid var(--jf-color-bd-muted)',
      }}
    >
      {children}
    </div>
  )
}

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    placement: 'bottom-end',
  },
  render: (args) => (
    <Box>
      <Float {...args}>
        <Circle
          size="var(--jf-size-6)"
          bg="var(--jf-color-bg-brand-primary)"
          outline="2px solid"
          outlineColor="var(--jf-color-bg-surface-default)"
        />
      </Float>
    </Box>
  ),
}

// ─── All Placements ─────────────────────────────────────────────────────────────

const ALL_PLACEMENTS: FloatPlacement[] = [
  'top-start',    'top-center',    'top-end',
  'middle-start', 'middle-center', 'middle-end',
  'bottom-start', 'bottom-center', 'bottom-end',
]

export const AllPlacements: Story = {
  name: 'All Placements',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 48,
        padding: 24,
      }}
    >
      {ALL_PLACEMENTS.map((placement) => (
        <div
          key={placement}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Box>
            <Float placement={placement}>
              <Circle
                size="var(--jf-size-6)"
                bg="var(--jf-color-accent-500)"
                outline="2px solid"
                outlineColor="var(--jf-color-bg-surface-default)"
              />
            </Float>
          </Box>
          <span
            style={{
              fontSize: 11,
              color: 'var(--jf-color-fg-muted)',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}
          >
            {placement}
          </span>
        </div>
      ))}
    </div>
  ),
}

// ─── With Offset ────────────────────────────────────────────────────────────────

export const WithOffset: Story = {
  name: 'With Offset',
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', padding: 24 }}>
      {[
        { label: 'sem offset', props: {} },
        { label: 'offset={-4}', props: { offset: -4 } },
        { label: 'offset={-8}', props: { offset: -8 } },
        { label: 'offsetX={-6}', props: { offsetX: -6 } },
      ].map(({ label, props }) => (
        <div
          key={label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Box>
            <Float placement="bottom-end" {...props}>
              <Circle
                size={14}
                bg="var(--jf-color-brand-primary-500)"
                outline="2px solid"
                outlineColor="var(--jf-color-bg-surface-default)"
              />
            </Float>
          </Box>
          <span
            style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)', fontFamily: 'monospace' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
}

// ─── Status Indicator ───────────────────────────────────────────────────────────

export const StatusIndicator: Story = {
  name: 'Status Indicator',
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 24, alignItems: 'center' }}>
      {[
        { label: 'online',   bg: 'var(--jf-color-positive-500)' },
        { label: 'ausente',  bg: 'var(--jf-color-warning-500)' },
        { label: 'ocupado',  bg: 'var(--jf-color-critical-500)' },
        { label: 'offline',  bg: 'var(--jf-color-fg-muted)' },
      ].map(({ label, bg }) => (
        <div
          key={label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Box size={48}>
            <Float placement="bottom-end" offset={-2}>
              <Circle
                size={14}
                bg={bg}
                outline="2px solid"
                outlineColor="var(--jf-color-bg-surface-default)"
              />
            </Float>
          </Box>
          <span style={{ fontSize: 11, color: 'var(--jf-color-fg-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

// ─── Notification Badge ─────────────────────────────────────────────────────────

export const NotificationBadge: Story = {
  name: 'Notification Badge',
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 24, alignItems: 'center' }}>
      <Box size={48}>
        <Float placement="top-end" offset={-4}>
          <Circle
            size="var(--jf-size-8)"
            bg="var(--jf-color-critical-500)"
            outline="2px solid"
            outlineColor="var(--jf-color-bg-surface-default)"
            style={{
              color: 'var(--jf-color-fg-on-critical)',
            }}
          >
            3
          </Circle>
        </Float>
      </Box>

      <Box size={48}>
        <Float placement="top-end" offsetX={-6}>
          <Circle
            size="var(--jf-size-8)"
            bg="var(--jf-color-critical-500)"
            outline="2px solid"
            outlineColor="var(--jf-color-bg-surface-default)"
          />
        </Float>
      </Box>
    </div>
  ),
}
