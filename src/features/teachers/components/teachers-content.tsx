/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { useState } from 'react'
import { TeachersHeader } from './teachers-header'
import { TeachersTable } from './teachers-table'
import { TeachersGrid } from './teachers-grid'
import { useDomain } from '@/context/DomainContext'
import { useQuery } from 'convex/react'
import { api } from '~/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'


const TEACHERS_PER_PAGE = 12;

export function TeachersContent() {
    const [view, setView] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(1)
    const [cursor, setCursor] = useState<string>();
    const [search, setSearch] = useState("");
    const { domain } = useDomain()

    const teachersquery = useQuery(api.queries.teacher.getTeachersWithPagination, {
        search: search || undefined,
        cursor: cursor,
        domain,
        numItems: TEACHERS_PER_PAGE,
    });



    // Handle loading state
    if (!teachersquery) {
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
                                {[...Array(5)].map((_, index) => (
                                    <th key={index} className="p-2">
                                        <Skeleton className="h-6 w-full" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {[...Array(5)].map((_, colIndex) => (
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
    const { teachers } = teachersquery;


    console.log("this is the teachers currently", teachers)
    return (
        <>
            <TeachersHeader
                view={view}
                onViewChange={setView}
                onSearch={setSearchQuery}
            />
            {view === 'table' ? (
                <TeachersTable
                    teachers={teachers}
                    currentPage={page}
                    onPageChange={setPage}
                />
            ) : (
                <TeachersGrid
                    teachers={teachers}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </>
    )
}

