/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useDomain } from "@/context/DomainContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { ClassroomProvider } from "./providers/classroom-provider";
import { ClassroomHeader } from "./components/classroom-header";
import { ClassroomTabs } from "./components/classroom-tabs";

export function TeachingSubjectClassroom() {
  const params = useParams();
  const { domain } = useDomain();
  const subjectTeacherId = params.id as Id<"subjectTeachers">;

  // Fetch the subject-teacher-class relationship
  const subjectTeacherData = useQuery(
    api.queries.subject.getSTCById,
    domain && subjectTeacherId
      ? {
          subjectTeacherId,
          domain,
        }
      : "skip",
  );

  if (subjectTeacherData === undefined) {
    return <ClassroomSkeleton />;
  }

  if (subjectTeacherData === null) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Subject classroom not found or you don&apos;t have permission to
            access it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { currentSubject, currentClass, currentTeacher } = subjectTeacherData;

  if (!currentSubject || !currentClass) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid classroom data. Subject or class information is missing.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ClassroomProvider subjectTeacherId={subjectTeacherId}>
      <div className="container space-y-6 py-6">
        {currentTeacher && (
          <ClassroomHeader
            subject={currentSubject}
            classData={currentClass}
            teacher={currentTeacher}
            subjectTeacherId={subjectTeacherId}
          />
        )}
        <ClassroomTabs
          subject={currentSubject}
          classData={currentClass}
          subjectTeacherId={subjectTeacherId}
        />
      </div>
    </ClassroomProvider>
  );
}

function ClassroomSkeleton() {
  return (
    <div className="container space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}
