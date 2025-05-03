"use client"

import { RoleProtected } from "@/components/providers/role-protected"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDomain } from "@/context/DomainContext"
import { useQuery } from "convex/react"
import { BookOpen, Calendar, GraduationCap, Mail, MapPin, MessageSquare, Phone, School, User } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"

export default function StudentProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { user, school } = useDomain()
    const studentId = params.id as Id<"users">

    // Fetch student data
    const student = useQuery(api.queries.student.getStudentById, school?._id ? {
        studentId,
        schoolId: school?._id,
    } : "skip")


    if (!student) {
        return <StudentProfileSkeleton />
    }

    const isCurrentUser = user?._id === studentId

    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            <div className="p-6 max-w-[1600px] mx-auto  space-y-6">
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
                        <h1 className="text-2xl font-bold">Student Profile</h1>
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
                    <Card className="md:col-span-1 bg-gradient-to-b from-[#11321f]/10 to-white">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                                    <Image
                                        src={student.image ?? "/placeholder.svg?height=128&width=128"}
                                        alt={student?.name ?? "student's name"}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <h2 className="text-xl font-bold">{student.name}</h2>
                                <p className="text-[#11321f] font-medium">{student.currentClass?.title} Student</p>

                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#11321f]/10 p-2 rounded-full">
                                            <Mail className="h-5 w-5 text-[#11321f]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#11321f]/10 p-2 rounded-full">
                                            <Phone className="h-5 w-5 text-[#11321f]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{student.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#11321f]/10 p-2 rounded-full">
                                            <User className="h-5 w-5 text-[#11321f]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium capitalize">{student.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#11321f]/10 p-2 rounded-full">
                                            <School className="h-5 w-5 text-[#11321f]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Class</p>
                                            <p className="font-medium">{student.currentClass?.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#11321f]/10 p-2 rounded-full">
                                            <MapPin className="h-5 w-5 text-[#11321f]" />
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
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#11321f] data-[state=active]:bg-transparent data-[state=active]:text-[#11321f]"
                                    >
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="academics"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#11321f] data-[state=active]:bg-transparent data-[state=active]:text-[#11321f]"
                                    >
                                        Academics
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="attendance"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#11321f] data-[state=active]:bg-transparent data-[state=active]:text-[#11321f]"
                                    >
                                        Attendance
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="about" className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Biography</h3>
                                            <p className="text-gray-700">{student.bio ?? "No biography available."}</p>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Guardian Information</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-[#11321f]/10 p-2 rounded-full mt-1">
                                                        <User className="h-5 w-5 text-[#11321f]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{student.guardianName ?? "Not provided"}</p>
                                                        <p className="text-sm text-gray-500">Guardian Name</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-[#11321f]/10 p-2 rounded-full mt-1">
                                                        <Phone className="h-5 w-5 text-[#11321f]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{student.guardianPhone ?? "Not provided"}</p>
                                                        <p className="text-sm text-gray-500">Guardian Contact</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Address</h3>
                                            <div className="flex items-start gap-3">
                                                <div className="bg-[#11321f]/10 p-2 rounded-full mt-1">
                                                    <MapPin className="h-5 w-5 text-[#11321f]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{student.address ?? "Not provided"}</p>
                                                    <p className="text-sm text-gray-500">Residential Address</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#11321f]/10 p-2 rounded-full">
                                                        <User className="h-5 w-5 text-[#11321f]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Username</p>
                                                        <p className="font-medium">{student.username}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#11321f]/10 p-2 rounded-full">
                                                        <Calendar className="h-5 w-5 text-[#11321f]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Joined</p>
                                                        <p className="font-medium">
                                                            {new Date(student._creationTime).toLocaleDateString("en-US", {
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

                                <TabsContent value="academics" className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Current Class</h3>
                                            <Card className="overflow-hidden">
                                                <div className="bg-[#11321f]/10 p-4 flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-full">
                                                        <School className="h-5 w-5 text-[#11321f]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{student.currentClass?.title ?? "Not Assigned"}</h4>
                                                        <p className="text-sm text-gray-600">Academic Year 2023/2024</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Subjects</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {student.currentClass ? (
                                                    <>
                                                        <Card className="overflow-hidden">
                                                            <div className="bg-[#11321f]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#11321f]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">Mathematics</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                        <Card className="overflow-hidden">
                                                            <div className="bg-[#11321f]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#11321f]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">English Language</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                        <Card className="overflow-hidden">
                                                            <div className="bg-[#11321f]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#11321f]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">Science</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500 col-span-2">No subjects assigned yet.</p>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Academic Performance</h3>
                                            <div className="bg-[#11321f]/5 rounded-lg p-6 text-center">
                                                <GraduationCap className="h-12 w-12 text-[#11321f] mx-auto mb-2" />
                                                <h4 className="text-lg font-medium">Performance Data Not Available</h4>
                                                <p className="text-gray-600 mt-1">Academic records will be displayed here once available.</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="attendance" className="p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Attendance Record</h3>
                                        <p className="text-gray-500">
                                            The student&apos;s attendance records will be displayed here once they are available in the system.
                                        </p>

                                        <div className="bg-[#11321f]/5 rounded-lg p-6 text-center">
                                            <Calendar className="h-12 w-12 text-[#11321f] mx-auto mb-2" />
                                            <h4 className="text-lg font-medium">Attendance Data Not Available</h4>
                                            <p className="text-gray-600 mt-1">Attendance records will be displayed here once available.</p>
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

function StudentProfileSkeleton() {
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
