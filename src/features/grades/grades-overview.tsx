

import DownloadReportButton from "./download-report-button"
import { dummyGrades, dummyTerms } from "../subjects/dummy-data"
import TermSelector from "./term-selector"
import GradesSummary from "./grades-summary"
import SubjectGradesList from "./subject-grades-list"

export default async function GradesOverview() {
  // In a real app, this would fetch from your API/database
  const terms = dummyTerms
  const grades = dummyGrades.map((grade) => ({
    ...grade,
    status: grade.status as "passed" | "failed" | "incomplete",
  }))

  // Calculate overall GPA and stats
  const overallGPA = (grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length).toFixed(2)
  const passedSubjects = grades.filter((grade) => grade.score >= 60).length
  const failedSubjects = grades.length - passedSubjects

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TermSelector terms={terms} />
        <DownloadReportButton />
      </div>

      <GradesSummary
        gpa={overallGPA}
        totalSubjects={grades.length}
        passedSubjects={passedSubjects}
        failedSubjects={failedSubjects}
      />

      <SubjectGradesList grades={grades} />
    </div>
  )
}
