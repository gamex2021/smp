import TeacherSubjects from "@/features/subjects/components/Teacher"
import { TeacherSubjectSearchHeader } from "@/features/subjects/components/Teacher/subject-search-header"
import TeacherTimetable from "@/features/subjects/components/Teacher/teacher-timetable"

export default function TeacherSubjectPage() {
   
    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <TeacherSubjectSearchHeader />

           <TeacherSubjects />

            {/* the teacher time table */}

            <TeacherTimetable />


        </div>
    )
}

