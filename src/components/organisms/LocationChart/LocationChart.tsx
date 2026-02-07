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
import styles from './LocationChart.module.css'

const chartContainerVariants = cva(styles.container, {
  variants: {
    variant: {
      default: styles.variantDefault,
      elevated: styles.variantElevated,
      ghost: styles.variantGhost,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

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
      className={styles.labelText}
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
      <div className={cn(chartContainerVariants({ variant, size }), styles.loadingState, className)}>
        <div className={styles.loadingContent}>
          <Spinner size="lg" label="Loading chart" />
          <p className={styles.loadingText}>
            Loading character data…
          </p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn(chartContainerVariants({ variant, size }), styles.emptyState, className)}>
        <div className={styles.emptyIcon}>
          <MapPinIcon size={32} weight="duotone" className={styles.iconMuted} />
        </div>
        <p className={styles.emptyText}>{emptyMessage}</p>
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
    <div className={cn(chartContainerVariants({ variant, size }), styles.padding, className)}>
      {title ? (
        <h3 className={styles.title}>
          {title}
        </h3>
      ) : null}
      <div className={styles.content}>
        <div className={styles.chartArea}>
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
                  backgroundColor: 'rgba(24, 24, 27, 0.98)',
                  borderRadius: '16px',
                  border: '1px solid #3f3f46',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                  padding: '16px 20px',
                  backdropFilter: 'blur(8px)',
                }}
                labelStyle={{
                  color: '#fafafa',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginBottom: '6px',
                }}
                itemStyle={{
                  color: '#a1a1aa',
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
        <div className={styles.legend}>
          {sortedData.map((entry, index) => {
            const isActive = activeIndex === index
            return (
              <button
                key={entry.name}
                onClick={() => handleLegendClick(index)}
                className={cn(
                  styles.legendButton,
                  isActive && styles.legendButtonActive
                )}
              >
                <div className={styles.legendDotWrap}>
                  <div
                    className={cn(
                      styles.legendDot,
                      isActive && styles.legendDotActive
                    )}
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: `0 0 12px ${COLORS[index % COLORS.length]}40`,
                    }}
                  />
                </div>
                <span
                  className={cn(
                    styles.legendName,
                    isActive && styles.legendNameActive
                  )}
                >
                  {entry.name}
                </span>
                <span
                  className={cn(
                    styles.legendCount,
                    isActive && styles.legendCountActive
                  )}
                >
                  {entry.count}
                </span>
              </button>
            )
          })}
          <div className={styles.totalBlock}>
            <div className={styles.totalRow}>
              <div className={styles.totalLabel}>
                <span className={styles.totalTitle}>Total Characters</span>
                <span className={styles.totalSubtitle}>with known locations</span>
              </div>
              <span className={styles.totalValue}>{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { chartContainerVariants }
