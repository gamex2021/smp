'use client'

import { useState } from 'react'
import { TeacherStudentCard } from './teacher-student-card'
import { TeacherViewToggle } from './teacher-view-toggle'
import { TeacherStudentsTable } from './teacher-student-table'

interface StudentsListProps {
    classId: string
}

export function TeacherStudentsList({ classId }: StudentsListProps) {
    const [view, setView] = useState<'cards' | 'table'>('cards')

    // Mock data - would come from API
    const students = [
        {
            id: 1,
            name: "Phillip Abraham",
            class: "Jss 1",
            teacher: "Mrs Eze Naomi",
            number: 1,
            avatar: "/images/dummy-user.png"
        },
        {
            id: 2,
            name: "Michael Adelayo",
            class: "Jss 1",
            teacher: "Mrs Eze Naomi",
            number: 2,
            avatar: "/images/dummy-user.png"
        },
        {
            id: 3,
            name: "Uche Eze",
            class: "Jss 1",
            teacher: "Mrs Eze Naomi",
            number: 3,
            avatar: "/images/dummy-user.png"
        },
        // Add more students...
    ]

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <TeacherViewToggle view={view} onViewChange={setView} />
            </div>
            {view === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                        <TeacherStudentCard
                            key={student.id}
                            classId={classId}
                            student={student}
                        />
                    ))}
                </div>
            ) : (
                <TeacherStudentsTable students={students} classId={classId} />
            )}
        </div>
    )
}

