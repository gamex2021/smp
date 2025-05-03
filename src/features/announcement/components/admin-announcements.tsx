/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAction, useQuery } from "convex/react"
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from "react"
import { ComponentProtector } from "@/components/providers/component-protector"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useDomain } from "@/context/DomainContext"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/core/style.css"
import "@blocknote/mantine/style.css"
import { format } from "date-fns"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"
import { extractTextFromEditorJSON } from "../functions/extract-text-from-json"
import { AnnouncementEditor } from "./announcement-editor"
import { AnnouncementViewer } from "./announcement-viewer"
import { SubjectCardSkeleton } from "./card-skeleton"


const ANNOUNCEMENTS_PER_PAGE = 12;
export default function AdminAnnouncements() {
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<unknown>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [cursor, setCursor] = useState<string>();
    const [search, setSearch] = useState("");
    const deleteAnnouncement = useAction(api.mutations.announcements.deleteAnnouncement)
    // get the school domain
    const { domain } = useDomain()
    // get the schoolInfo which includes the id,
    const schoolInfo = useQuery(api.queries.school.findSchool, {
        domain,
    });
    const [viewAnnouncement, setViewAnnouncement] = useState<{ _id: string; title: string; content: string; createdAt: string } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ _id: Id<"announcements">; title: string; content: string; createdAt: string } | null>(null)
    const announcementQuery = useQuery(api.queries.announcements.getAnnouncementsWithPagination, {
        search: search || undefined,
        cursor: cursor,
        schoolId: schoolInfo?.id,
        numItems: ANNOUNCEMENTS_PER_PAGE,
    });



    // Handle loading state
    if (!announcementQuery) {
        return (
            <div className="p-6 space-y-6">
                {/* Header skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>
                </div>

                {/* Search skeleton */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: ANNOUNCEMENTS_PER_PAGE }).map((_, i) => (
                        <SubjectCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }


    const handleDelete = async (id: Id<"announcements">) => {
        try {
            await deleteAnnouncement({ id })
        } catch (error) {
            console.error("Failed to delete announcement:", error)
        }
    }

    const { announcements } = announcementQuery;

    return (
        <div className="mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Announcements</h1>
                    <p className="text-muted-foreground">Manage school announcements</p>
                </div>
                <ComponentProtector allowedRoles={["ADMIN"]}>
                    <Dialog open={isCreating} onOpenChange={setIsCreating}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                New Announcement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Create Announcement</DialogTitle>
                            </DialogHeader>
                            <AnnouncementEditor
                                onComplete={() => setIsCreating(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </ComponentProtector>

            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="grid gap-4">
                    {announcements?.map((announcement) => (
                        <Card key={announcement._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{announcement.title}</CardTitle>
                                        <CardDescription>
                                            Posted {format(new Date(announcement.createdAt), "PPP")}
                                        </CardDescription>
                                    </div>
                                    <div className="flex justify-end mt-4 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setViewAnnouncement(announcement)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <ComponentProtector allowedRoles={["ADMIN"]}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setSelectedAnnouncement(announcement)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </ComponentProtector>

                                        <ComponentProtector allowedRoles={["ADMIN"]}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setDeleteConfirm(announcement)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </ComponentProtector>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none line-clamp-3">
                                    {extractTextFromEditorJSON(JSON.parse(announcement.content))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            <AnnouncementViewer
                announcement={viewAnnouncement}
                isOpen={!!viewAnnouncement}
                onClose={() => setViewAnnouncement(null)}
            />

            <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the announcement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm._id)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Announcement</DialogTitle>
                    </DialogHeader>
                    <AnnouncementEditor
                        announcement={selectedAnnouncement}
                        onComplete={() => setSelectedAnnouncement(null)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

