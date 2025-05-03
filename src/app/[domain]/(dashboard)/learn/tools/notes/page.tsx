import NotesTool from "@/features/learn/components/Tools/Notes/notes-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Study Notes | AI Study Assistant",
    description: "Create and organize AI-generated study notes",
}

export default function NotesPage({ searchParams }: { searchParams: { workspace?: string } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Study Notes"
                description="Create and organize AI-generated study notes"
                icon="notes"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <NotesTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

