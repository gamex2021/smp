/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { useState } from 'react'
import { StudentsHeader } from './students-header'
import { StudentsTable } from './students-table'
import { StudentsGrid } from './students-grid'
import { useDomain } from '@/context/DomainContext'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from 'convex/react'
import { api } from '~/_generated/api'

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

const STUDENTS_PER_PAGE = 12;

export function StudentsContent({ initialStudents }: StudentsContentProps) {
    const [view, setView] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [cursor, setCursor] = useState<string>();
    const [search, setSearch] = useState("");
    const { domain } = useDomain()


    const studentsquery = useQuery(api.queries.student.getStudentsWithPagination, {
        search: search || undefined,
        cursor: cursor,
        domain,
        numItems: STUDENTS_PER_PAGE,
    });

    // Handle loading state
    if (!studentsquery) {
        return (
            <div className="p-6 space-y-6">
                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>

                {/* Search skeleton */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Table skeleton */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <th key={index} className="p-2">
                                        <Skeleton className="h-6 w-full" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: 5 }).map((_, colIndex) => (
                                        <td key={colIndex} className="p-2">
                                            <Skeleton className="h-10 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const { students } = studentsquery;
    return (
        <>
            <StudentsHeader view={view} onViewChange={setView} onSearch={setSearchQuery} />

            {view === 'table' ? (
                <StudentsTable students={students} />
            ) : (
                <StudentsGrid
                    students={students}
                    currentPage={page}
                    studentsPerPage={STUDENTS_PER_PAGE}
                    onPageChange={setPage}
                />
            )}
        </>
    )
}

