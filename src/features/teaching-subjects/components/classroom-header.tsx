"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Users,
  Calendar,
  ChevronLeft,
  FileText,
  ClipboardList,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useClassroom } from "../providers/classroom-provider";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useDomain } from "@/context/DomainContext";
import { type Doc, type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import StudentData from "../../dashboards/components/Admin/admin-student-graphs";

interface ClassroomHeaderProps {
  subject: {
    _id: Id<"subjects">;
    _creationTime: number;
    searchableText?: string | undefined;
    name: string;
    schoolId: Id<"schools">;
    category: string;
    description: string;
    isActive: boolean;
    originalName: string;
    isCore: boolean;
  };
  classData: {
    _id: Id<"classes">;
    _creationTime: number;
    searchableText?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    capacity?: number | undefined;
    title: string;
    schoolId: Id<"schools">;
  };
  teacher: Doc<"users">;
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomHeader({
  subject,
  classData,
  teacher,
  subjectTeacherId,
}: ClassroomHeaderProps) {
  const router = useRouter();
  const { domain } = useDomain();
  const { openAssignmentModal, openMaterialModal } = useClassroom();

  // Get students count
  const {
    results: studentsData,
    status: studentsStatus,
    loadMore: loadMoreStudents,
  } = usePaginatedQuery(
    api.queries.class.getClassesStudents,
    domain && classData?._id ? { domain, classId: classData?._id } : "skip",
    {
      initialNumItems: 10,
    },
  );

  const studentsCount = studentsData?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">
              {classData.title} • {studentsCount} students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={openMaterialModal} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Share Material
          </Button>
          <Button onClick={openAssignmentModal}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-semibold">{subject.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="font-semibold">{studentsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{classData.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={teacher?.image ?? "/placeholder.svg"} />
                <AvatarFallback>
                  {teacher?.name?.charAt(0) ?? "T"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Teacher</p>
                <p className="font-semibold">{teacher?.name ?? "You"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
