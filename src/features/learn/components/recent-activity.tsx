"use client"

import { motion } from "framer-motion"
import { Activity, Award, FileText, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
    id: string
    type: string
    title: string
    score?: string
    cardsReviewed?: number
    date: string
}

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case "quiz_completed":
                return <Award className="h-5 w-5 text-yellow-500" />
            case "document_uploaded":
                return <FileText className="h-5 w-5 text-blue-500" />
            case "flashcard_session":
                return <BookOpen className="h-5 w-5 text-green-500" />
            default:
                return <Activity className="h-5 w-5 text-gray-500" />
        }
    }

    const getActivityText = (activity: ActivityItem) => {
        switch (activity.type) {
            case "quiz_completed":
                return `Completed quiz with score ${activity.score}`
            case "document_uploaded":
                return "Uploaded new document"
            case "flashcard_session":
                return `Reviewed ${activity.cardsReviewed} flashcards`
            default:
                return "Activity completed"
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>Recent Activity</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                        <div className="space-y-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleString()}</p>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    )
}

