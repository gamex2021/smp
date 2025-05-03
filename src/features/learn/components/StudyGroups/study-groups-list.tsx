"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface StudyGroup {
    id: string
    name: string
    description: string
    members: number
    nextSession?: string
    avatar: string
    topics: string[]
    isJoined: boolean
}

interface StudyGroupsListProps {
    studyGroups: StudyGroup[]
}

export default function StudyGroupsList({ studyGroups }: StudyGroupsListProps) {
    return (
        <div className="space-y-4">
            {studyGroups.map((group, index) => (
                <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/learn/study-groups/${group.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={group.avatar} alt={group.name} />
                                            <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="font-medium">{group.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{group.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-2">
                                <div className="flex gap-2">
                                    {group.topics.map((topic) => (
                                        <Badge key={topic} variant="secondary">
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">{group.members} members</p>
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
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

