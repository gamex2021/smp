import { Suspense } from "react"
import type { Metadata } from "next"
import SubjectsList from "@/features/subjects/components/Student/subject-list";
import SubjectsPageSkeleton from "@/features/subjects/components/Student/subjects-page-skeleton";

export const metadata: Metadata = {
  title: "My Subjects | Student Portal",
  description: "View and access all your enrolled subjects",
}

export default function SubjectsPage() {
    console.log("reached here")
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-8">My Subjects</h1>
      <Suspense fallback={<SubjectsPageSkeleton />}>
        <SubjectsList />
      </Suspense>
    </div>
  )
}
