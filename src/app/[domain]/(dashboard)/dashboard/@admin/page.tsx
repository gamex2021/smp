'use client'

import { SearchBar } from "@/components/ui/search-bar"

import AdminAddEvent from "@/features/dashboards/components/admin-add-event"
import AdminMetricCards from "@/features/dashboards/components/admin-metric-cards"
import AdminStudentGraphs from "@/features/dashboards/components/admin-student-graphs"
import AdminTeachersTable from "@/features/dashboards/components/admin-teachers-table"
import Chatbot from "@/features/dashboards/components/chat-bot"

export default function AdminDashboard() {
    return (
        <div className="min-h-screen ">
            <div className="p-2 md:p-2 space-y-6 max-w-[1600px] mx-auto">
                {/* Search Bar */}
                <div className="flex justify-between items-center">
                    <SearchBar />
                    <Chatbot />
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
            </div>
        </div >
    )
}

