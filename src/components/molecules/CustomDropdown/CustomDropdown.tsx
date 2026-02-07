'use client'

import { useState, useRef, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/style'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr'
import styles from './CustomDropdown.module.css'

const dropdownButtonVariants = cva(styles.button, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
    },
    isOpen: {
      true: styles.open,
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    isOpen: false,
  },
})

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
    <div className={styles.wrapper} ref={dropdownRef}>
      <label className={styles.label}>
        {label}
      </label>
      <div className={styles.container}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={dropdownButtonVariants({ variant, size, isOpen })}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className={styles.buttonContent}>
            {icon && (
              <div className={styles.icon}>
                {icon}
              </div>
            )}
            <span className={styles.selectedLabel}>
              {selectedOption?.label}
            </span>
          </div>
          <CaretDownIcon
            size={18}
            weight="bold"
            className={cn(styles.caret, isOpen && styles.caretOpen)}
          />
        </button>

        {isOpen && (
          <div
            className={styles.dropdown}
            role="listbox"
          >
            <div className={styles.options}>
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      styles.option,
                      isSelected && styles.optionSelected
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className={cn(styles.optionLabel, isSelected && styles.optionLabelSelected)}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <CheckIcon
                        size={18}
                        weight="bold"
                        className={styles.check}
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
