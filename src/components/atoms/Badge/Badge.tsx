import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import styles from './Badge.module.css'

const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      default: styles.default,
      success: styles.success,
      danger: styles.danger,
      warning: styles.warning,
      info: styles.info,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
})

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode
}

export function Badge({ variant, size, children, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  )
}

export { badgeVariants }
