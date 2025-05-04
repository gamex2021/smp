import { Suspense } from "react"
import type { Metadata } from "next"
import GradesPageSkeleton from "@/features/grades/grades-page-skeleton"
import GradesOverview from "@/features/grades/grades-overview"

export const metadata: Metadata = {
  title: "My Grades | Student Portal",
  description: "View your academic performance and grades",
}

export default function GradesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-8">My Grades</h1>
      <Suspense fallback={<GradesPageSkeleton />}>
        <GradesOverview />
      </Suspense>
    </div>
  )
}
