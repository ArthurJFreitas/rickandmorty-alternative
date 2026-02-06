'use client'

import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { Button } from '@/components/atoms/Button'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/dist/ssr'

const searchInputVariants = cva(
  'flex items-center gap-2 rounded-xl border bg-white transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 dark:bg-zinc-900 dark:focus-within:ring-emerald-500/20',
  {
    variants: {
      variant: {
        default: 'border-zinc-200 dark:border-zinc-700',
        elevated: 'border-zinc-200 shadow-sm dark:border-zinc-700',
        error: 'border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500',
      },
      inputSize: {
        sm: 'h-9 px-3',
        md: 'h-11 px-4',
        lg: 'h-13 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
)

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
      <div className="w-full">
        <div className={cn(searchInputVariants({ variant: computedVariant, inputSize }), className)}>
          <MagnifyingGlassIcon
            size={20}
            weight="duotone"
            className="shrink-0 text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          />
          <input
            ref={ref}
            id={inputId}
            type="search"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
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
              className="h-7 w-7 shrink-0 rounded-lg"
            >
              <XIcon size={16} weight="bold" aria-hidden="true" />
            </Button>
          ) : null}
        </div>
        {error ? (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-500"
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
