import ToolHeader from "@/features/learn/components/Tools/tool-header"
import TTSTool from "@/features/learn/components/Tools/Tts/tts-tool"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Text to Speech | AI Study Assistant",
    description: "Convert your study materials to audio",
}

export default function TTSPage({ searchParams }: { searchParams: { workspace?: string } }) {
    const workspaceId = searchParams.workspace

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <ToolHeader
                title="Text to Speech"
                description="Convert your study materials to audio"
                icon="tts"
                workspaceId={workspaceId}
            />
            <main className="container mx-auto px-4 py-8">
                <TTSTool workspaceId={workspaceId} />
            </main>
        </div>
    )
}

