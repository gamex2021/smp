"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Announcement {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  date: string
  comments: {
    id: string
    author: {
      name: string
      avatar: string
    }
    content: string
    date: string
  }[]
}

interface AnnouncementsListProps {
  announcements: Announcement[]
}

export default function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<Record<string, boolean>>({})
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  const toggleAnnouncement = (id: string) => {
    setExpandedAnnouncements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="overflow-hidden border-green-100 dark:border-green-900/50">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={announcement.author.avatar || "/placeholder.svg"} alt={announcement.author.name} />
                <AvatarFallback className="bg-green-200 text-green-700">
                  {announcement.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-green-700 dark:text-green-400">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">
                      {announcement.author.name} • {announcement.author.role} •
                      {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAnnouncement(announcement.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                  >
                    {expandedAnnouncements[announcement.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {(expandedAnnouncements[announcement.id] ?? !announcement.content.includes("\n")) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-4">
                  <div className="prose prose-green dark:prose-invert max-w-none">
                    {announcement.content.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          <CardFooter className="flex flex-col items-stretch pt-0 pb-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(announcement.id)}
                className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {announcement.comments.length} Comments
                {expandedComments[announcement.id] ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>

            <AnimatePresence>
              {expandedComments[announcement.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mt-4"
                >
                  <div className="space-y-4 mb-4">
                    {announcement.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-3 pl-4 border-l-2 border-green-200 dark:border-green-800"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-green-700 dark:text-green-400">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 items-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-700">S</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[80px] resize-none border-green-200 focus:border-green-500 focus:ring-green-500 dark:border-green-800"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
