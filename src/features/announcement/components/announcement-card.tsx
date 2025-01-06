import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from 'lucide-react'

interface AnnouncementCardProps {
    announcement: {
        id: number
        title: string
        date: string
        status: string
    }
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className={`w-2 h-2 rounded-full ${announcement.status === 'scheduled' ? 'bg-yellow-400' : 'bg-[#2E8B57]'
                    }`} />
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <h3 className="font-medium mb-2">{announcement.title}</h3>
                <p className="text-sm text-gray-500">{announcement.date}</p>
            </CardContent>
        </Card>
    )
}

