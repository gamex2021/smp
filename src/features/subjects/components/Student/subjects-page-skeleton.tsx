import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function SubjectsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-3 bg-gray-200" />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="space-y-3 mt-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-4">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
