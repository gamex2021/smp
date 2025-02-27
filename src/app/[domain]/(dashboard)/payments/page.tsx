"use client"
import { Suspense } from "react"
import { RoleProtected } from "@/components/providers/role-protected"
import { PaymentForm } from "@/features/payments/components/payment-form"
import { OutstandingPayments } from "@/features/payments/components/outstanding-payments"
import { PaymentAnalytics } from "@/features/payments/components/payment-analytics"
import { useDomain } from "@/context/DomainContext"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { PaymentMetrics } from "@/features/payments/components/payment-metrics"
import { TransactionTable } from "@/features/payments/components/transaction-table"
import { PaymentSearch } from "@/features/payments/components/payment-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentsPage() {
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const school = useQuery(api.queries.school.findSchool, {
        domain,
    })

    if (!school?.id) {
        return null
    }

    return (
        <RoleProtected allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-gray-50/30">
                <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
                            <p className="text-sm text-gray-500">Manage student payments and fees</p>
                        </div>
                        <PaymentForm schoolId={school.id} />
                    </div>

                    <Suspense fallback={<div>Loading payment metrics...</div>}>
                        <PaymentMetrics schoolId={school.id} />
                    </Suspense>

                    <Tabs defaultValue="analytics" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="analytics">Payment Analytics</TabsTrigger>
                            <TabsTrigger value="transactions">Transaction Table</TabsTrigger>
                            <TabsTrigger value="outstanding">Outstanding Payments</TabsTrigger>
                            <TabsTrigger value="search">Payment Search</TabsTrigger>
                        </TabsList>

                        <TabsContent value="transactions" className="mt-0">
                            <Suspense fallback={<div>Loading Transaction table...</div>}>
                                <TransactionTable schoolId={school.id} />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="outstanding" className="mt-0">
                            <Suspense fallback={<div>Loading outstanding payments...</div>}>
                                <OutstandingPayments schoolId={school.id} />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="search" className="mt-0">
                            <Suspense fallback={<div>Loading payment search...</div>}>
                                <PaymentSearch schoolId={school.id} />
                            </Suspense>
                        </TabsContent>

                        <TabsContent value="analytics" className="mt-0">
                            <Suspense fallback={<div>Loading analytics...</div>}>
                                <PaymentAnalytics schoolId={school.id} />
                            </Suspense>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </RoleProtected>
    )
}

