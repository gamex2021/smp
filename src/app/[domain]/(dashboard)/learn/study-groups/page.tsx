import StudyGroupsHeader from "@/features/learn/components/StudyGroups/study-groups-header"
import StudyGroupsList from "@/features/learn/components/StudyGroups/study-groups-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Study Groups | AI Study Assistant",
    description: "Join or create study groups to collaborate with other students",
}

export default async function StudyGroupsPage() {
    // This would be a server-side data fetch in a real implementation
    const studyGroups = [
        {
            id: "1",
            name: "Biology Study Group",
            description: "A group for discussing biology concepts and preparing for exams",
            members: 8,
            nextSession: "2023-08-10T18:00:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Cell Biology", "Genetics", "Ecology"],
            isJoined: true,
        },
        {
            id: "2",
            name: "History Enthusiasts",
            description: "Discussing historical events and their impact on modern society",
            members: 12,
            nextSession: "2023-08-12T17:30:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Ancient Civilizations", "World Wars", "Modern History"],
            isJoined: true,
        },
        {
            id: "3",
            name: "Calculus Masters",
            description: "Advanced calculus problem solving and theory discussions",
            members: 6,
            nextSession: "2023-08-15T19:00:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Integration", "Differentiation", "Series"],
            isJoined: false,
        },
        {
            id: "4",
            name: "Physics Club",
            description: "Exploring the fundamental laws of the universe",
            members: 10,
            nextSession: "2023-08-11T16:00:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Mechanics", "Electromagnetism", "Quantum Physics"],
            isJoined: false,
        },
        {
            id: "5",
            name: "Literature Circle",
            description: "Analyzing classic and contemporary literature",
            members: 15,
            nextSession: "2023-08-14T18:30:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Classic Novels", "Poetry", "Modern Fiction"],
            isJoined: false,
        },
        {
            id: "6",
            name: "Computer Science Hub",
            description: "Programming, algorithms, and computer science theory",
            members: 20,
            nextSession: "2023-08-13T20:00:00Z",
            avatar: "/placeholder.svg?height=40&width=40",
            topics: ["Algorithms", "Data Structures", "Web Development"],
            isJoined: false,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <StudyGroupsHeader />
            <main className="container mx-auto px-4 py-8">
                <StudyGroupsList studyGroups={studyGroups} />
            </main>
        </div>
    )
}

