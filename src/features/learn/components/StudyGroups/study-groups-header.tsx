"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function StudyGroupsHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center mb-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/learn">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <nav className="ml-2 text-sm text-muted-foreground">
                        <ol className="flex items-center">
                            <li>
                                <Link href="/learn" className="hover:text-foreground">
                                    Learn
                                </Link>
                            </li>
                            <li className="mx-2">/</li>
                            <li className="text-foreground font-medium">Study Groups</li>
                        </ol>
                    </nav>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Study Groups</h1>
                            <p className="text-muted-foreground">Join or create study groups to learn together</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Group
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Privacy</label>
                                        <Select defaultValue="public">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full" onClick={() => setIsCreateDialogOpen(false)}>
                                        Create Group
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList>
                            <TabsTrigger value="all">All Groups</TabsTrigger>
                            <TabsTrigger value="joined">My Groups</TabsTrigger>
                            <TabsTrigger value="recommended">Recommended</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="ml-4 w-64">
                        <Input type="search" placeholder="Search study groups..." className="w-full" />
                    </div>
                </div>
            </div>
        </header>
    )
}

