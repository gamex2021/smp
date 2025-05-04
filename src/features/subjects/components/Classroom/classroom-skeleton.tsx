import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClassroomSkeleton() {
  return (
    <div>
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8 bg-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <TabsTrigger key={i} value={`tab-${i}`} disabled>
              <Skeleton className="h-4 w-20" />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="announcements" className="mt-0">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
