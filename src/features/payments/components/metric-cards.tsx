'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'

interface MetricCardProps {
    title: string
    value: string
    change: {
        value: number
        timeframe: string
    }
}

function MetricCard({ title, value, change }: MetricCardProps) {
    const isPositive = change.value > 0
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
        <div className="rounded-lg bg-[#2E8B57] p-6 text-white">
            <h3 className="text-sm font-medium text-white/90">{title}</h3>
            <p className="mt-2 text-3xl font-bold">₦{value}</p>
            <div className="mt-4 flex items-center gap-1 text-sm">
                <span>{Math.abs(change.value)}% {change.timeframe}</span>
                <Icon className={`h-5 w-5 px-1 text-white border rounded-sm ${!isPositive && "border-[#CB3527] text-[#CB3527]"}`} />
            </div>
        </div>
    )
}

export function MetricCards() {
    const metrics = [
        {
            title: 'Total revenue',
            value: '40,000,000',
            change: { value: 11, timeframe: 'since last month' }
        },
        {
            title: 'Total paid fees',
            value: '20,000,000',
            change: { value: 15, timeframe: 'from this month' }
        },
        {
            title: 'Total overdue fees',
            value: '15,000,000',
            change: { value: -0.05, timeframe: 'since last month' }
        },
        {
            title: 'Total expenses',
            value: '11,000,000',
            change: { value: 15, timeframe: 'from this month' }
        }
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </div>
    )
}

