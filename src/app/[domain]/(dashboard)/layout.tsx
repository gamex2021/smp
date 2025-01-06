import { mockSchool, mockUser } from "@/app/config/siteConfig"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import Chatbot from "@/features/chatbot/chatbot"


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar user={mockUser} school={mockSchool} />
            <div className="flex-1 ">
                <DashboardHeader user={mockUser} />
                <main className="flex-1 space-y-4">
                    {children}

                    {/* the chat bot */}
                    <Chatbot />
                </main>
            </div>
        </div>
    )
}

