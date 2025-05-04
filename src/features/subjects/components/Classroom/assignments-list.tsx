"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, AlertCircle, FileText, Upload, ChevronDown, ChevronUp, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  points: number
  status: "completed" | "pending" | "overdue" | "graded"
  grade?: number
  feedback?: string
  attachments: {
    id: string
    name: string
    type: string
    size: string
  }[]
}

interface AssignmentsListProps {
  assignments: Assignment[]
}

export default function AssignmentsList({ assignments }: AssignmentsListProps) {
  const [expandedAssignments, setExpandedAssignments] = useState<Record<string, boolean>>({})

  const toggleAssignment = (id: string) => {
    setExpandedAssignments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "graded":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusText = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return "Submitted"
      case "pending":
        return "Pending"
      case "overdue":
        return "Overdue"
      case "graded":
        return "Graded"
    }
  }

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "graded":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="overflow-hidden border-green-100 dark:border-green-900/50">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-green-700 dark:text-green-400">{assignment.title}</h3>
                  <Badge className={getStatusColor(assignment.status)}>{getStatusText(assignment.status)}</Badge>
                </div>

                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}</span>
                  </div>
                  <div>{assignment.points} points</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleAssignment(assignment.id)}
                className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                {expandedAssignments[assignment.id] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          <AnimatePresence>
            {expandedAssignments[assignment.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="pt-4">
                  <div className="prose prose-green dark:prose-invert max-w-none mb-6">
                    {assignment.description.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4 last:mb-0 text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {assignment.attachments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">Attachments</h4>
                      <div className="space-y-2">
                        {assignment.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                          >
                            <FileText className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{attachment.name}</div>
                              <div className="text-xs text-gray-500">
                                {attachment.type} • {attachment.size}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignment.status === "graded" && (
                    <div className="mb-6 p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <h4 className="text-sm font-medium mb-2 text-blue-700 dark:text-blue-400">Feedback</h4>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade</span>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            {assignment.grade} / {assignment.points}
                          </span>
                        </div>
                        <Progress
                          value={(assignment.grade! / assignment.points) * 100}
                          className="h-2 bg-blue-100 dark:bg-blue-900"
                        />
                      </div>
                      {assignment.feedback && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">{assignment.feedback}</p>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0 pb-4">
                  {assignment.status === "pending" && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </Button>
                  )}

                  {assignment.status === "completed" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                      >
                        View Submission
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Resubmit
                      </Button>
                    </div>
                  )}

                  {assignment.status === "overdue" && (
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Late
                    </Button>
                  )}

                  {assignment.status === "graded" && (
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      View Submission
                    </Button>
                  )}
                </CardFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}
