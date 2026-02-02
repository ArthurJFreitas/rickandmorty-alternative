'use client'

import { type SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'

const filterDropdownVariants = cva(
  'group flex items-center gap-3 rounded-xl border transition-all duration-200 w-full',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 ' +
          'hover:border-emerald-500/50 dark:hover:border-emerald-500/50 ' +
          'focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 ' +
          'hover:shadow-md dark:hover:shadow-zinc-950/50',
        elevated:
          'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 ' +
          'shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 ' +
          'hover:border-emerald-500/50 dark:hover:border-emerald-500/50 ' +
          'focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 ' +
          'backdrop-blur-sm',
      },
      size: {
        sm: 'h-10 px-3.5',
        md: 'h-12 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof filterDropdownVariants> {
  label: string
  options: FilterOption[]
  value: string
  onValueChange: (value: string) => void
  icon?: React.ReactNode
}

export function FilterDropdown({
  label,
  options,
  value,
  onValueChange,
  icon,
  variant,
  size,
  className,
  ...props
}: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-1">
        {label}
      </label>
      <div className={cn(filterDropdownVariants({ variant, size }), 'relative', className)}>
        {icon && (
          <div className="shrink-0 text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(
            'flex-1 appearance-none bg-transparent focus:outline-none cursor-pointer',
            'text-zinc-900 dark:text-zinc-100 font-medium',
            'pr-8 transition-colors',
            '[&>option]:bg-white [&>option]:dark:bg-zinc-900',
            '[&>option]:text-zinc-900 [&>option]:dark:text-zinc-100',
            '[&>option]:py-2 [&>option]:px-3',
            '[&>option:checked]:bg-emerald-50 [&>option:checked]:dark:bg-emerald-950/30',
            '[&>option:hover]:bg-emerald-50 [&>option:hover]:dark:bg-emerald-950/20'
          )}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="py-2 px-3"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 flex items-center">
          <CaretDownIcon
            size={18}
            weight="bold"
            className="text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-focus-within:rotate-180 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  )
}

export { filterDropdownVariants }
