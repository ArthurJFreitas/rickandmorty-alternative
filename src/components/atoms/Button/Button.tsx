'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Spinner } from '@/components/atoms/Spinner'
import styles from './Button.module.css'

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
      icon: styles.sizeIcon,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode
  isLoading?: boolean
}

export function Button({
  variant,
  size,
  children,
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export { buttonVariants }
