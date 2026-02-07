import { cn } from '@/lib/utils/style'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'bg-zinc-800',
        animate && 'animate-pulse',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-zinc-800">
      <td className="px-4 py-4">
        <div className="flex justify-center">
          <Skeleton variant="circular" width={44} height={44} />
        </div>
      </td>
      <td className="px-4 py-4">
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-4">
        <Skeleton className="h-6 w-16 rounded-full" />
      </td>
      <td className="hidden px-4 py-4 lg:table-cell">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="hidden px-4 py-4 lg:table-cell">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="hidden px-4 py-4 lg:table-cell">
        <Skeleton className="h-4 w-40" />
      </td>
    </tr>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <Skeleton className="mb-4 h-8 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="flex h-[360px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="text-center">
        <Skeleton variant="circular" className="mx-auto mb-4" width={200} height={200} />
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  )
}
