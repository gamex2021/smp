import { Suspense } from "react"
import { RoleProtected } from "@/components/providers/role-protected"

import { SchoolHeader } from "@/features/school/components/school-header"
import { SchoolTabs } from "@/features/school/components/school-tabs"

export default async function SchoolPage() {


    return (
        <RoleProtected allowedRoles={["ADMIN"]}>
            <div className="min-h-screen bg-gray-50/30">
                <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                    <SchoolHeader />

                    <Suspense fallback={<div>Loading school settings...</div>}>
                        <SchoolTabs />
                    </Suspense>
                </div>
            </div>
        </RoleProtected>
    )
}
