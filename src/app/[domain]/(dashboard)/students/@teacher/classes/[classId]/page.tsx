import { Suspense } from 'react'
import { SearchHeader } from '@/features/students/shared/search-header'
import { TeacherStudentsList } from '@/features/students/components/Teacher/teacher-students-list'

export default async function ClassPage({ params }: { params: { classId: string } }) {
    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <SearchHeader type="student" className="mb-6" />
            <h1 className="text-2xl font-semibold mb-6">Class A</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <TeacherStudentsList classId={params.classId} />
            </Suspense>
        </div>
    )
}

