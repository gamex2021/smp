"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useClassroom } from "../../providers/classroom-provider";
import { type Id } from "~/_generated/dataModel";

interface ClassroomAssignmentsProps {
  subjectTeacherId: Id<"subjectTeachers">;
}

export function ClassroomAssignments({
  subjectTeacherId,
}: ClassroomAssignmentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { openAssignmentModal } = useClassroom();

  // Mock data - replace with actual assignment queries
  const assignments = [
    {
      id: "1",
      title: "Algebra Quiz 1",
      description: "Basic algebraic operations and equations",
      dueDate: "2024-01-20",
      totalStudents: 25,
      submitted: 18,
      graded: 15,
      status: "active",
      type: "quiz",
    },
    {
      id: "2",
      title: "Chapter 5 Project",
      description: "Create a presentation on quadratic equations",
      dueDate: "2024-01-25",
      totalStudents: 25,
      submitted: 8,
      graded: 0,
      status: "active",
      type: "project",
    },
    {
      id: "3",
      title: "Practice Problems Set 1",
      description: "Complete problems 1-20 from the textbook",
      dueDate: "2024-01-15",
      totalStudents: 25,
      submitted: 25,
      graded: 25,
      status: "completed",
      type: "homework",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quiz":
        return "bg-purple-100 text-purple-700";
      case "project":
        return "bg-orange-100 text-orange-700";
      case "homework":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-muted-foreground">
            Create and manage assignments for your students
          </p>
        </div>
        <Button onClick={openAssignmentModal}>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredAssignments.map((assignment) => {
          const submissionRate =
            (assignment.submitted / assignment.totalStudents) * 100;
          const gradingRate = (assignment.graded / assignment.submitted) * 100;
          const overdue =
            isOverdue(assignment.dueDate) && assignment.status === "active";

          return (
            <Card
              key={assignment.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      {overdue && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(assignment.type)}>
                        {assignment.type}
                      </Badge>
                      <Badge
                        className={getStatusColor(
                          overdue ? "overdue" : assignment.status,
                        )}
                      >
                        {overdue ? "overdue" : assignment.status}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Assignment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {assignment.description}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{assignment.totalStudents} students</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Submissions</span>
                      <span>
                        {assignment.submitted}/{assignment.totalStudents}
                      </span>
                    </div>
                    <Progress value={submissionRate} className="h-2" />
                  </div>

                  {assignment.submitted > 0 && (
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Graded</span>
                        <span>
                          {assignment.graded}/{assignment.submitted}
                        </span>
                      </div>
                      <Progress value={gradingRate} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    View Submissions
                  </Button>
                  {assignment.submitted > assignment.graded && (
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Grade ({assignment.submitted - assignment.graded})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No assignments found</h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Create your first assignment to get started."}
            </p>
            <Button onClick={openAssignmentModal}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
