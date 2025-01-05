import { mockStudents } from '@/app/config/siteConfig'
import { StudentsContent } from '@/features/students/components/Admin/students-content'
import { TableSkeleton } from '@/features/students/components/Admin/table-skeleton'
import { Suspense } from 'react'


export default async function StudentsPage() {


    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <Suspense fallback={<TableSkeleton />}>
                <StudentsContent initialStudents={mockStudents} />
            </Suspense>
        </div>
    )
}

