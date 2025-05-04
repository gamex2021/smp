import Link from "next/link"
import { ChevronLeft, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ClassroomHeaderProps {
  subject: {
    id: string
    name: string
    code: string
    teacher: string
    color: string
    students: number
  }
}

export default function ClassroomHeader({ subject }: ClassroomHeaderProps) {
  return (
    <div className="mb-8">
      <Link href="/student/subjects">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 -ml-2"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Subjects
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">{subject.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {subject.code} • Taught by {subject.teacher}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full">
            <Users className="h-4 w-4" />
            <span>{subject.students} students</span>
          </div>

          <Button
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Course Materials
          </Button>
        </div>
      </div>
    </div>
  )
}
