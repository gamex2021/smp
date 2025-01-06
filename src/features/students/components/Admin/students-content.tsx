'use client'

import { useState } from 'react'
import { StudentsHeader } from './students-header'
import { StudentsTable } from './students-table'
import { StudentsGrid } from './students-grid'

interface Student {
    id: number
    name: string
    class: string
    group: string
    gender: string
    phone: string
    email: string
    avatar: string
}


interface StudentsContentProps {
    initialStudents: Student[]
}

export function StudentsContent({ initialStudents }: StudentsContentProps) {
    const [view, setView] = useState<'table' | 'grid'>('table')
    const [page, setPage] = useState(1)
    const [studentsPerPage] = useState(view === 'table' ? 6 : 8)

    return (
        <>
            <StudentsHeader view={view} onViewChange={setView} />
            {view === 'table' ? (
                <StudentsTable initialStudents={initialStudents} />
            ) : (
                <StudentsGrid
                    students={initialStudents}
                    currentPage={page}
                    studentsPerPage={studentsPerPage}
                    onPageChange={setPage}
                />
            )}
        </>
    )
}

