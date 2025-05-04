/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, BookOpen, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Grade {
  id: string
  subjectId: string
  subjectName: string
  subjectCode: string
  score: number
  letterGrade: string
  status: "passed" | "failed" | "incomplete"
  teacher: string
  feedback?: string
  breakdown: {
    category: string
    weight: number
    score: number
  }[]
}

interface SubjectGradesListProps {
  grades: Grade[]
}

export default function SubjectGradesList({ grades }: SubjectGradesListProps) {
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({})

  const toggleSubject = (id: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-blue-600 dark:text-blue-400"
    if (score >= 70) return "text-emerald-600 dark:text-emerald-400"
    if (score >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-600"
    if (score >= 80) return "bg-blue-600"
    if (score >= 70) return "bg-emerald-600"
    if (score >= 60) return "bg-amber-600"
    return "bg-red-600"
  }

  const getStatusBadge = (status: Grade["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Passed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>
      case "incomplete":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Incomplete</Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">Subject Grades</h2>

      {grades.map((grade) => (
        <Card key={grade.id} className="overflow-hidden border-green-100 dark:border-green-900/50">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-green-700 dark:text-green-400">{grade.subjectName}</h3>
                    {getStatusBadge(grade.status)}
                  </div>

                  <p className="text-sm text-gray-500">
                    {grade.subjectCode} • Taught by {grade.teacher}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`text-xl font-bold ${getGradeColor(grade.score)}`}>{grade.score}%</span>
                  <p className="text-sm font-medium">{grade.letterGrade}</p>
                </div>

                <button
                  onClick={() => toggleSubject(grade.id)}
                  className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600"
                >
                  {expandedSubjects[grade.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedSubjects[grade.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-4">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</h4>
                      <span className={`text-sm font-medium ${getGradeColor(grade.score)}`}>{grade.score}%</span>
                    </div>
                    <Progress
                      value={grade.score}
                      className="h-2 bg-gray-100 dark:bg-gray-700"
                    //   @ts-expect-error
                      indicatorClassName={getProgressColor(grade.score)}
                    />
                  </div>

                  <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Breakdown</h4>

                    {grade.breakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.category}</span>
                            <span className="text-xs text-gray-500">({item.weight}%)</span>
                          </div>
                          <span className={`text-sm font-medium ${getGradeColor(item.score)}`}>{item.score}%</span>
                        </div>
                        <Progress
                          value={item.score}
                          className="h-1.5 bg-gray-100 dark:bg-gray-700"
                        //   @ts-expect-error
                          indicatorClassName={getProgressColor(item.score)}
                        />
                      </div>
                    ))}
                  </div>

                  {grade.feedback && (
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Teacher Feedback</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{grade.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}
