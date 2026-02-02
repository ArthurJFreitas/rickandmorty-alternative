'use client'

import { useState, useRef, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr'

const dropdownButtonVariants = cva(
  'group flex items-center justify-between gap-3 rounded-xl border transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 ' +
          'hover:border-emerald-500/50 dark:hover:border-emerald-500/50 ' +
          'hover:shadow-md dark:hover:shadow-zinc-950/50',
        elevated:
          'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 ' +
          'shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50 ' +
          'hover:border-emerald-500/50 dark:hover:border-emerald-500/50 ' +
          'backdrop-blur-sm',
      },
      size: {
        sm: 'h-10 px-3.5',
        md: 'h-12 px-4',
      },
      isOpen: {
        true: 'ring-2 ring-emerald-500/20 border-emerald-500',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      isOpen: false,
    },
  }
)

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps extends VariantProps<typeof dropdownButtonVariants> {
  label: string
  options: DropdownOption[]
  value: string
  onValueChange: (value: string) => void
  icon?: React.ReactNode
}

export function CustomDropdown({
  label,
  options,
  value,
  onValueChange,
  icon,
  variant,
  size,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <label className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn('w-full',dropdownButtonVariants({ variant, size, isOpen }))}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="shrink-0 text-zinc-500 transition-colors group-hover:text-emerald-600 dark:text-zinc-400 dark:group-hover:text-emerald-400">
                {icon}
              </div>
            )}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {selectedOption?.label}
            </span>
          </div>
          <CaretDownIcon
            size={18}
            weight="bold"
            className={cn(
              'text-zinc-400 transition-all duration-200 group-hover:text-emerald-600 dark:text-zinc-500 dark:group-hover:text-emerald-400',
              isOpen && 'rotate-180 text-emerald-600 dark:text-emerald-400'
            )}
          />
        </button>

        {isOpen && (
          <div
            className={cn(
              'absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl',
              'dark:border-zinc-700 dark:bg-zinc-900',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
              'duration-200'
            )}
            role="listbox"
          >
            <div className="max-h-64 overflow-y-auto py-1">
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-150',
                      'hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
                      isSelected &&
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
                      !isSelected && 'text-zinc-700 dark:text-zinc-300'
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className={cn('font-medium', isSelected && 'font-semibold')}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <CheckIcon
                        size={18}
                        weight="bold"
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { dropdownButtonVariants }
