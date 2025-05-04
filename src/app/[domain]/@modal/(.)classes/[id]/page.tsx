"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDomain } from "@/context/DomainContext"
import { Briefcase, GraduationCap, User, Users, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { usePaginatedQuery, useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { type Id } from "~/_generated/dataModel"

export default function ClassDetailModal() {
  const params = useParams()
  const router = useRouter()
  const { domain } = useDomain()
  const classId = params.id as Id<"classes">
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  // Fetch class data
  const classItem = useQuery(api.queries.class.getClassById, {
    classId,
  })

  // Fetch class teachers with pagination
  const {
    results: classTeachers,
    status: teachersStatus,
    loadMore: loadMoreTeachers,
  } = usePaginatedQuery(api.queries.class.getClassesTeachers, domain && classId ? { domain, classId } : "skip", {
    initialNumItems: 10,
  })

  // Fetch class students with pagination
  const {
    results: classStudents,
    status: studentsStatus,
    loadMore: loadMoreStudents,
  } = usePaginatedQuery(api.queries.class.getClassesStudents, domain && classId ? { domain, classId } : "skip", {
    initialNumItems: 10,
  })

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router])

  // Focus the close button when modal opens
  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const handleClose = () => {
    router.back()
  }

  if (!classItem) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <ClassDetailSkeleton />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Class Details</h1>
            <Button variant="outline" size="icon" onClick={handleClose} aria-label="Close modal" ref={initialFocusRef}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Class info */}
            <div className="md:col-span-1 bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="bg-[#2E8B57]/10 p-6 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#2E8B57]/20 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-[#2E8B57]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center">{classItem.title}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Class Teachers</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {classTeachers?.length > 0 ? (
                        classTeachers.map((teacher) => (
                          <Badge key={teacher._id} variant="outline" className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{teacher.teacherDetails?.name ?? "Unknown Teacher"}</span>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No teachers assigned</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Students</h3>
                    <p className="font-medium">
                      {classStudents?.length ?? 0} Students enrolled
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Academic Year</h3>
                    <p className="font-medium">2023/2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Tabs with details */}
            <div className="md:col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden">
              <Tabs defaultValue="students" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="students"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                  >
                    Students
                  </TabsTrigger>
                  <TabsTrigger
                    value="teachers"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                  >
                    Teachers
                  </TabsTrigger>
                  <TabsTrigger
                    value="subjects"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                  >
                    Subjects
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Students in this Class</h3>

                    {classStudents?.length > 0 ? (
                      <div className="space-y-4">
                        {classStudents.map((student) => (
                          <div key={student._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={student.studentDetails?.image ?? "/placeholder.svg?height=40&width=40"}
                                    alt={student.studentDetails?.name ?? "Student"}
                                  />
                                  <AvatarFallback>{student.studentDetails?.name?.charAt(0) ?? "S"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{student.studentDetails?.name ?? "Unknown Student"}</h4>
                                  <p className="text-sm text-gray-500">{student.studentDetails?.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {studentsStatus === "CanLoadMore" && (
                          <div className="flex justify-center mt-4">
                            <Button variant="outline" onClick={() => loadMoreStudents(10)} className="px-8">
                              Load More Students
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Students</h3>
                        <p className="text-gray-500 mt-1">This class does not have any students yet.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="teachers" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Teachers for this Class</h3>

                    {classTeachers?.length > 0 ? (
                      <div className="space-y-4">
                        {classTeachers.map((teacher) => (
                          <div key={teacher._id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={teacher.teacherDetails?.image ?? "/placeholder.svg?height=40&width=40"}
                                    alt={teacher.teacherDetails?.name ?? "Teacher"}
                                  />
                                  <AvatarFallback>{teacher.teacherDetails?.name?.charAt(0) ?? "T"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{teacher.teacherDetails?.name ?? "Unknown Teacher"}</h4>
                                  <p className="text-sm text-gray-500">{teacher.teacherDetails?.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {teachersStatus === "CanLoadMore" && (
                          <div className="flex justify-center mt-4">
                            <Button variant="outline" onClick={() => loadMoreTeachers(10)} className="px-8">
                              Load More Teachers
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Teachers</h3>
                        <p className="text-gray-500 mt-1">This class does not have any teachers assigned yet.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="subjects" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Subjects Taught in this Class</h3>

                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No Subjects</h3>
                      <p className="text-gray-500 mt-1">No subjects have been assigned to this class yet.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ClassDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column skeleton */}
        <div className="md:col-span-1">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>

        {/* Right column skeleton */}
        <div className="md:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
