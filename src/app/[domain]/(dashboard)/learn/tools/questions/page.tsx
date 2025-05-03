import QuestionsTool from "@/features/learn/components/Tools/Questions/questions-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"


export const metadata: Metadata = {
    title: "Question Generator | AI Study Assistant",
    description: "Generate practice questions from your study materials",
}

export default function QuestionsPage({ searchParams }: { searchParams: { workspace?: string } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Question Generator"
                description="Generate practice questions from your study materials"
                icon="questions"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <QuestionsTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

