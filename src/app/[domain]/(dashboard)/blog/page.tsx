import { Suspense } from "react"
import type { Metadata } from "next"
import CreatePostButton from "@/features/blog/create-post-button"
import BlogPageSkeleton from "@/features/blog/blog-page-skeleton"
import BlogFeed from "@/features/blog/blog-feed"

export const metadata: Metadata = {
  title: "Student Blog | Student Portal",
  description: "Share and explore student blogs",
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-green-600">Student Blog</h1>
        <CreatePostButton />
      </div>

      <Suspense fallback={<BlogPageSkeleton />}>
        <BlogFeed />
      </Suspense>
    </div>
  )
}
