import { RoleProtected } from '@/components/providers/role-protected'
import AttendanceBottom from '@/features/attendance/components/attendance-bottom'
import AttendanceHeader from '@/features/attendance/components/attendance-header'
import AttendanceTable from '@/features/attendance/components/attendance-table'
import React from 'react'

type Props = object

const AttendancePage = (props: Props) => {
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER']}>
            <div className='max-w-[1600px] mx-auto'>
                <AttendanceHeader />

                {/* Attendance table */}
                <AttendanceTable />
                {/* the bottom */}
                <AttendanceBottom />
            </div>
        </RoleProtected>
    )
}

export default AttendancePage