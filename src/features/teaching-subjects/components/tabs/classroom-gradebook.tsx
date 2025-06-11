"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useDomain } from "@/context/DomainContext";
import { useClassroom } from "../../providers/classroom-provider";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";

interface ClassroomGradebookProps {
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

export function ClassroomGradebook({
  classData,
  subjectTeacherId,
}: ClassroomGradebookProps) {
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

  // Mock grade data - replace with actual grade queries
  const getStudentGrades = (studentId: string) => {
    return {
      assignments: [
        { name: "Quiz 1", score: 85, maxScore: 100, weight: 20 },
        { name: "Project 1", score: 92, maxScore: 100, weight: 30 },
        { name: "Homework 1", score: 88, maxScore: 100, weight: 15 },
        { name: "Quiz 2", score: null, maxScore: 100, weight: 20 },
      ],
      currentGrade: "B+",
      percentage: 87.5,
      trend: "up",
    };
  };

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

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gradebook</h2>
          <p className="text-muted-foreground">
            View and manage student grades for {classData.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Quiz 1 (20%)</TableHead>
                  <TableHead>Project 1 (30%)</TableHead>
                  <TableHead>Homework 1 (15%)</TableHead>
                  <TableHead>Quiz 2 (20%)</TableHead>
                  <TableHead>Current Grade</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const grades = getStudentGrades(student._id);

                  return (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                student.studentDetails?.image ??
                                "/placeholder.svg"
                              }
                              alt={student.studentDetails?.name ?? "Student"}
                            />
                            <AvatarFallback>
                              {student.studentDetails?.name?.charAt(0) ?? "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.studentDetails?.name ??
                                "Unknown Student"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.studentDetails?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {grades.assignments.map((assignment, index) => (
                        <TableCell key={index}>
                          {assignment.score !== null ? (
                            <div className="text-center">
                              <div className="font-medium">
                                {assignment.score}/{assignment.maxScore}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(
                                  (assignment.score / assignment.maxScore) *
                                    100,
                                )}
                                %
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              Not graded
                            </div>
                          )}
                        </TableCell>
                      ))}

                      <TableCell>
                        <div className="text-center">
                          <Badge
                            variant={
                              grades.percentage >= 80
                                ? "default"
                                : grades.percentage >= 70
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="mb-1"
                          >
                            {grades.currentGrade}
                          </Badge>
                          <div
                            className={`text-sm font-medium ${getGradeColor(grades.percentage)}`}
                          >
                            {grades.percentage}%
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-center">
                          {getTrendIcon(grades.trend)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            student.studentDetails?._id &&
                            openGradingModal(student.studentDetails?._id)
                          }
                        >
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "No students are enrolled in this class yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">92%</p>
              <p className="text-sm text-muted-foreground">Class Average</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">18</p>
              <p className="text-sm text-muted-foreground">A Grades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">5</p>
              <p className="text-sm text-muted-foreground">B Grades</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-muted-foreground">Below C</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
