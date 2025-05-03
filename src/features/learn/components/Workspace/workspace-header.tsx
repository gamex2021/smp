"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, Share2, MoreHorizontal, Star, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface WorkspaceHeaderProps {
    workspace: {
        id: string
        title: string
        description: string
        thumbnail: string
    }
}

export default function WorkspaceHeader({ workspace }: WorkspaceHeaderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(workspace.title)
    const [description, setDescription] = useState(workspace.description)
    const [isStarred, setIsStarred] = useState(false)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

    const handleSave = () => {
        // In a real app, you would save the changes to the backend here
        setIsEditing(false)
    }

    return (
        <div className="bg-background border-b">
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
                            <li>
                                <Link href="/learn" className="hover:text-foreground">
                                    Workspaces
                                </Link>
                            </li>
                            <li className="mx-2">/</li>
                            <li className="text-foreground font-medium">{workspace.title}</li>
                        </ol>
                    </nav>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-40 w-full md:w-60 rounded-lg overflow-hidden">
                        <Image
                            src={workspace.thumbnail || "/placeholder.svg"}
                            alt={workspace.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-4">
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-2xl font-bold h-auto text-xl"
                                />
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleSave}>Save Changes</Button>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold">{title}</h1>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => setIsStarred(!isStarred)}>
                                            <Star className={`h-5 w-5 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                        </Button>
                                        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Share Workspace</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Workspace Link</label>
                                                        <div className="flex">
                                                            <Input
                                                                readOnly
                                                                value={`https://learnai.app/workspace/${workspace.id}`}
                                                                className="rounded-r-none"
                                                            />
                                                            <Button className="rounded-l-none">Copy</Button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Invite by Email</label>
                                                        <div className="flex">
                                                            <Input placeholder="Enter email address" type="email" className="rounded-r-none" />
                                                            <Button className="rounded-l-none">Invite</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit Workspace
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Duplicate Workspace</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete Workspace</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">{description}</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

