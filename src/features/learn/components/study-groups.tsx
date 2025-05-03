"use client"
import { motion } from "framer-motion"
import { Users, Plus, Calendar, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
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
import Link from "next/link"

interface StudyGroup {
    id: string
    name: string
    members: number
    nextSession?: string
    avatar: string
}

export default function StudyGroups({ groups }: { groups: StudyGroup[] }) {
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle>Study Groups</CardTitle>
                    </div>
                    <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Create
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Study Group</DialogTitle>
                                <DialogDescription>Create a new study group to collaborate with others</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Group Name</label>
                                    <Input placeholder="Enter group name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <Textarea placeholder="Enter group description" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Topics</label>
                                    <Input placeholder="Enter topics (comma separated)" />
                                </div>
                                <Button className="w-full" onClick={() => setIsCreateGroupModalOpen(false)}>
                                    Create Group
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {groups.map((group, index) => (
                    <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/learn/study-groups/${group.id}`}>
                            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={group.avatar} alt={group.name} />
                                        <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{group.name}</h4>
                                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {group.nextSession && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(group.nextSession).toLocaleDateString()}
                                        </Badge>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                <Button variant="outline" className="w-full" asChild>
                    <Link href="/learn/study-groups">
                        <Users className="h-4 w-4 mr-2" />
                        Browse All Study Groups
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

