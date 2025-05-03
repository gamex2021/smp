"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDomain } from "@/context/DomainContext"
import { BookOpen, Calendar, Mail, MapPin, MessageSquare, Phone, School, User, X } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef } from "react"
import { type Id } from "~/_generated/dataModel"

export default function StudentProfileModal() {
    const params = useParams()
    const router = useRouter()
    const { user, school } = useDomain()
    const studentId = params.id as Id<"users">
    const initialFocusRef = useRef<HTMLButtonElement>(null)

    // Fetch student data
    const student = useQuery(api.queries.student.getStudentById, school?._id ? {
        studentId,
        schoolId: school?._id
    } : "skip")


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

    if (!student) {
        return (
            <Dialog open onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <StudentProfileSkeleton />
                </DialogContent>
            </Dialog>
        )
    }

    const isCurrentUser = user?._id === studentId

    return (
        <Dialog open onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Student Profile</h1>
                        <div className="flex items-center gap-2">
                            {!isCurrentUser && (
                                <Button className="bg-[#4B6CB7] hover:bg-[#4B6CB7]/90">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Message
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleClose}
                                aria-label="Close modal"
                                ref={initialFocusRef}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Profile info */}
                        <div className="md:col-span-1 bg-gradient-to-b from-[#4B6CB7]/10 to-white rounded-lg border shadow-sm p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                                    <Image
                                        src={student.image ?? "/placeholder.svg?height=128&width=128"}
                                        alt={student.name ?? "student's name"}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <h2 className="text-xl font-bold">{student.name}</h2>
                                <p className="text-[#4B6CB7] font-medium">{student.currentClass?.title} Student</p>

                                <div className="w-full mt-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                            <Mail className="h-5 w-5 text-[#4B6CB7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{student.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                            <Phone className="h-5 w-5 text-[#4B6CB7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{student.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                            <User className="h-5 w-5 text-[#4B6CB7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium capitalize">{student.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                            <School className="h-5 w-5 text-[#4B6CB7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Class</p>
                                            <p className="font-medium">{student.currentClass?.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                            <MapPin className="h-5 w-5 text-[#4B6CB7]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">School</p>
                                            <p className="font-medium">{school?.name ?? "School Name"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Tabs with details */}
                        <div className="md:col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden">
                            <Tabs defaultValue="about" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="about"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#4B6CB7] data-[state=active]:bg-transparent data-[state=active]:text-[#4B6CB7]"
                                    >
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="academics"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#4B6CB7] data-[state=active]:bg-transparent data-[state=active]:text-[#4B6CB7]"
                                    >
                                        Academics
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="attendance"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#4B6CB7] data-[state=active]:bg-transparent data-[state=active]:text-[#4B6CB7]"
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
                                                    <div className="bg-[#4B6CB7]/10 p-2 rounded-full mt-1">
                                                        <User className="h-5 w-5 text-[#4B6CB7]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{student.guardianName ?? "Not provided"}</p>
                                                        <p className="text-sm text-gray-500">Guardian Name</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-[#4B6CB7]/10 p-2 rounded-full mt-1">
                                                        <Phone className="h-5 w-5 text-[#4B6CB7]" />
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
                                                <div className="bg-[#4B6CB7]/10 p-2 rounded-full mt-1">
                                                    <MapPin className="h-5 w-5 text-[#4B6CB7]" />
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
                                                    <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                                        <User className="h-5 w-5 text-[#4B6CB7]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Username</p>
                                                        <p className="font-medium">{student.username}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#4B6CB7]/10 p-2 rounded-full">
                                                        <Calendar className="h-5 w-5 text-[#4B6CB7]" />
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
                                            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                <div className="bg-[#4B6CB7]/10 p-4 flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-full">
                                                        <School className="h-5 w-5 text-[#4B6CB7]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{student.currentClass?.title ?? "Not Assigned"}</h4>
                                                        <p className="text-sm text-gray-600">Academic Year 2023/2024</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Subjects</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {student.currentClass ? (
                                                    <>
                                                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                            <div className="bg-[#4B6CB7]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#4B6CB7]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">Mathematics</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                            <div className="bg-[#4B6CB7]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#4B6CB7]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">English Language</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                            <div className="bg-[#4B6CB7]/10 p-4 flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-full">
                                                                    <BookOpen className="h-5 w-5 text-[#4B6CB7]" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">Science</h4>
                                                                    <p className="text-sm text-gray-600">Core Subject</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <p className="text-gray-500 col-span-2">No subjects assigned yet.</p>
                                                )}
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

                                        <div className="bg-[#4B6CB7]/5 rounded-lg p-6 text-center">
                                            <Calendar className="h-12 w-12 text-[#4B6CB7] mx-auto mb-2" />
                                            <h4 className="text-lg font-medium">Attendance Data Not Available</h4>
                                            <p className="text-gray-600 mt-1">Attendance records will be displayed here once available.</p>
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

function StudentProfileSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column skeleton */}
                <div className="md:col-span-1">
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>

                {/* Right column skeleton */}
                <div className="md:col-span-2">
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    )
}
