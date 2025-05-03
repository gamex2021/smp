import type { Metadata } from "next"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ToolsExplorer from "@/features/learn/components/Tools/tools-explorer"

export const metadata: Metadata = {
    title: "Learning Tools | AI Study Assistant",
    description: "Explore all available learning tools",
}

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <header className="bg-background border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center mb-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/learn">
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <nav className="ml-2 text-sm text-muted-foreground">
                            <ol className="flex items-center">
                                <li>
                                    <Link href="/learn" className="hover:text-foreground">
                                        Learn
                                    </Link>
                                </li>
                                <li className="mx-2">/</li>
                                <li className="text-foreground font-medium">Learning Tools</li>
                            </ol>
                        </nav>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">Learning Tools</h1>
                        <p className="text-muted-foreground">Explore our collection of AI-powered learning tools</p>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <ToolsExplorer />
            </main>
        </div>
    )
}

