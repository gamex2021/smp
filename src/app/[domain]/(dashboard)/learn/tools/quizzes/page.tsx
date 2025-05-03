import QuizzesTool from "@/features/learn/components/Tools/Quizzes/quizzes-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"
import { type Id } from "~/_generated/dataModel"

export const metadata: Metadata = {
    title: "Quizzes | AI Study Assistant",
    description: "Test your knowledge with AI-generated quizzes",
}

export default function QuizzesPage({ searchParams }: { searchParams: { workspace?: Id<"workspace"> } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Quizzes"
                description="Test your knowledge with AI-generated quizzes"
                icon="quizzes"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <QuizzesTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

