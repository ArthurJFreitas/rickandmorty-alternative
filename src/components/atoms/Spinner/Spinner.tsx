import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'

const spinnerVariants = cva(
  'animate-spin rounded-full border-emerald-600 border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-[3px]',
        lg: 'h-12 w-12 border-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  label?: string
}

export function Spinner({ size, className, label = 'Loading' }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)} role="status">
      <div className={spinnerVariants({ size })} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export { spinnerVariants }
