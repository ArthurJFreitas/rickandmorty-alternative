import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'

const cardVariants = cva(
  'rounded-2xl border bg-zinc-900 transition-shadow',
  {
    variants: {
      variant: {
        default: 'border-zinc-800',
        elevated: 'border-zinc-800 shadow-lg shadow-zinc-950/50',
        ghost: 'border-transparent bg-transparent',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode
}

export function Card({ variant, padding, children, className, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </div>
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

export function CardTitle({ children, as: Tag = 'h3', className, ...props }: CardTitleProps) {
  return (
    <Tag
      className={cn('text-lg font-semibold text-zinc-100', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('mt-1 text-sm text-zinc-400', className)} {...props}>
      {children}
    </p>
  )
}

export { cardVariants }
