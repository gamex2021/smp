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
import { usePaginatedQuery, useQuery } from 'convex/react'
import { api } from '~/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'



export function TeachersContent() {
    const [view, setView] = useState<'table' | 'grid'>('table')
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("");
    const { domain } = useDomain()


    const {
        results: teachers,
        status,
        loadMore,
    } = usePaginatedQuery(api.queries.teacher.getTeachersWithPagination, domain ? { domain, search } : "skip", { initialNumItems: 12 })


    // Handle loading state
    if (status === "LoadingMore") {
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



    // console.log("this is the teachers currently", teachers)
    return (
        <>
            <TeachersHeader
                view={view}
                onViewChange={setView}
                onSearch={setSearch}
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
            {status === "CanLoadMore" && (
                <div className="mt-8 flex justify-center">
                    <Button role="button" aria-label='Load more teachers' onClick={() => loadMore(12)} variant="outline" className="px-8">
                        Load More
                    </Button>
                </div>
            )}
        </>
    )
}

