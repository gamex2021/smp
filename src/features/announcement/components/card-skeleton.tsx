import { Skeleton } from "@/components/ui/skeleton";

export const SubjectCardSkeleton = () => {
    return (
        <div className="p-4 border rounded-lg space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
            </div>
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-8 w-16 rounded-md" />
            </div>
        </div>
    );
};