'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'

const tableRowVariants = cva(
  'group transition-colors',
  {
    variants: {
      variant: {
        default: 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        subtle: 'hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30',
        none: '',
      },
      clickable: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      clickable: false,
    },
  }
)

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
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
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
        'px-4 py-4',
        alignClasses[align],
        hideOnMobile && 'hidden lg:table-cell',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}

export { tableRowVariants }
