import { type HTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import styles from './Card.module.css'

const cardVariants = cva(styles.card, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
      ghost: styles.variantGhost,
    },
    padding: {
      none: styles.paddingNone,
      sm: styles.paddingSm,
      md: styles.paddingMd,
      lg: styles.paddingLg,
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

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
    <div className={cn(styles.header, className)} {...props}>
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
      className={cn(styles.title, className)}
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
    <p className={cn(styles.description, className)} {...props}>
      {children}
    </p>
  )
}

export { cardVariants }
