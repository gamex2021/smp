import { mockTransactions } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { Button } from '@/components/ui/button'
import { MetricCards } from '@/features/payments/components/metric-cards'
import { RevenueChart } from '@/features/payments/components/revenue-chart'
import { TransactionTable } from '@/features/payments/components/transaction-table'
import { Plus } from 'lucide-react'
import React, { Suspense } from 'react'

type Props = object

const page = (props: Props) => {
    return (
        // only the admin can access the payment page
        <RoleProtected allowedRoles={['ADMIN']}>
            <div className="p-6 max-w-[1600px] mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Payment</h1>
                    <Button className="bg-[#B4D5C3] hover:bg-[#B4D5C3]/90 text-[#11321FCC]">
                        Add new payment
                        <div className='bg-white mr-2 px-1 py-1 rounded-sm'>
                            <Plus className=" h-2 w-2 text-[#1F5F3B]" />
                        </div>

                    </Button>
                </div>

                <Suspense fallback={<div>Loading metrics...</div>}>
                    <MetricCards />
                </Suspense>

                <div className="grid gap-8">
                    <div className="rounded-lg border bg-white p-6">
                        <Suspense fallback={<div>Loading chart...</div>}>
                            <RevenueChart />
                        </Suspense>
                    </div>

                    <div className="rounded-lg border bg-white">
                        <Suspense fallback={<div>Loading transactions...</div>}>
                            <TransactionTable initialData={mockTransactions} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </RoleProtected>
    )
}

export default page