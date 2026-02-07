import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import styles from './Spinner.module.css'

const spinnerVariants = cva(styles.circle, {
  variants: {
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function Spinner({ size, className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn(styles.spinner, className)} role="status">
      <div className={spinnerVariants({ size })} aria-hidden="true" data-size={size ?? 'md'} />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { spinnerVariants }
