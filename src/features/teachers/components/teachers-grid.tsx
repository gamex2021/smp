/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { type Teacher } from '../types'
import { TeacherCard } from './teachers-card'

interface TeachersGridProps {
    teachers: Teacher[]
    currentPage: number
    onPageChange: (page: number) => void
}

export function TeachersGrid({
    teachers,
    currentPage,
    onPageChange
}: TeachersGridProps) {
    const teachersPerPage = 8
    const indexOfLastTeacher = currentPage * teachersPerPage
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
    const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentTeachers.map((teacher) => (
                    <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
            </div>
            {/* <div className="flex justify-center">
                <TeachersPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(teachers.length / teachersPerPage)}
                    onPageChange={onPageChange}
                />
            </div> */}
        </div>
    )
}

