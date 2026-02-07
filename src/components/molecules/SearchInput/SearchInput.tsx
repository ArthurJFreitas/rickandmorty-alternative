'use client'

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Button } from '@/components/atoms/Button'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import styles from './SearchInput.module.css'

const searchInputVariants = cva(styles.container, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
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

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof searchInputVariants> {
  value: string
  onValueChange: (value: string) => void
  onClear?: () => void
  error?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      variant,
      inputSize,
      value,
      onValueChange,
      onClear,
      error,
      className,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const id = useId()
    const inputId = props.id ?? id
    const computedVariant = error ? 'error' : variant

    const handleClear = () => {
      onValueChange('')
      onClear?.()
    }

    return (
      <div className={styles.wrapper}>
        <div className={cn(searchInputVariants({ variant: computedVariant, inputSize }), className)}>
          <MagnifyingGlassIcon
            size={20}
            weight="duotone"
            className={styles.icon}
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={inputId}
            type="search"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            className={styles.input}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {value.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              aria-label="Clear search"
              className={styles.clearButton}
            >
              <XIcon size={16} weight="bold" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
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

SearchInput.displayName = 'SearchInput'

export { searchInputVariants }
