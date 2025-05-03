"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDomain } from "@/context/DomainContext"
import { BookOpen, GraduationCap, School, User, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { type Id } from "~/_generated/dataModel"

export default function SubjectDetailModal() {
    const params = useParams()
    const router = useRouter()
    const { domain, school } = useDomain()
    const subjectId = params.id as Id<"subjects">
    const initialFocusRef = useRef<HTMLButtonElement>(null)

    // Fetch subject data
    const subject = useQuery(api.queries.subject.getSubjectById, school?._id ? {
        subjectId,
        schoolId: school?._id,
    } : "skip")

    // Fetch subject-teacher-class relationships
    const subjectRelations = useQuery(api.queries.subject.getSTCBySubjectId, {
        subjectId,
        domain,
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

    if (!subject) {
        return (
            <Dialog open onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <SubjectDetailSkeleton />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Subject Details</h1>
                        <Button variant="outline" size="icon" onClick={handleClose} aria-label="Close modal" ref={initialFocusRef}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Subject info */}
                        <div className="md:col-span-1 bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="bg-[#2E8B57]/10 p-6 pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 rounded-full bg-[#2E8B57]/20 flex items-center justify-center">
                                        <BookOpen className="h-10 w-10 text-[#2E8B57]" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-center">{subject.name}</h2>
                                <div className="flex justify-center mt-2">
                                    <Badge
                                        variant={subject.isCore ? "default" : "outline"}
                                        className={subject.isCore ? "bg-[#2E8B57]" : ""}
                                    >
                                        {subject.isCore ? "Core Subject" : "Elective Subject"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Category</h3>
                                        <p className="font-medium">{subject.category}</p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="text-gray-700">{subject.description}</p>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-3 h-3 rounded-full ${subject.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                                            <span>{subject.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right column - Tabs with details */}
                        <div className="md:col-span-2 bg-white rounded-lg border shadow-sm overflow-hidden">
                            <Tabs defaultValue="classes" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="classes"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                                    >
                                        Classes & Teachers
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="curriculum"
                                        className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#2E8B57] data-[state=active]:bg-transparent data-[state=active]:text-[#2E8B57]"
                                    >
                                        Curriculum
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="classes" className="p-6">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold">Classes Teaching This Subject</h3>

                                        {subjectRelations && subjectRelations.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-4">
                                                {subjectRelations.map((relation, index) => (
                                                    <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                                        <div className="bg-[#2E8B57]/10 p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-white p-2 rounded-full">
                                                                        <School className="h-5 w-5 text-[#2E8B57]" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold">{relation.currentClass?.title}</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-[#2E8B57]/10 p-2 rounded-full">
                                                                    <User className="h-5 w-5 text-[#2E8B57]" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Teacher</p>
                                                                    <p className="font-medium">
                                                                        {relation.currentTeacher ? relation.currentTeacher.name : "Not Assigned"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-6 bg-gray-50 rounded-lg">
                                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                <h3 className="text-lg font-medium text-gray-900">No Classes Assigned</h3>
                                                <p className="text-gray-500 mt-1">This subject has not been assigned to any classes yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum" className="p-6">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold">Curriculum Materials</h3>

                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <h3 className="text-lg font-medium text-gray-900">No Curriculum Materials</h3>
                                            <p className="text-gray-500 mt-1">
                                                No curriculum materials have been added for this subject yet.
                                            </p>
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

function SubjectDetailSkeleton() {
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
