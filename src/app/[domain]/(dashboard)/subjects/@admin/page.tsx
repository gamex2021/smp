import { mockSubjects } from "@/app/config/siteConfig"
import { AddSubjectCard } from "@/features/subjects/components/Admin/add-subject-card"
import { SearchHeader } from "@/features/subjects/components/Admin/search-header"
import { SubjectCard } from "@/features/subjects/shared/subject-card"

export default function SubjectsPage() {

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <SearchHeader />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockSubjects.map((subject) => (
                    <SubjectCard
                        key={subject.id}
                        name={subject.name}
                    />
                ))}
                <AddSubjectCard />
            </div>
        </div>
    )
}

