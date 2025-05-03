/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Skeleton } from '@/components/ui/skeleton';
import { useDomain } from '@/context/DomainContext';
import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from 'react';
import { api } from "~/_generated/api";
import { SubjectCard } from '../../shared/subject-card';
import { SubjectCardSkeleton } from './components/SubjectCardSkeleton';
import { CreateSubjectCard } from "./components/add-subject-card";
import { SearchHeader } from './components/search-header';
import { Button } from '@/components/ui/button';


type Props = object

const SUBJECTS_PER_PAGE = 12;

const AdminSubjects = (props: Props) => {

    const [search, setSearch] = useState("");
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });


    const {
        results: subjects,
        status,
        loadMore,
    } = usePaginatedQuery(api.queries.subject.getSchoolSubjectsWithPagination,
        schoolInfo?.id ?
            { schoolId: schoolInfo.id, search }
            : "skip",
        { initialNumItems: SUBJECTS_PER_PAGE })



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

                {/* Grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: SUBJECTS_PER_PAGE }).map((_, i) => (
                        <SubjectCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }


    return (
        <div className="p-6 space-y-6">

            {/* to search through the subjects */}
            <SearchHeader setSearch={setSearch} />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* the list of subjects for the school */}
                {
                    subjects?.map((subject) => (
                        <SubjectCard key={subject?._id} subject={subject} id={subject._id} name={subject?.name} />
                    ))
                }

                {/* the create subject card */}
                <CreateSubjectCard />
            </div>

            {/* THE PAGINATION to be implemented later */}
            {status === "CanLoadMore" && (
                <div className="mt-8 flex justify-center">
                    <Button role="button" aria-label='Load more teachers' onClick={() => loadMore(SUBJECTS_PER_PAGE)} variant="outline" className="px-8">
                        Load More
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AdminSubjects