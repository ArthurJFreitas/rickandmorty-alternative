'use client'

import { type SelectHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr'
import styles from './FilterDropdown.module.css'

const filterDropdownVariants = cva(styles.container, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

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
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
      </label>
      <div className={cn(filterDropdownVariants({ variant, size }), className)}>
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={styles.select}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.caret}>
          <CaretDownIcon
            size={18}
            weight="bold"
          />
        </div>
      </div>
    </div>
  )
}

export { filterDropdownVariants }
