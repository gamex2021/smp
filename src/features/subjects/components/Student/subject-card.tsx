"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Book, Users, Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SubjectCardProps {
  subject: {
    id: string
    name: string
    code: string
    teacher: string
    students: number
    nextClass: string
    color: string
    hasNewContent: boolean
  }
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }} className="h-full">
      <Link href={`/student/subjects/${subject.id}`} className="block h-full">
        <Card
          className="overflow-hidden h-full border-2 hover:border-green-500 transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-3" style={{ backgroundColor: subject.color }} />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-400">{subject.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subject.code}</p>
              </div>
              {subject.hasNewContent && <Badge className="bg-green-500 hover:bg-green-600">New Content</Badge>}
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Book className="h-4 w-4 text-green-600" />
                <span>Taught by {subject.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-green-600" />
                <span>{subject.students} students enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>Next class: {subject.nextClass}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <Button
              variant="ghost"
              className="w-full justify-between group text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
            >
              <span>Enter Classroom</span>
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
