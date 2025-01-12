import { SearchBar } from '@/components/ui/search-bar'
import TeacherAssignedTask from '@/features/dashboards/components/Teacher/teacher-assigned-task'
import TeacherAttendance from '@/features/dashboards/components/Teacher/teacher-attendance'
import TeacherClassGraph from '@/features/dashboards/components/Teacher/teacher-class-graph'
import TeacherMetricCards from '@/features/dashboards/components/Teacher/teacher-metric-cards'
import React from 'react'

type Props = object

const TeacherDashboard = (props: Props) => {
    return (
        <div className="min-h-screen ">
            <div className="p-2 md:p-2 space-y-6 max-w-[1600px]  mx-auto">
                {/* Search Bar */}
                <div className="flex justify-between items-center">
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1400px] mx-auto w-full gap-7 xl:gap-36 items-center h-full">
                    {/* Stats Grid */}
                    <TeacherMetricCards />
                    {/* This is where the assigned tasks will be*/}
                    <div className="w-full ">
                        <TeacherAssignedTask />
                    </div>
                </div>

                {/* the class and the attendance */}
                <div className='flex flex-col w-full max-w-[1400px] mx-auto  max-md:space-y-20 my-7 md:justify-between md:items-center md:flex-row md:space-x-4'>
                    <TeacherClassGraph />

                    {/* the teachers attendance  */}

                    <TeacherAttendance />

                </div>
            </div>
        </div >
    )
}

export default TeacherDashboard