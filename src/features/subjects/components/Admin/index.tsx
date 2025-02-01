/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import { useDomain } from '@/context/DomainContext';
import { useQuery } from "convex/react";
import { useState } from 'react';
import { api } from "~/_generated/api";
import { SubjectCard } from '../../shared/subject-card';
import { SubjectCardSkeleton } from './components/SubjectCardSkeleton';
import { CreateSubjectCard } from "./components/add-subject-card";


type Props = object

const SUBJECTS_PER_PAGE = 12;

const AdminSubjects = (props: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [cursor, setCursor] = useState<string>();
    const [search, setSearch] = useState("");
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });
    const subjectsQuery = useQuery(api.queries.subject.getSchoolSubjectsWithPagination, {
        search: search || undefined,
        cursor: cursor,
        schoolId: schoolInfo?.id,
        numItems: SUBJECTS_PER_PAGE,
    });


    // Handle loading state
    if (!subjectsQuery) {
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

    const { subjects, continueCursor } = subjectsQuery;


    return (
        <div className="p-6 space-y-6">

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* the list of subjects for the school */}
                {
                    subjects?.map((subject) => (
                        <SubjectCard key={subject?._id} name={subject?.name} />
                    ))
                }

                {/* the create subject card */}
                <CreateSubjectCard />
            </div>

            {/* THE PAGINATION to be implemented later */}
            <Pagination className="my-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default AdminSubjects