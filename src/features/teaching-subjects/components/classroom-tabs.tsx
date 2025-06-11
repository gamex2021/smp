"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassroom } from "../providers/classroom-provider";
import { type Id } from "~/_generated/dataModel";
import { ClassroomOverview } from "./tabs/classroom-overview";
import { ClassroomStudents } from "./tabs/classroom-students";
import { ClassroomMessages } from "./tabs/classroom-messages";
import { ClassroomMaterials } from "./tabs/classroom-materials";
import { ClassroomAssignments } from "./tabs/classroom-assignments";
import { ClassroomGradebook } from "./tabs/classroom-gradebook";
import { type ClassroomOverviewProps } from "../types";


export function ClassroomTabs({
  subject,
  classData,
  subjectTeacherId,
}: ClassroomOverviewProps) {
  const { activeTab, setActiveTab } = useClassroom();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <ClassroomOverview
          subject={subject}
          classData={classData}
          subjectTeacherId={subjectTeacherId}
        />
      </TabsContent>

      <TabsContent value="students" className="mt-6">
        <ClassroomStudents
          classData={classData}
          subjectTeacherId={subjectTeacherId}
        />
      </TabsContent>

      <TabsContent value="messages" className="mt-6">
        <ClassroomMessages subjectTeacherId={subjectTeacherId} />
      </TabsContent>

      <TabsContent value="materials" className="mt-6">
        <ClassroomMaterials subjectTeacherId={subjectTeacherId} />
      </TabsContent>

      <TabsContent value="assignments" className="mt-6">
        <ClassroomAssignments subjectTeacherId={subjectTeacherId} />
      </TabsContent>

      <TabsContent value="gradebook" className="mt-6">
        <ClassroomGradebook
          classData={classData}
          subjectTeacherId={subjectTeacherId}
        />
      </TabsContent>
    </Tabs>
  );
}
