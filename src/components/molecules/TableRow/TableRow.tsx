'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import styles from './TableRow.module.css'

const tableRowVariants = cva(styles.row, {
  variants: {
    variant: {
      default: styles.variantDefault,
      subtle: styles.variantSubtle,
      none: '',
    },
    clickable: {
      true: styles.clickable,
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    clickable: false,
  },
})

interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onClick'>,
    VariantProps<typeof tableRowVariants> {
  children: ReactNode
  onClick?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLTableRowElement>) => void
}

export function TableRow({
  children,
  variant,
  clickable,
  onClick,
  onKeyDown,
  className,
  ...props
}: TableRowProps) {
  const isClickable = clickable || !!onClick

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (onKeyDown) {
      onKeyDown(e)
    } else if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <tr
      className={cn(
        tableRowVariants({
          variant,
          clickable: isClickable,
        }),
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      {...props}
    >
      {children}
    </tr>
  )
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  hideOnMobile?: boolean
}

const alignClasses = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
}

export function TableCell({
  children,
  align = 'left',
  hideOnMobile = false,
  className,
  ...props
}: TableCellProps) {
  return (
    <td
      className={cn(
        styles.cell,
        alignClasses[align],
        hideOnMobile && styles.hideOnMobile,
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

export { tableRowVariants }
