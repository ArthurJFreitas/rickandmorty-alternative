'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/style'
import styles from './Avatar.module.css'

interface AvatarProps {
  src: string
  alt: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const initial = name.charAt(0).toUpperCase()

  const getColorFromName = (name: string) => {
    const colors = [
      styles.color0,
      styles.color1,
      styles.color2,
      styles.color3,
      styles.color4,
      styles.color5,
      styles.color6,
      styles.color7,
      styles.color8,
      styles.color9,
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (imageError || !src) {
    return (
      <div
        className={cn(
          styles.fallback,
          sizeClasses[size],
          getColorFromName(name),
          className
        )}
        title={alt}
      >
        {initial}
      </div>
    )
  }

  return (
    <div className={cn(styles.wrapper, sizeClasses[size], className)}>
      {imageLoading && (
        <div
          className={cn(
            styles.placeholder,
            sizeClasses[size]
          )}
        >
          <span className={styles.placeholderText}>{initial}</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={size === 'sm' ? 32 : size === 'md' ? 44 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 44 : 64}
        className={cn(
          styles.image,
          sizeClasses[size],
          imageLoading && styles.hidden
        )}
        loading="lazy"
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
        unoptimized={false}
      />
    </div>
  )
}
