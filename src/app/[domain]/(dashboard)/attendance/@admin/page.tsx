import AttendanceBottom from '@/features/attendance/components/Admin/attendance-bottom'
import AttendanceHeader from '@/features/attendance/components/Admin/attendance-header'
import AttendanceTable from '@/features/attendance/components/Admin/attendance-table'
import React from 'react'

type Props = object

const AttendancePage = (props: Props) => {
    return (
        <div className='max-w-[1600px] mx-auto'>
            <AttendanceHeader />

            {/* Attendance table */}
            <AttendanceTable />
            {/* the bottom */}
            <AttendanceBottom />
        </div>
    )
}

export default AttendancePage