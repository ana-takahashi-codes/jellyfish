import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton } from '@jellyfish-ds/ui/close-button'

const meta: Meta<typeof CloseButton> = {
  title: 'Basic/CloseButton',
  component: CloseButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Botão de fechamento (36×36px) usado para dispensar diálogos, painéis, alertas e outros elementos sobrepostos.

## Quando usar

- Para fechar modais, drawers, toasts ou alertas.
- Quando o elemento possui um título visível e o botão de fechar é complementar.

## Quando NÃO usar

- Como substituto de um botão de ação com texto — prefira \`Button\`.
- Quando a ação não é "fechar/dispensar".

## Anatomia

- **Container**: botão quadrado 36×36px, \`corner-default\` (6px), fundo transparente.
- **Ícone**: \`x\` do Tabler Icons, 24px, cor \`muted\`.

## Acessibilidade

- Sempre forneça \`aria-label\` descrevendo o que está sendo fechado (ex.: \`"Fechar modal"\`).
- O componente usa \`<button type="button">\` nativo — navegável por teclado por padrão.
- Estados de foco, hover e active vêm da classe \`.interactive\` (utilities.css).

## Figma

- [CloseButton — Variantes](https://www.figma.com/design/ilbkG0Smu7ZnqWqvCtLVGt/%F0%9F%92%8E-Basic-Components?node-id=2107-1219)
        `,
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão (aplica opacidade e bloqueia interação).',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Descrição acessível do que está sendo fechado.',
      table: { defaultValue: { summary: 'Fechar' } },
    },
    onClick: {
      action: 'clicked',
      description: 'Callback chamado ao clicar no botão.',
    },
    className: {
      control: 'text',
      description: 'Classes CSS adicionais.',
    },
  },
}

export default meta
type Story = StoryObj<typeof CloseButton>

// ─── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    disabled: false,
    'aria-label': 'Fechar',
  },
}

// ─── Estados ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {[
        { label: 'enabled',  disabled: false },
        { label: 'disabled', disabled: true  },
      ].map(({ label, disabled }) => (
        <div
          key={label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <CloseButton aria-label="Fechar" disabled={disabled} />
          <span style={{ fontSize: 12, color: 'var(--jf-color-fg-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

// ─── Em Modal ──────────────────────────────────────────────────────────────────

export const InModal: Story = {
  name: 'Em Modal',
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--jf-corner-radius-default)',
              border: '1px solid var(--jf-color-bd-muted)',
              background: 'var(--jf-color-bg-surface-default)',
              color: 'var(--jf-color-fg-strong)',
              cursor: 'pointer',
              fontSize: 'var(--jf-font-size-sm)',
            }}
          >
            Abrir modal
          </button>
        )}

        {open && (
          <div
            style={{
              width: 400,
              background: 'var(--jf-color-bg-surface-default)',
              borderRadius: 'var(--jf-corner-radius-lg)',
              border: '1px solid var(--jf-color-bd-muted)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 16px 16px 24px',
                borderBottom: '1px solid var(--jf-color-bd-muted)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--jf-font-size-lg)',
                  fontWeight: 600,
                  color: 'var(--jf-color-fg-strong)',
                }}
              >
                Confirmar ação
              </span>
              <CloseButton aria-label="Fechar modal" onClick={() => setOpen(false)} />
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px 24px' }}>
              <p style={{ margin: 0, fontSize: 'var(--jf-font-size-md)', color: 'var(--jf-color-fg-moderated)', lineHeight: 1.6 }}>
                Tem certeza que deseja continuar? Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  },
}

// ─── Em Alerta ─────────────────────────────────────────────────────────────────

export const InAlert: Story = {
  name: 'Em Alerta',
  render: () => {
    const alerts = [
      {
        key: 'info',
        icon: 'ℹ',
        title: 'Atualização disponível',
        message: 'Uma nova versão do sistema está disponível.',
        border: 'var(--jf-color-brand-primary-400)',
        bg: 'var(--jf-color-brand-primary-50, #eff6ff)',
        iconColor: 'var(--jf-color-brand-primary-500)',
      },
      {
        key: 'warning',
        icon: '⚠',
        title: 'Atenção',
        message: 'Seu plano expira em 3 dias. Renove para evitar interrupções.',
        border: 'var(--jf-color-warning-400)',
        bg: 'var(--jf-color-warning-50, #fffbeb)',
        iconColor: 'var(--jf-color-warning-500)',
      },
      {
        key: 'error',
        icon: '✕',
        title: 'Erro ao salvar',
        message: 'Não foi possível salvar as alterações. Tente novamente.',
        border: 'var(--jf-color-critical-400)',
        bg: 'var(--jf-color-critical-50, #fef2f2)',
        iconColor: 'var(--jf-color-critical-500)',
      },
    ]

    const [dismissed, setDismissed] = useState<string[]>([])
    const visible = alerts.filter((a) => !dismissed.includes(a.key))

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 420 }}>
        {dismissed.length === alerts.length && (
          <button
            type="button"
            onClick={() => setDismissed([])}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--jf-corner-radius-default)',
              border: '1px solid var(--jf-color-bd-muted)',
              background: 'var(--jf-color-bg-surface-default)',
              color: 'var(--jf-color-fg-strong)',
              cursor: 'pointer',
              fontSize: 'var(--jf-font-size-sm)',
            }}
          >
            Restaurar alertas
          </button>
        )}

        {visible.map((alert) => (
          <div
            key={alert.key}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '12px 12px 12px 16px',
              background: alert.bg,
              borderRadius: 'var(--jf-corner-radius-default)',
              border: `1px solid ${alert.border}`,
            }}
          >
            <span style={{ fontSize: 18, color: alert.iconColor, lineHeight: '36px', flexShrink: 0 }}>
              {alert.icon}
            </span>
            <div style={{ flex: 1, paddingTop: 6 }}>
              <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 'var(--jf-font-size-sm)', color: 'var(--jf-color-fg-strong)' }}>
                {alert.title}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--jf-font-size-sm)', color: 'var(--jf-color-fg-moderated)' }}>
                {alert.message}
              </p>
            </div>
            <CloseButton
              aria-label={`Fechar alerta: ${alert.title}`}
              onClick={() => setDismissed((prev) => [...prev, alert.key])}
            />
          </div>
        ))}
      </div>
    )
  },
}

