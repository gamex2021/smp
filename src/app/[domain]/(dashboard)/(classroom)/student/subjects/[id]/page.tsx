import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { dummySubjects } from "@/features/subjects/dummy-data"
import ClassroomHeader from "@/features/subjects/components/Classroom/classroom-header"
import ClassroomSkeleton from "@/features/subjects/components/Classroom/classroom-skeleton"
import ClassroomTabs from "@/features/subjects/components/Classroom/classroom-tabs"

export const metadata: Metadata = {
  title: "Subject Classroom | Student Portal",
  description: "Access your subject classroom, resources, and assignments",
}

export default function SubjectClassroomPage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch from your API/database
  const subject = dummySubjects.find((s) => s.id === params.id)

  if (!subject) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ClassroomHeader subject={subject} />

      <Suspense fallback={<ClassroomSkeleton />}>
        <ClassroomTabs subjectId={params.id} />
      </Suspense>
    </div>
  )
}
