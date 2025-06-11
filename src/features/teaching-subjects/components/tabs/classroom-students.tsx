"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  GraduationCap,
  MessageSquare,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useDomain } from "@/context/DomainContext";
import { useClassroom } from "../../providers/classroom-provider";
import { useState } from "react";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";

interface ClassroomStudentsProps {
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
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomStudents({
  classData,
  subjectTeacherId,
}: ClassroomStudentsProps) {
  const { domain } = useDomain();
  const { openGradingModal } = useClassroom();
  const [searchTerm, setSearchTerm] = useState("");

  // Get students data
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

  // Filter students based on search term
  const filteredStudents =
    studentsData?.filter(
      (student) =>
        student.studentDetails?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
        student.studentDetails?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    ) || [];

  // Mock grade data - replace with actual grade queries
  const getStudentGrade = (studentId: string) => {
    const grades = ["A", "B+", "B", "C+", "C"];
    return grades[Math.floor(Math.random() * grades.length)];
  };

  const getGradeTrend = (studentId: string) => {
    const trends = ["up", "down", "stable"];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground">
            Manage students in {classData.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => {
          const grade = getStudentGrade(student._id);
          const trend = getGradeTrend(student._id);

          return (
            <Card
              key={student._id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          student.studentDetails?.image ?? "/placeholder.svg"
                        }
                        alt={student.studentDetails?.name ?? "Student"}
                      />
                      <AvatarFallback>
                        {student.studentDetails?.name?.charAt(0) ?? "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {student.studentDetails?.name ?? "Unknown Student"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.studentDetails?.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          student.studentDetails?._id &&
                          openGradingModal(student.studentDetails._id)
                        }
                      >
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Grade Student
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current Grade
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          (grade?.startsWith("A") ?? false)
                            ? "default"
                            : (grade?.startsWith("B") ?? false)
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {grade}
                      </Badge>
                      {trend === "up" && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                      {trend === "down" && (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      {trend === "stable" && (
                        <Minus className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Attendance
                    </span>
                    <span className="text-sm font-medium">95%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Assignments
                    </span>
                    <span className="text-sm font-medium">8/10</span>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() =>
                        student.studentDetails?._id &&
                        openGradingModal(student.studentDetails._id)
                      }
                      size="sm"
                      className="w-full"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Grade Student
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No students found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : "No students are enrolled in this class yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
