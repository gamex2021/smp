/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, FileText, BookOpen, Calendar, CheckSquare } from "lucide-react"
import AnnouncementsList from "./announcements-list"
import AssignmentsList from "./assignments-list"
import { dummyAnnouncements, dummyAssignments, dummyResources, dummySchedule } from "../../dummy-data"
import ResourcesList from "./resources-list"
import ScheduleView from "./schedule-view"

interface ClassroomTabsProps {
  subjectId: string
}

export default function ClassroomTabs({ subjectId }: ClassroomTabsProps) {
  const [activeTab, setActiveTab] = useState("announcements")

  // In a real app, these would be fetched based on the subjectId
  const announcements = dummyAnnouncements
  const assignments = dummyAssignments
  const resources = dummyResources
  const schedule = dummySchedule

  return (
    <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8 bg-green-50 dark:bg-green-900/20">
        <TabsTrigger value="announcements" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
          <MessageSquare className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Announcements</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
          <CheckSquare className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
          <FileText className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Resources</span>
        </TabsTrigger>
        <TabsTrigger value="materials" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
          <BookOpen className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Materials</span>
        </TabsTrigger>
        <TabsTrigger value="schedule" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
          <Calendar className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Schedule</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="announcements" className="mt-0">
        <AnnouncementsList announcements={announcements} />
      </TabsContent>

      <TabsContent value="assignments" className="mt-0">
        {/* @ts-expect-error */}
        <AssignmentsList assignments={assignments} />
      </TabsContent>

      <TabsContent value="resources" className="mt-0">
           {/* @ts-expect-error */}
        <ResourcesList resources={resources} />
      </TabsContent>

      <TabsContent value="materials" className="mt-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Course Materials</h2>
          <p className="text-gray-600 dark:text-gray-400">Course materials will be displayed here.</p>
        </div>
      </TabsContent>

      <TabsContent value="schedule" className="mt-0">
           {/* @ts-expect-error */}
        <ScheduleView schedule={schedule} />
      </TabsContent>
    </Tabs>
  )
}
