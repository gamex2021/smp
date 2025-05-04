"use client"

import { motion } from "framer-motion"
import { Award, BookOpen, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface GradesSummaryProps {
  gpa: string
  totalSubjects: number
  passedSubjects: number
  failedSubjects: number
}

export default function GradesSummary({ gpa, totalSubjects, passedSubjects, failedSubjects }: GradesSummaryProps) {
  const getGPAColor = () => {
    const gpaNum = Number.parseFloat(gpa)
    if (gpaNum >= 3.5) return "text-green-500"
    if (gpaNum >= 2.5) return "text-blue-500"
    if (gpaNum >= 1.5) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-green-100 dark:border-green-900/50 overflow-hidden">
          <div className="h-1 bg-green-500" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GPA</p>
                <p className={`text-2xl font-bold ${getGPAColor()}`}>{gpa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-green-100 dark:border-green-900/50 overflow-hidden">
          <div className="h-1 bg-blue-500" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Subjects</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-green-100 dark:border-green-900/50 overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Passed</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border-green-100 dark:border-green-900/50 overflow-hidden">
          <div className="h-1 bg-red-500" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
