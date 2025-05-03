import StudyGroupContent from "@/features/learn/components/StudyGroups/study-group-content"
import StudyGroupHeader from "@/features/learn/components/StudyGroups/study-group-header"
import StudyGroupSidebar from "@/features/learn/components/StudyGroups/study-group-sidebar"
import type { Metadata } from "next"
import { notFound } from "next/navigation"


export const metadata: Metadata = {
    title: "Study Group | AI Study Assistant",
    description: "View and participate in your study group",
}

// This would be a server-side data fetch in a real implementation
async function getStudyGroup(id: string) {
    // Mock data
    const studyGroups = [
        {
            id: "1",
            name: "Biology Study Group",
            description: "A group for discussing biology concepts and preparing for exams",
            members: [
                { id: "1", name: "Alex Johnson", role: "admin", avatar: "/placeholder.svg?height=40&width=40" },
                { id: "2", name: "Maria Garcia", role: "member", avatar: "/placeholder.svg?height=40&width=40" },
                { id: "3", name: "John Smith", role: "member", avatar: "/placeholder.svg?height=40&width=40" },
            ],
            nextSession: "2023-08-10T18:00:00Z",
            topics: ["Cell Biology", "Genetics", "Ecology"],
            resources: [
                {
                    id: "1",
                    title: "Cell Structure Notes",
                    type: "pdf",
                    uploadedBy: "Alex Johnson",
                    uploadedAt: "2023-08-01T15:20:00Z",
                },
                {
                    id: "2",
                    title: "Genetics Quiz",
                    type: "quiz",
                    uploadedBy: "Maria Garcia",
                    uploadedAt: "2023-07-29T10:15:00Z",
                },
            ],
            discussions: [
                {
                    id: "1",
                    title: "Mitosis vs Meiosis",
                    author: "John Smith",
                    replies: 12,
                    lastActivity: "2023-08-02T14:30:00Z",
                },
                {
                    id: "2",
                    title: "DNA Replication Process",
                    author: "Maria Garcia",
                    replies: 8,
                    lastActivity: "2023-08-01T16:45:00Z",
                },
            ],
            upcomingSessions: [
                {
                    id: "1",
                    title: "Cell Biology Review",
                    date: "2023-08-10T18:00:00Z",
                    duration: 60,
                    attendees: 6,
                },
                {
                    id: "2",
                    title: "Genetics Practice Problems",
                    date: "2023-08-15T17:30:00Z",
                    duration: 90,
                    attendees: 4,
                },
            ],
        },
        // ... other study groups
    ]

    const group = studyGroups.find((g) => g.id === id)
    if (!group) return null

    return group
}

export default async function StudyGroupPage({ params }: { params: { id: string } }) {
    const group = await getStudyGroup(params.id)

    if (!group) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <StudyGroupHeader group={group} />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <StudyGroupContent group={group} />
                    </div>
                    <div>
                        <StudyGroupSidebar group={group} />
                    </div>
                </div>
            </main>
        </div>
    )
}

