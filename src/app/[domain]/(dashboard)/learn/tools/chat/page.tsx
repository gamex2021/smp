import ChatTool from "@/features/learn/components/Tools/Chat/chat-tool"
import ToolHeader from "@/features/learn/components/Tools/tool-header"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import type { Metadata } from "next"
import { api } from "~/_generated/api"
import { type Id } from "~/_generated/dataModel"

export const metadata: Metadata = {
    title: "AI Chat Tutor | AI Study Assistant",
    description: "Chat with an AI tutor about your study materials",
}

export default async function ChatPage({ searchParams }: { searchParams: { workspace?: Id<"workspace"> } }) {
    const workspaceId = searchParams.workspace
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="AI Chat Tutor"
                description="Chat with an AI tutor about your study materials"
                icon="chat"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-3">
                <ChatTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

