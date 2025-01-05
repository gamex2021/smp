import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { classAttend } from '../../lib/data'
import DashLineChart from '@/components/ui/charts/DashLineChart'



type Props = object

const AdminEarnings = (props: Props) => {


    return (
        <div className='border rounded-md px-2 py-2 w-full md:w-[50%] md:h-[300px]'>
            {/* the header */}
            <div className='flex mb-5 justify-between items-center px-[10px]'>
                <h1 className='text-md font-bold text-[#11321F99]'>Earnings</h1>

                <Select>
                    <SelectTrigger className="max-w-[180px] text-[#11321F99] border-slate-500">
                        <SelectValue placeholder="April 2023" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Last week</SelectItem>
                        <SelectItem value="dark">Last month</SelectItem>
                        <SelectItem value="system">Last 2 months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* the chart */}
            <DashLineChart data={classAttend} />

        </div>
    )
}

export default AdminEarnings