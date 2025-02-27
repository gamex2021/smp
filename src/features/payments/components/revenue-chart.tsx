/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { usePayments } from "../hooks/use-payment"
import { type Id } from "~/_generated/dataModel"

export function RevenueChart({ schoolId }: { schoolId: Id<"schools"> }) {
    const [timeframe, setTimeframe] = useState("this-year")
    const { metrics } = usePayments(schoolId)

    if (!metrics) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-10 w-[180px]" />
                </div>
                <Skeleton className="h-[300px]" />
            </div>
        )
    }

    const data = metrics?.monthlyData

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Revenue over time</h3>
                <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="this-year">This year</SelectItem>
                        <SelectItem value="last-year">Last year</SelectItem>
                        <SelectItem value="last-6-months">Last 6 months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#B4D5C3" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#B4D5C3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6B7280" }}
                            width={80}
                            tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip formatter={(value) => [`₦${(value as number).toLocaleString()}`, "Revenue"]} />
                        <Area type="monotone" dataKey="value" stroke="#B4D5C3" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

