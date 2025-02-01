import AdminSubjects from "@/features/subjects/components/Admin"
import { SearchHeader } from "@/features/subjects/components/Admin/components/search-header"

export default function SubjectsPage() {

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            {/* to search through the subjects */}
            <SearchHeader />

            <div className="">
                {/* the list of subjects with the create subject card */}
                <AdminSubjects />
            </div>
        </div>
    )
}

