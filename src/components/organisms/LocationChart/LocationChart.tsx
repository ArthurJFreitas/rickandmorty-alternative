'use client'

import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils/style'
import { Spinner } from '@/components/atoms/Spinner'
import { MapPinIcon } from '@phosphor-icons/react/dist/ssr'

const chartContainerVariants = cva(
  'rounded-2xl border bg-white dark:bg-zinc-900',
  {
    variants: {
      variant: {
        default: 'border-zinc-200 dark:border-zinc-800',
        elevated: 'border-zinc-200 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:shadow-zinc-950/50',
        ghost: 'border-transparent bg-transparent',
      },
      size: {
        sm: 'h-[600px] lg:h-[280px]',
        md: 'h-[600px] lg:h-[360px]',
        lg: 'h-[600px] lg:h-[420px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface LocationData {
  name: string
  count: number
}

interface LocationChartProps extends VariantProps<typeof chartContainerVariants> {
  data: LocationData[]
  title?: string
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  showAllLocations?: boolean
}

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#6366f1',
]

const RADIAN = Math.PI / 180

interface LabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-sm font-extrabold drop-shadow-2xl"
      style={{
        paintOrder: 'stroke fill',
        stroke: 'rgba(0,0,0,0.3)',
        strokeWidth: '3px',
        strokeLinejoin: 'round'
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function LocationChart({
  data,
  title,
  isLoading = false,
  emptyMessage = 'No location data available',
  variant,
  size,
  className,
  showAllLocations = false,
}: LocationChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className={cn(chartContainerVariants({ variant, size }), 'flex items-center justify-center p-6', className)}>
        <div className="text-center">
          <Spinner size="lg" label="Loading chart" />
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Loading character data…
          </p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn(chartContainerVariants({ variant, size }), 'flex flex-col items-center justify-center p-6', className)}>
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <MapPinIcon size={32} weight="duotone" className="text-zinc-400 dark:text-zinc-500" />
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
      </div>
    )
  }

  const allSortedData = [...data]
    .sort((a, b) => b.count - a.count)

  const sortedData = showAllLocations
    ? allSortedData
    : allSortedData.slice(0, 6)

  const total = allSortedData.reduce((acc, item) => acc + item.count, 0)

  const handlePieClick = (_: unknown, index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleLegendClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className={cn(chartContainerVariants({ variant, size }), 'p-6', className)}>
      {title ? (
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      ) : null}
      <div className="flex h-full flex-col lg:flex-row lg:gap-6">
        <div className="flex-1 lg:w-1/2" style={{ minHeight: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="85%"
                innerRadius="50%"
                dataKey="count"
                nameKey="name"
                paddingAngle={1}
                strokeWidth={0}
                onClick={handlePieClick}
                style={{ cursor: 'pointer' }}
              >
                {sortedData.map((entry, index) => {
                  const color = COLORS[index % COLORS.length]
                  const isActive = activeIndex === index
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      opacity={activeIndex === null || isActive ? 1 : 0.4}
                      style={{
                        filter: isActive
                          ? `drop-shadow(0 8px 16px ${color}80) brightness(1.15) saturate(1.2)`
                          : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        transformOrigin: 'center',
                      }}
                    />
                  )
                })}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: '16px',
                  border: '1px solid #e4e4e7',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  padding: '16px 20px',
                  backdropFilter: 'blur(8px)',
                }}
                labelStyle={{
                  color: '#18181b',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginBottom: '6px',
                }}
                itemStyle={{
                  color: '#52525b',
                  padding: 0,
                  fontSize: '13px',
                }}
                formatter={(value, name) => [
                  `${value} character${value === 1 ? '' : 's'}`,
                  String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 flex flex-col gap-2.5 lg:mt-0 lg:w-1/2 max-h-96 overflow-y-auto px-2">
          {sortedData.map((entry, index) => {
            const isActive = activeIndex === index
            return (
              <button
                key={entry.name}
                onClick={() => handleLegendClick(index)}
                className={cn(
                  'group/item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
                  'hover:bg-linear-to-r hover:from-zinc-50 hover:to-transparent',
                  'dark:hover:from-zinc-800/50 dark:hover:to-transparent',
                  'hover:shadow-sm hover:scale-[1.02]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                  'border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700',
                  isActive && 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                )}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      'h-3.5 w-3.5 rounded-full transition-all duration-200',
                      'shadow-sm ring-2 ring-offset-2',
                      'group-hover/item:scale-110 group-hover/item:shadow-md',
                      'ring-white dark:ring-zinc-900',
                      isActive && 'ring-emerald-200 dark:ring-emerald-800 scale-110'
                    )}
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: `0 0 12px ${COLORS[index % COLORS.length]}40`
                    }}
                  />
                </div>
                <span
                  className={cn(
                    'flex-1 text-sm font-medium transition-colors text-left',
                    'text-zinc-700 dark:text-zinc-300 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100',
                    isActive && 'text-emerald-900 dark:text-emerald-100 font-semibold'
                  )}
                >
                  {entry.name}
                </span>
                <span
                  className={cn(
                    'text-sm font-bold transition-colors tabular-nums',
                    'text-zinc-900 dark:text-zinc-100',
                    isActive && 'text-emerald-600 dark:text-emerald-400'
                  )}
                >
                  {entry.count}
                </span>
              </button>
            )
          })}
          <div className="mt-4 w-full border-t-2 border-zinc-200 pt-4 dark:border-zinc-700 lg:mt-4 lg:w-auto lg:pt-4">
            <div className="flex items-center justify-between rounded-xl bg-linear-to-r from-emerald-50 to-transparent px-4 py-3 dark:from-emerald-950/20 dark:to-transparent">
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Total Characters</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">with known locations</span>
              </div>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { chartContainerVariants }
