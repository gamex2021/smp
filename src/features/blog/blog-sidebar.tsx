"use client"

import { useState } from "react"
import { Search, Tag, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BlogSidebar() {
  const [searchQuery, setSearchQuery] = useState("")

  const popularTags = [
    "Science",
    "Technology",
    "Arts",
    "Literature",
    "Sports",
    "Mathematics",
    "History",
    "Geography",
    "Music",
    "Programming",
  ]

  const trendingPosts = [
    {
      id: "1",
      title: "How to Ace Your Final Exams: Study Tips That Actually Work",
      author: {
        name: "Emma Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "2",
      title: "The Future of AI in Education: What Students Need to Know",
      author: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "3",
      title: "5 Essential Skills Every Student Should Learn Before Graduation",
      author: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

  const topContributors = [
    {
      id: "1",
      name: "Alex Morgan",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 24,
    },
    {
      id: "2",
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 18,
    },
    {
      id: "3",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 15,
    },
    {
      id: "4",
      name: "Olivia Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      posts: 12,
    },
  ]

  return (
    <div className="space-y-6 sticky top-4">
      <Card className="border-green-100 dark:border-green-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-green-600" />
            Search Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Search for posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 border-green-200 focus:border-green-500 focus:ring-green-500 dark:border-green-800"
            />
            <Button size="sm" className="absolute right-1 top-1 h-7 bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-100 dark:border-green-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer border-green-200 hover:bg-green-50 hover:text-green-700 dark:border-green-800 dark:hover:bg-green-900/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-100 dark:border-green-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Trending Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback className="bg-green-200 text-green-700">{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium hover:text-green-600 cursor-pointer">{post.title}</p>
                  <p className="text-xs text-gray-500">by {post.author.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-100 dark:border-green-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-green-100">
                    <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                    <AvatarFallback className="bg-green-200 text-green-700">
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium">{contributor.name}</p>
                    <p className="text-xs text-gray-500">{contributor.posts} posts</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
