import React from 'react'
import { HiOutlineCloudDownload } from "react-icons/hi";
type Props = object

const AttendanceBottom = (props: Props) => {
    return (
        <div className='flex space-x-4 items-center flex-wrap max-md:justify-center'>

            {/* Absent */}
            <div className='flex space-x-2 mx-2 my-2 items-center'>
                <div className='bg-[#ADADAD] w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-[] font-semibold'>
                    A
                </div>
                <h1 className='text-base'>Absent</h1>
            </div>

            {/* Present */}
            <div className='flex space-x-2 mx-2 my-2 items-center'>
                <div className='bg-emerald-600 w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
                    P
                </div>
                <h1 className='text-base'>Present</h1>
            </div>

            {/* Leave */}
            <div className='flex space-x-2 mx-2 my-2 items-center'>
                <div className='bg-[#3A90E6] w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
                    L
                </div>
                <h1 className='text-base'>Leave</h1>
            </div>

            {/* Holidays/weekends */}
            <div className='flex space-x-2 mx-2 my-2 items-center'>
                <div className='bg-amber-500 w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
                    W
                </div>
                <h1 className='text-base'>Holiday/Weekend</h1>
            </div>

            {/* Generate Report */}
            <div className='py-3 px-3 mx-2 my-2 flex space-x-2 items-center rounded-md border border-slate-300 cursor-pointer hover:scale-105'>
                <h1>Generate Report</h1>

                <HiOutlineCloudDownload className='w-5 h-5' />
            </div>

        </div>
    )
}

export default AttendanceBottom