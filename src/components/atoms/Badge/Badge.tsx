import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-emerald-950 text-emerald-400',
        danger: 'bg-red-950 text-red-400',
        warning: 'bg-amber-950 text-amber-400',
        info: 'bg-blue-950 text-blue-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
)

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
