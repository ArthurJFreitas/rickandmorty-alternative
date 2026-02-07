'use client'

import { type InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'

const inputVariants = cva(
  'w-full rounded-lg border bg-zinc-800 px-4 py-2 text-zinc-100 placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-700',
  {
    variants: {
      variant: {
        default:
          'border-zinc-600 focus:ring-emerald-500',
        error:
          'border-red-500 focus:ring-red-500',
      },
      inputSize: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, inputSize, error, className, ...props }, ref) => {
    const computedVariant = error ? 'error' : variant

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(inputVariants({ variant: computedVariant, inputSize }), className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error ? (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { inputVariants }
