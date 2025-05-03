"use client"

import { RoleProtected } from "@/components/providers/role-protected"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDomain } from "@/context/DomainContext"
import { useQuery } from "convex/react"
import { BookOpen, Calendar, GraduationCap, Mail, MapPin, MessageSquare, Phone, User } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"

export default function TeacherProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { domain, user } = useDomain()
    const teacherId = params.id as Id<"users">
    // Fetch school data
    const school = useQuery(api.queries.school.findSchool, {
        domain,
    })

    // Fetch teacher data
    const teacher = useQuery(api.queries.teacher.getTeacherById, {
        id: teacherId,
    })


    if (!teacher) {
        return <TeacherProfileSkeleton />
    }

    const isCurrentUser = user?._id === teacherId

    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <div className="p-6 max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </Button>
                        <h1 className="text-2xl font-bold">Teacher Profile</h1>
                    </div>
                    {!isCurrentUser && (
                        <Button className="bg-[#11321f] hover:bg-[#11321f]/90">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left column - Profile info */}
                    <Card className="md:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                                    <Image
                                        src={teacher.image ?? "/placeholder.svg?height=128&width=128"}
                                        alt={teacher.name ?? "Teacher's profile picture"}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <h2 className="text-xl font-bold">{teacher.name}</h2>
                                <p className="text-[#2E8B57] font-medium">
                                    {teacher.assignedClasses?.map((c) => c?.title)?.join(", ")} Teacher
                                </p>

                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                            <Mail className="h-5 w-5 text-[#2E8B57]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{teacher.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                            <Phone className="h-5 w-5 text-[#2E8B57]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{teacher.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                            <User className="h-5 w-5 text-[#2E8B57]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium capitalize">{teacher.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                            <GraduationCap className="h-5 w-5 text-[#2E8B57]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Qualifications</p>
                                            <p className="font-medium">{teacher.qualifications}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                            <MapPin className="h-5 w-5 text-[#2E8B57]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">School</p>
                                            <p className="font-medium">{school?.name ?? "School Name"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column - Tabs with details */}
                    <Card className="md:col-span-2">
                        <CardContent className="p-0">
                            <Tabs defaultValue="about" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="about"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                                    >
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="classes"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                                    >
                                        Classes & Subjects
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="schedule"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                                    >
                                        Schedule
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="about" className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Biography</h3>
                                            <p className="text-gray-700">{teacher.bio ?? "No biography available."}</p>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Academic Background</h3>
                                            <div className="space-y-4">
                                                {teacher.qualifications?.split(",").map((qualification, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="bg-[#2E8B57]/10 p-2 rounded-full mt-1">
                                                            <GraduationCap className="h-5 w-5 text-[#2E8B57]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{qualification.trim()}</p>
                                                            <p className="text-sm text-gray-500">Academic Qualification</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                                        <User className="h-5 w-5 text-[#2E8B57]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Username</p>
                                                        <p className="font-medium">{teacher.username}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                                        <Calendar className="h-5 w-5 text-[#2E8B57]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Joined</p>
                                                        <p className="font-medium">
                                                            {new Date(teacher._creationTime).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="classes" className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Assigned Classes</h3>
                                            {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {teacher.assignedClasses.map((classItem) => (
                                                        <Card key={classItem?._id} className="overflow-hidden">
                                                            <div className="bg-[#2E8B57]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#2E8B57]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">{classItem?.title}</h4>
                                                                    <p className="text-sm text-gray-600">Class Teacher</p>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Not assigned as a class teacher.</p>
                                            )}
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Teaching Subjects</h3>
                                            {teacher.subjects && teacher.subjects.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {teacher.subjects.map((subject) => (
                                                        <Card key={subject?._id} className="overflow-hidden">
                                                            <div className="bg-[#2E8B57]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#2E8B57]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">{subject?.name}</h4>
                                                                    <p className="text-sm text-gray-600">{subject?.category}</p>
                                                                </div>
                                                            </div>
                                                            <div className="p-4">
                                                                <p className="text-sm text-gray-500">
                                                                    {subject?.description ?? "No description available."}
                                                                </p>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">No subjects assigned.</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="schedule" className="p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                                        <p className="text-gray-500">
                                            The teacher&apos;s schedule will be displayed here once it&apos;s available in the system.
                                        </p>

                                        <div className="bg-[#2E8B57]/5 rounded-lg p-6 text-center">
                                            <Calendar className="h-12 w-12 text-[#2E8B57] mx-auto mb-2" />
                                            <h4 className="text-lg font-medium">Schedule Not Available</h4>
                                            <p className="text-gray-600 mt-1">The timetable for this teacher has not been set up yet.</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleProtected>
    )
}

function TeacherProfileSkeleton() {
    return (
        <div className="container py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column skeleton */}
                <div className="md:col-span-1">
                    <Skeleton className="h-[600px] w-full rounded-lg" />
                </div>

                {/* Right column skeleton */}
                <div className="md:col-span-2">
                    <Skeleton className="h-[600px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}
