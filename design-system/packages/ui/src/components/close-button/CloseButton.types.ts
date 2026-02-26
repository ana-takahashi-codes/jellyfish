import type { ComponentPropsWithoutRef } from 'react'

export interface CloseButtonProps extends ComponentPropsWithoutRef<'button'> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  disabled?: boolean
  'aria-label'?: string
}
