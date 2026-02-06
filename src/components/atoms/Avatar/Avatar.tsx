'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/style'

interface AvatarProps {
  src: string
  alt: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-base',
  lg: 'h-16 w-16 text-2xl',
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const initial = name.charAt(0).toUpperCase()

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-violet-500',
      'bg-amber-500',
      'bg-red-500',
      'bg-cyan-500',
      'bg-pink-500',
      'bg-lime-500',
      'bg-orange-500',
      'bg-indigo-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (imageError || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold text-white ring-2 ring-zinc-100 dark:ring-zinc-800 transition-all',
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
    <div className={cn('relative', sizeClasses[size], className)}>
      {imageLoading && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse',
            sizeClasses[size]
          )}
        >
          <span className="text-xs text-zinc-400">{initial}</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={size === 'sm' ? 32 : size === 'md' ? 44 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 44 : 64}
        className={cn(
          'rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 transition-all',
          sizeClasses[size],
          imageLoading && 'opacity-0'
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
