import AdminSubjects from "@/features/subjects/components/Admin"

export default function SubjectsPage() {

    return (
        <div className="p-6 max-w-[1600px] mx-auto">

            <div className="">
                {/* the list of subjects with the create subject card */}
                <AdminSubjects />
            </div>
        </div>
    )
}

