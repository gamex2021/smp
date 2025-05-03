import MindmapsTool from "@/features/learn/components/Tools/Mindmaps/mindmaps-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import type { Metadata } from "next"
export const metadata: Metadata = {
    title: "Mind Maps | AI Study Assistant",
    description: "Create visual mind maps of your study materials",
}

export default function MindmapsPage({ searchParams }: { searchParams: { workspace?: string } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Mind Maps"
                description="Create visual mind maps of your study materials"
                icon="mindmaps"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <MindmapsTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

