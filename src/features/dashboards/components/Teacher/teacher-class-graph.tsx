import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DashPieChart from '@/components/ui/charts/DashPieChart';



type Props = object

const TeacherClassGraph = (props: Props) => {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    return (
        <div className='border border-[#11321F99] rounded-[20px] px-[20px] py-[40px] w-full h-full xl:w-[30%]'>
            {/* the header */}
            <div className='flex justify-between items-center'>
                <h1 className='text-md font-semibold text-[#11321F]'>Class A</h1>

                <Select>
                    <SelectTrigger className="max-w-[180px] h-[45px] border-[#11321F99] rounded-[13px]">
                        <SelectValue placeholder="Class A" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">class 1</SelectItem>
                        <SelectItem value="dark">class 2</SelectItem>
                        <SelectItem value="system">class 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* the chart */}
            <DashPieChart data={data} />

            {/* boys and girls data */}
            <div className='flex justify-between items-center'>

                {/* the boys */}
                <div className='flex space-x-2 items-center'>
                    <div className='h-6 w-6 rounded-full bg-[#2E8B57]' />
                    <h1 className='text-[16px] font-medium'>Boys : 234</h1>
                </div>

                {/* the girls */}
                <div className='flex space-x-2 items-center'>
                    <div className='h-6 w-6 rounded-full bg-[#7e8380]' />
                    <h1 className='text-[16px] font-medium'>Girls : 234</h1>
                </div>
            </div>
        </div>
    )
}

export default TeacherClassGraph