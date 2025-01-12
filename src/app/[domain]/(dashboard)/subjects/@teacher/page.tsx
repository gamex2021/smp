import { teacherMockSubjects } from "@/app/config/siteConfig"
import { TeacherSubjectSearchHeader } from "@/features/subjects/components/Teacher/subject-search-header"
import TeacherTimetable from "@/features/subjects/components/Teacher/teacher-timetable"
import { SubjectCard } from "@/features/subjects/shared/subject-card"

export default function TeacherSubjectPage() {

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <TeacherSubjectSearchHeader />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teacherMockSubjects.map((subject) => (
                    <SubjectCard
                        key={subject.id}
                        name={subject.name}
                        teacher
                        className={subject.className}
                        teacherName={subject?.teacherName}
                    />
                ))}
            </div>

            {/* the teacher time table */}

            <TeacherTimetable />


        </div>
    )
}

