import { SearchBar } from "@/components/ui/search-bar"

import AdminAddEvent from "@/features/dashboards/components/Admin/admin-add-event"
import AdminAttendance from "@/features/dashboards/components/Admin/admin-attendance"
import AdminEarnings from "@/features/dashboards/components/Admin/admin-earnings"
import AdminMetricCards from "@/features/dashboards/components/Admin/admin-metric-cards"
import AdminStudentGraphs from "@/features/dashboards/components/Admin/admin-student-graphs"
import AdminTeachersTable from "@/features/dashboards/components/Admin/admin-teachers-table"

export default function AdminDashboard() {
    return (
        <div className="min-h-screen ">
            <div className="p-2 md:p-2 space-y-6 max-w-[1600px] mx-auto">
                {/* Search Bar */}
                <div className="flex justify-between items-center">
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-7 xl:gap-36 items-center h-full">
                    {/* Stats Grid */}
                    <AdminMetricCards />
                    {/* Calendar Card to add event */}
                    <div className="w-full ">
                        <AdminAddEvent />
                    </div>
                </div>

                {/* student graph and teachers list */}
                <div className='flex flex-col max-xl:items-center  max-xl:space-y-4 my-7 mt-[60px] w-full xl:flex-row xl:space-x-9 xl:h-full'>
                    <AdminStudentGraphs />

                    <div className="w-full ">
                        <AdminTeachersTable />
                    </div>
                </div>


                {/* the attendance and the earnings */}
                <div className='flex flex-col max-md:space-y-20 my-7 md:flex-row md:space-x-4'>
                    <AdminAttendance />
                    {/* the earnings per class */}
                    <AdminEarnings />
                </div>
            </div>
        </div >
    )
}

