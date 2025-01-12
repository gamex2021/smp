
import { mockTeacherClasses } from '@/app/config/siteConfig'
import { TeacherClassesList } from '@/features/students/components/Teacher/teacher-classes-list'
import { SearchHeader } from '@/features/students/shared/search-header'
import { Suspense } from 'react'


export default async function StudentsPage() {


    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <Suspense>
                <SearchHeader type="class" />
                <Suspense fallback={<div>Loading...</div>}>
                    <TeacherClassesList initialClasses={mockTeacherClasses} />
                </Suspense>
            </Suspense>
        </div>
    )
}

