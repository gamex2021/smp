import { Suspense } from "react"
import { mockSchool, mockUser } from "@/app/config/siteConfig"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import Chatbot from "@/features/chatbot/chatbot"
import type React from "react" // Added import for React
import { DomainProvider } from "@/context/DomainContext"


type Params = Promise<{ domain: string }>;

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Params
}) {
    const { domain } = await params

    return (
        <DomainProvider domain={domain}>
            <div className="flex min-h-screen bg-background">
                <DashboardSidebar user={mockUser} school={mockSchool} />
                <div className="flex-1 ">
                    <DashboardHeader user={mockUser} />
                    <main className="flex-1 space-y-4">
                        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>

                        {/* the chat bot */}
                        <Chatbot />
                    </main>
                </div>
            </div>
        </DomainProvider>
    )
}

