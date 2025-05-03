"use client"

import { useState } from "react"
import { FileText, MessageSquare, Calendar, Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface StudyGroupContentProps {
    group: {
        id: string
        resources: Array<{
            id: string
            title: string
            type: string
            uploadedBy: string
            uploadedAt: string
        }>
        discussions: Array<{
            id: string
            title: string
            author: string
            replies: number
            lastActivity: string
        }>
        upcomingSessions: Array<{
            id: string
            title: string
            date: string
            duration: number
            attendees: number
        }>
    }
}

export default function StudyGroupContent({ group }: StudyGroupContentProps) {
    const [activeTab, setActiveTab] = useState("resources")
    const [isNewResourceModalOpen, setIsNewResourceModalOpen] = useState(false)
    const [isNewDiscussionModalOpen, setIsNewDiscussionModalOpen] = useState(false)
    const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false)

    return (
        <Card>
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <CardHeader className="pb-3">

                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="discussions">Discussions</TabsTrigger>
                        <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
                    </TabsList>

                </CardHeader>
                <CardContent>
                    <TabsContent value="resources" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Study Resources</h3>
                            <Dialog open={isNewResourceModalOpen} onOpenChange={setIsNewResourceModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Resource
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Study Resource</DialogTitle>
                                        <DialogDescription>Share a study resource with your group</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input placeholder="Enter resource title" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea placeholder="Enter resource description" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">File</label>
                                            <Input type="file" />
                                        </div>
                                        <Button className="w-full" onClick={() => setIsNewResourceModalOpen(false)}>
                                            Upload Resource
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {group.resources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <div>
                                            <h4 className="font-medium">{resource.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Uploaded by {resource.uploadedBy} • {new Date(resource.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="discussions" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Group Discussions</h3>
                            <Dialog open={isNewDiscussionModalOpen} onOpenChange={setIsNewDiscussionModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Discussion
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Start New Discussion</DialogTitle>
                                        <DialogDescription>Create a new topic for group discussion</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Topic</label>
                                            <Input placeholder="Enter discussion topic" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Initial Post</label>
                                            <Textarea placeholder="Write your first post" />
                                        </div>
                                        <Button className="w-full" onClick={() => setIsNewDiscussionModalOpen(false)}>
                                            Create Discussion
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {group.discussions.map((discussion) => (
                                <div
                                    key={discussion.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        <div>
                                            <h4 className="font-medium">{discussion.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Started by {discussion.author} • {discussion.replies} replies • Last active{" "}
                                                {new Date(discussion.lastActivity).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="sessions" className="mt-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Study Sessions</h3>
                            <Dialog open={isNewSessionModalOpen} onOpenChange={setIsNewSessionModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Schedule Session
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Schedule Study Session</DialogTitle>
                                        <DialogDescription>Plan a study session with your group</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Session Title</label>
                                            <Input placeholder="Enter session title" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date & Time</label>
                                            <Input type="datetime-local" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Duration (minutes)</label>
                                            <Input type="number" min="15" step="15" defaultValue="60" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea placeholder="Enter session description" />
                                        </div>
                                        <Button className="w-full" onClick={() => setIsNewSessionModalOpen(false)}>
                                            Schedule Session
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {group.upcomingSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <h4 className="font-medium">{session.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(session.date).toLocaleString()} • {session.duration} minutes •{session.attendees}{" "}
                                                attending
                                            </p>
                                        </div>
                                    </div>
                                    <Button>Join Session</Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}

