"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { usePayments } from "../hooks/use-payment"
import { type Id } from "~/_generated/dataModel"

export function PaymentMetrics({ schoolId }: { schoolId: Id<"schools"> }) {
    const { metrics } = usePayments(schoolId)

    if (!metrics) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[160px] rounded-lg" />
                ))}
            </div>
        )
    }

    const cards = [
        {
            title: "Total Revenue",
            value: metrics.totalRevenue,
            change: metrics.revenueChange,
            changeLabel: "vs last month",
        },
        {
            title: "This Month",
            value: metrics.thisMonthRevenue,
            change: ((metrics.thisMonthRevenue - metrics.lastMonthRevenue) / metrics.lastMonthRevenue) * 100,
            changeLabel: "vs last month",
        },
        {
            title: "Successful Payments",
            value: metrics.successfulPayments,
            isCount: true,
            change: 0,
            changeLabel: "total count",
        },
        {
            title: "Pending Payments",
            value: metrics.pendingPayments,
            isCount: true,
            change: 0,
            changeLabel: "total count",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        {card.change !== 0 && (
                            <div className={`text-xs ${card.change > 0 ? "text-green-600" : "text-red-600"}`}>
                                {card.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.isCount ? card.value : <>₦{formatCurrency(card.value)}</>}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.change !== 0 && (
                                <span className={card.change > 0 ? "text-green-600" : "text-red-600"}>
                                    {card.change > 0 ? "+" : ""}
                                    {card.change.toFixed(1)}%
                                </span>
                            )}{" "}
                            {card.changeLabel}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

