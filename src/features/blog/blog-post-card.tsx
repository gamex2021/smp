"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: {
    id: string
    name: string
    avatar: string
    role: string
  }
  date: string
  readTime: string
  likes: number
  comments: number
  tags: string[]
}

interface BlogPostCardProps {
  post: BlogPost
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-green-100 dark:border-green-900/50">
        <CardHeader className="p-0">
          <div className="relative h-48 md:h-64 w-full">
            <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex gap-2 mb-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} className="bg-green-500/80 hover:bg-green-600 backdrop-blur-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{post.title}</h2>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback className="bg-green-200 text-green-700">{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.date), { addSuffix: true })} • {post.readTime} read
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>

          <Link href={`/student/blog/${post.id}`} className="inline-block">
            <Button
              variant="link"
              className="px-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Read more
            </Button>
          </Link>
        </CardContent>

        <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`gap-1 ${liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="gap-1 text-gray-500 hover:text-gray-700">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${bookmarked ? "text-green-500 hover:text-green-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
