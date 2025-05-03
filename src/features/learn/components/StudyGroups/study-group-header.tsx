"use client"

import Link from "next/link"
import { ChevronLeft, Users, Share2, Settings, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface StudyGroupHeaderProps {
    group: {
        id: string
        name: string
        description: string
        topics: string[]
        members: Array<{
            id: string
            name: string
            role: string
            avatar: string
        }>
    }
}

export default function StudyGroupHeader({ group }: StudyGroupHeaderProps) {
    return (
        <header className="bg-background border-b">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center mb-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/learn/study-groups">
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
                                <Link href="/learn/study-groups" className="hover:text-foreground">
                                    Study Groups
                                </Link>
                            </li>
                            <li className="mx-2">/</li>
                            <li className="text-foreground font-medium">{group.name}</li>
                        </ol>
                    </nav>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold">{group.name}</h1>
                        </div>
                        <p className="text-muted-foreground mb-3">{group.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {group.topics.map((topic) => (
                                <Badge key={topic} variant="secondary">
                                    {topic}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button>Join Group</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Group Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Leave Group</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

