'use client'

import { type InputHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import styles from './Input.module.css'

const inputVariants = cva(styles.input, {
  variants: {
    variant: {
      default: styles.variantDefault,
      error: styles.variantError,
    },
    inputSize: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    variant: 'default',
    inputSize: 'md',
  },
})

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, inputSize, error, className, ...props }, ref) => {
    const computedVariant = error ? 'error' : variant

    return (
      <div className={styles.wrapper}>
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
            className={styles.errorText}
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
