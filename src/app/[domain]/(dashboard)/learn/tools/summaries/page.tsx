import SummariesTool from "@/features/learn/components/Tools/Summaries/summaries-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"
import { type Id } from "~/_generated/dataModel"

export const metadata: Metadata = {
    title: "AI Summaries | AI Study Assistant",
    description: "Get concise AI-generated summaries of your documents",
}

export default function SummariesPage({ searchParams }: { searchParams: { workspace?: Id<"workspace"> } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="AI Summaries"
                description="Get concise AI-generated summaries of your documents"
                icon="summaries"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <SummariesTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

