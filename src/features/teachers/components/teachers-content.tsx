/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { useState } from 'react'
import { TeachersHeader } from './teachers-header'
import { TeachersTable } from './teachers-table'
import { TeachersGrid } from './teachers-grid'


interface TeachersContentProps {
    initialTeachers: any[]
}

export function TeachersContent({ initialTeachers }: TeachersContentProps) {
    const [view, setView] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)

    const filteredTeachers = initialTeachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <TeachersHeader
                view={view}
                onViewChange={setView}
                onSearch={setSearchQuery}
            />
            {view === 'table' ? (
                <TeachersTable
                    teachers={filteredTeachers}
                    currentPage={page}
                    onPageChange={setPage}
                />
            ) : (
                <TeachersGrid
                    teachers={filteredTeachers}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </>
    )
}

