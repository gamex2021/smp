/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import { StudentsHeader } from "./students-header";
import { StudentsTable } from "./students-table";
import { StudentsGrid } from "./students-grid";
import { useDomain } from "@/context/DomainContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/_generated/api";
import { Button } from "@/components/ui/button";
import { CustomSkeleton } from "@/components/custom-skeleton";

interface Student {
  id: number;
  name: string;
  class: string;
  group: string;
  gender: string;
  phone: string;
  email: string;
  avatar: string;
}

interface StudentsContentProps {
  initialStudents: Student[];
}

const STUDENTS_PER_PAGE = 12;

export function StudentsContent({ initialStudents }: StudentsContentProps) {
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { domain } = useDomain();

  // get the students from the convex query and paginate
  const {
    results: students,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.student.getStudentsWithPagination,
    domain ? { domain, search } : "skip",
    { initialNumItems: 12 },
  );

  // Handle loading state
  if (status === "LoadingMore") {
    return <CustomSkeleton />;
  }

  return (
    <>
      <StudentsHeader view={view} onViewChange={setView} onSearch={setSearch} />

      {view === "table" ? (
        <StudentsTable students={students} />
      ) : (
        <StudentsGrid
          students={students}
          currentPage={page}
          studentsPerPage={STUDENTS_PER_PAGE}
          onPageChange={setPage}
        />
      )}
      {status === "CanLoadMore" && (
        <div className="mt-8 flex justify-center">
          <Button
            role="button"
            aria-label="Load more teachers"
            onClick={() => loadMore(12)}
            variant="outline"
            className="px-8"
          >
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
