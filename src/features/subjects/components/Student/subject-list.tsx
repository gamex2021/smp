
import { dummySubjects } from "../../dummy-data"
import SubjectCard from "./subject-card"

export default async function SubjectsList() {
  // In a real app, this would fetch from your API/database
  const subjects = dummySubjects

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  )
}
