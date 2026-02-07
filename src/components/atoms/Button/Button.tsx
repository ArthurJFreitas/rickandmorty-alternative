'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Spinner } from '@/components/atoms/Spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 disabled:bg-emerald-800',
        secondary:
          'bg-zinc-700 text-zinc-100 hover:bg-zinc-600 active:bg-zinc-500 focus:ring-zinc-500',
        ghost:
          'bg-transparent text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 focus:ring-zinc-500',
        danger:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 disabled:bg-red-800',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

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
