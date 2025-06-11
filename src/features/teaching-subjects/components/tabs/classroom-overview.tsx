"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useDomain } from "@/context/DomainContext";
import { useClassroom } from "../../providers/classroom-provider";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { type ClassroomOverviewProps } from "../../types";

export function ClassroomOverview({
  subject,
  classData,
  subjectTeacherId,
}: ClassroomOverviewProps) {
  const { domain } = useDomain();
  const { setActiveTab, openAssignmentModal, openMaterialModal } =
    useClassroom();

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
  const studentsCount = studentsData?.length || 0;

  // Mock data for demonstration - replace with actual queries
  const recentActivities = [
    {
      type: "assignment",
      title: "Math Quiz 1 submitted",
      time: "2 hours ago",
      student: "John Doe",
    },
    {
      type: "message",
      title: "New message from Sarah",
      time: "4 hours ago",
      student: "Sarah Smith",
    },
    {
      type: "material",
      title: "Chapter 5 notes uploaded",
      time: "1 day ago",
      student: "You",
    },
  ];

  const upcomingDeadlines = [
    { title: "Math Quiz 2", dueDate: "Tomorrow", type: "assignment" },
    { title: "Project Submission", dueDate: "Next Week", type: "project" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Quick Stats */}
      <div className="space-y-6 lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentsCount}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-sm text-muted-foreground">Avg Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                >
                  <div className="rounded-lg bg-background p-2">
                    {activity.type === "assignment" && (
                      <ClipboardList className="h-4 w-4" />
                    )}
                    {activity.type === "message" && (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    {activity.type === "material" && (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.student} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={openAssignmentModal}
              className="w-full justify-start"
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
            <Button
              onClick={openMaterialModal}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Share Material
            </Button>
            <Button
              onClick={() => setActiveTab("messages")}
              variant="outline"
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button
              onClick={() => setActiveTab("gradebook")}
              variant="outline"
              className="w-full justify-start"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              View Gradebook
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div>
                    <p className="font-medium">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {deadline.dueDate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      deadline.type === "assignment" ? "default" : "secondary"
                    }
                  >
                    {deadline.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Class Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Class Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monday</span>
                <span className="text-sm text-muted-foreground">
                  9:00 - 10:00 AM
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wednesday</span>
                <span className="text-sm text-muted-foreground">
                  2:00 - 3:00 PM
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Friday</span>
                <span className="text-sm text-muted-foreground">
                  11:00 - 12:00 PM
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