// ─── Em Toast ──────────────────────────────────────────────────────────────────

export const InToast: Story = {
  name: 'Em Toast',
  render: () => {
    const [visible, setVisible] = useState(true)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minHeight: 80 }}>
        {!visible && (
          <button
            type="button"
            onClick={() => setVisible(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--jf-corner-radius-default)',
              border: '1px solid var(--jf-color-bd-muted)',
              background: 'var(--jf-color-bg-surface-default)',
              color: 'var(--jf-color-fg-strong)',
              cursor: 'pointer',
              fontSize: 'var(--jf-font-size-sm)',
            }}
          >
            Mostrar toast
          </button>
        )}

        {visible && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 12px 12px 16px',
              background: 'var(--jf-color-bg-inverse, #18181b)',
              borderRadius: 'var(--jf-corner-radius-lg)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              minWidth: 280,
              maxWidth: 360,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: '36px' }}>✓</span>
            <span
              style={{
                flex: 1,
                fontSize: 'var(--jf-font-size-sm)',
                color: 'var(--jf-color-fg-on-inverse, #fafafa)',
              }}
            >
              Alterações salvas com sucesso.
            </span>
            <CloseButton
              aria-label="Fechar notificação"
              onClick={() => setVisible(false)}
              style={{ color: 'var(--jf-color-fg-on-inverse, #fafafa)' }}
            />
          </div>
        )}
      </div>
    )
  },
}

// ─── Em Painel lateral ─────────────────────────────────────────────────────────

export const InDrawer: Story = {
  name: 'Em Painel Lateral',
  render: () => (
    <div
      style={{
        width: 320,
        height: 360,
        background: 'var(--jf-color-bg-surface-default)',
        borderRadius: 'var(--jf-corner-radius-lg)',
        border: '1px solid var(--jf-color-bd-muted)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 12px 12px 20px',
          borderBottom: '1px solid var(--jf-color-bd-muted)',
          background: 'var(--jf-color-bg-surface-secondary)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--jf-font-size-md)',
            fontWeight: 600,
            color: 'var(--jf-color-fg-strong)',
          }}
        >
          Filtros
        </span>
        <CloseButton aria-label="Fechar painel de filtros" />
      </div>

      {/* Body */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {['Categoria', 'Status', 'Data de criação', 'Responsável'].map((label) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 'var(--jf-font-size-xs)', fontWeight: 500, color: 'var(--jf-color-fg-moderated)' }}>
              {label}
            </span>
            <div
              style={{
                height: 36,
                borderRadius: 'var(--jf-corner-radius-default)',
                border: '1px solid var(--jf-color-bd-muted)',
                background: 'var(--jf-color-bg-surface-default)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  ),
}
