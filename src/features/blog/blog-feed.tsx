
import { dummyBlogPosts } from "../subjects/dummy-data"
import BlogPostCard from "./blog-post-card"
import BlogSidebar from "./blog-sidebar"

export default async function BlogFeed() {
  // In a real app, this would fetch from your API/database
  const posts = dummyBlogPosts

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="space-y-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <BlogSidebar />
      </div>
    </div>
  )
}
