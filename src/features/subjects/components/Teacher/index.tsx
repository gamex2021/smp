"use client";
import { Button } from "@/components/ui/button";
import { useDomain } from "@/context/DomainContext";
import { usePaginatedQuery } from "convex/react";
import { api } from "~/_generated/api";
import { type Id } from "~/_generated/dataModel";
import { SubjectCard } from "../../shared/subject-card";
import { type Subject } from "../../types";

export default function TeacherSubjects() {
  // * GET THE SUBJECTS ASSIGNED TO A TEACHER FROM THEIR USERID BASICALLY
  const { results, status, loadMore } = usePaginatedQuery(
    api.queries.subject.subjectListForCurrentTeacher, // your query function
    {}, // no extra args needed if your query only uses pagination and auth
    { initialNumItems: 12 }, // adjust as needed
  );
  const { user } = useDomain();
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      {results.map((subject) => (
        <SubjectCard
          key={subject.subject?._id}
          name={subject.subject?.name ?? ""}
          subject={subject.subject ?? ({} as Subject)}
          className={subject.class?.title ?? ""}
          teacherName={user?.name ?? ""}
          id={subject?.subject?._id as Id<"subjects">}
          teacher
          subjectTeacher={subject?._id}
        />
      ))}

      {/* IF IT CAN LOAD MORE , THEN  SHOW THIS */}
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
    </div>
  );
}
