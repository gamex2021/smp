
import { mockTeachers } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { TableSkeleton } from '@/features/students/components/Admin/table-skeleton'
import { TeachersContent } from '@/features/teachers/components/teachers-content'
import { Suspense } from 'react'


export default function TeachersPage() {

    return (
        // only the admin have access to the teachers route
        <RoleProtected allowedRoles={['admin']}>
            <div className="p-6 max-w-[1600px] mx-auto">
                <Suspense fallback={<TableSkeleton />}>
                    <TeachersContent initialTeachers={mockTeachers} />
                </Suspense>
            </div>
        </RoleProtected>

    )
}

