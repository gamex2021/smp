"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { formatCurrency } from "@/lib/utils"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"

export function PaymentAnalytics({ schoolId }: { schoolId: Id<"schools"> }) {
    const [timeframe, setTimeframe] = useState<"year" | "month" | "week">("year")
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

    const analytics = useQuery(api.queries.payment.getPaymentAnalytics, {
        schoolId,
        timeframe,
        year: selectedYear,
    })

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Payment Analytics</CardTitle>
                    <div className="flex items-center gap-4">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="trends" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="trends">Payment Trends</TabsTrigger>
                        <TabsTrigger value="methods">Payment Methods</TabsTrigger>
                        <TabsTrigger value="status">Payment Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trends" className="space-y-6">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics?.trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                                    <Tooltip formatter={(value: number) => [`₦${formatCurrency(value)}`, "Amount"]} />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#2E8B57" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">₦{formatCurrency(analytics?.totalRevenue ?? 0)}</div>
                                    <p className="text-xs text-gray-500">Total Revenue</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">{analytics?.totalTransactions ?? 0}</div>
                                    <p className="text-xs text-gray-500">Total Transactions</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold">₦{formatCurrency(analytics?.averageTransaction ?? 0)}</div>
                                    <p className="text-xs text-gray-500">Average Transaction</p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="methods">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.paymentMethods}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="method" />
                                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                    <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Percentage"]} />
                                    <Bar dataKey="percentage" fill="#2E8B57" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>

                    <TabsContent value="status">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics?.paymentStatus}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                    <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Percentage"]} />
                                    <Bar dataKey="percentage" fill="#2E8B57" className="fill-current text-status-paid" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

