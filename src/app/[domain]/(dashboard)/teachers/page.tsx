
import { RoleProtected } from '@/components/providers/role-protected'
import { TableSkeleton } from '@/features/students/components/Admin/table-skeleton'
import { TeachersContent } from '@/features/teachers/components/teachers-content'
import { Suspense } from 'react'


export default function TeachersPage() {

    return (
        // only the admin have access to the teachers route
        <RoleProtected allowedRoles={['ADMIN']}>
            <div className="p-6 max-w-[1600px] mx-auto">
                <Suspense fallback={<TableSkeleton />}>
                    <TeachersContent />
                </Suspense>
            </div>
        </RoleProtected>

    )
}

