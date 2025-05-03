'use client'


import { Student } from '../../types'
import { StudentCard } from './student-card'
import { StudentsPagination } from './students-pagination'



interface StudentsGridProps {
    students: Student[]
    currentPage: number
    studentsPerPage: number
    onPageChange: (page: number) => void
}

export function StudentsGrid({
    students,
    currentPage,
    studentsPerPage,
    onPageChange
}: StudentsGridProps) {
    const indexOfLastStudent = currentPage * studentsPerPage
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentStudents.map((student) => (
                    <StudentCard key={student._id} student={student} />
                ))}
            </div>
            {/* <div className="flex justify-center">
                <StudentsPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(students.length / studentsPerPage)}
                    onPageChange={onPageChange}
                />
            </div> */}
        </div>
    )
}

