"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, FlaskConical, Layers, MessageSquare, Network, Headphones, Lightbulb, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkspaceActionsProps {
    workspaceId: string
}

export default function WorkspaceActions({ workspaceId }: WorkspaceActionsProps) {
    const actions = [
        {
            id: "summaries",
            title: "Generate Summaries",
            description: "Create concise summaries of your documents",
            icon: <FileText className="h-10 w-10 text-primary" />,
            href: `/learn/tools/summaries?workspace=${workspaceId}`,
        },
        {
            id: "flashcards",
            title: "Create Flashcards",
            description: "Generate study flashcards from your content",
            icon: <Layers className="h-10 w-10 text-primary" />,
            href: `/learn/tools/flashcards?workspace=${workspaceId}`,
        },
        {
            id: "quizzes",
            title: "Take a Quiz",
            description: "Test your knowledge with AI-generated quizzes",
            icon: <FlaskConical className="h-10 w-10 text-primary" />,
            href: `/learn/tools/quizzes?workspace=${workspaceId}`,
        },
        {
            id: "notes",
            title: "Study Notes",
            description: "Create structured study notes from your documents",
            icon: <BookOpen className="h-10 w-10 text-primary" />,
            href: `/learn/tools/notes?workspace=${workspaceId}`,
        },
        {
            id: "mindmaps",
            title: "Create Mind Maps",
            description: "Visualize concepts and connections",
            icon: <Network className="h-10 w-10 text-primary" />,
            href: `/learn/tools/mindmaps?workspace=${workspaceId}`,
        },
        {
            id: "chat",
            title: "Chat with AI Tutor",
            description: "Ask questions about your documents",
            icon: <MessageSquare className="h-10 w-10 text-primary" />,
            href: `/learn/tools/chat?workspace=${workspaceId}`,
        },
        {
            id: "tts",
            title: "Text to Speech",
            description: "Listen to your documents and notes",
            icon: <Headphones className="h-10 w-10 text-primary" />,
            href: `/learn/tools/tts?workspace=${workspaceId}`,
        },
        {
            id: "questions",
            title: "Generate Questions",
            description: "Create practice questions from your content",
            icon: <Lightbulb className="h-10 w-10 text-primary" />,
            href: `/learn/tools/questions?workspace=${workspaceId}`,
        },
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Learning Tools</CardTitle>
            </CardHeader>
            <CardContent>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {actions.map((action) => (
                        <motion.div key={action.id} variants={item}>
                            <Link href={action.href}>
                                <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className="mb-2 mt-2">{action.icon}</div>
                                        <h3 className="font-medium group-hover:text-primary transition-colors">{action.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    )
}

