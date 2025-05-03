import AIChatTutor from "@/features/learn/components/ai-chat-tutor"
import LearnHeader from "@/features/learn/components/learn-header"
import LearningTools from "@/features/learn/components/learning-tools"
import RecentActivity from "@/features/learn/components/recent-activity"
import StudyGroups from "@/features/learn/components/study-groups"
import UploadSection from "@/features/learn/components/upload-section"
import WorkspaceLibrary from "@/features/learn/components/workspace-library"
import type { Metadata } from "next"


export const metadata: Metadata = {
    title: "Learn | AI Study Assistant",
    description: "Upload documents, get AI summaries, flashcards, quizzes, and more",
}

export default async function LearnPage() {
    // This would fetch data from your backend in a real implementation
    const workspaces = [
        {
            id: "1",
            title: "Biology 101",
            description: "Introduction to cellular biology and genetics",
            documentCount: 5,
            lastUpdated: "2023-05-15T10:30:00Z",
            thumbnail: "/placeholder.svg?height=100&width=180",
        },
        {
            id: "2",
            title: "World History",
            description: "Ancient civilizations to modern era",
            documentCount: 8,
            lastUpdated: "2023-06-20T14:45:00Z",
            thumbnail: "/placeholder.svg?height=100&width=180",
        },
        {
            id: "3",
            title: "Calculus II",
            description: "Advanced integration techniques and applications",
            documentCount: 3,
            lastUpdated: "2023-07-05T09:15:00Z",
            thumbnail: "/placeholder.svg?height=100&width=180",
        },
    ]

    const studyGroups = [
        {
            id: "1",
            name: "Biology Study Group",
            members: 8,
            nextSession: "2023-08-10T18:00:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "2",
            name: "History Enthusiasts",
            members: 12,
            nextSession: "2023-08-12T17:30:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    const recentActivities = [
        {
            id: "1",
            type: "quiz_completed",
            title: "Biology Quiz #3",
            score: "85%",
            date: "2023-08-01T15:20:00Z",
        },
        {
            id: "2",
            type: "document_uploaded",
            title: "World War II Notes",
            date: "2023-07-29T10:15:00Z",
        },
        {
            id: "3",
            type: "flashcard_session",
            title: "Calculus Formulas",
            cardsReviewed: 24,
            date: "2023-07-28T14:30:00Z",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <LearnHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <UploadSection />
                        <WorkspaceLibrary workspaces={workspaces} />
                        <LearningTools />
                    </div>
                    <div className="space-y-8">
                        <RecentActivity activities={recentActivities} />
                        <StudyGroups groups={studyGroups} />
                        <AIChatTutor />
                    </div>
                </div>
            </main>
        </div>
    )
}

