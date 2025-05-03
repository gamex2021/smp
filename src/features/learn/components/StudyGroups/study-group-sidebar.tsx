"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users } from "lucide-react"

interface StudyGroupSidebarProps {
    group: {
        members: Array<{
            id: string
            name: string
            role: string
            avatar: string
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

export default function StudyGroupSidebar({ group }: StudyGroupSidebarProps) {
    const nextSession = group.upcomingSessions[0]

    return (
        <div className="space-y-6">
            {nextSession && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            <CardTitle>Next Session</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">{nextSession.title}</h3>
                                <p className="text-sm text-muted-foreground">{new Date(nextSession.date).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{nextSession.attendees} attending</span>
                                <Button>Join Session</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-primary" />
                            <CardTitle>Members</CardTitle>
                        </div>
                        <span className="text-sm text-muted-foreground">{group.members.length} members</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {group.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

