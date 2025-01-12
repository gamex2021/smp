import { Skeleton } from "@/components/ui/skeleton"

export default function TeacherSubjectLoading() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <Skeleton className="h-10 w-[320px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[140px]" />
                ))}
            </div>
        </div>
    )
}

