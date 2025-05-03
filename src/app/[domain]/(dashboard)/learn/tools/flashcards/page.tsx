import FlashcardsTool from "@/features/learn/components/Tools/Flashcards/flashcards-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"
import { type Id } from "~/_generated/dataModel"

export const metadata: Metadata = {
    title: "Flashcards | AI Study Assistant",
    description: "Create and study with AI-generated flashcards",
}

export default function FlashcardsPage({ searchParams }: { searchParams: { workspace?: Id<"workspace"> } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Flashcards"
                description="Create and study with AI-generated flashcards"
                icon="flashcards"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <FlashcardsTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

