"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    BookOpen,
    FileText,
    FlaskConical,
    MessageSquare,
    Network,
    Headphones,
    Lightbulb,
    Layers,
    Search,
    Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ToolsExplorer() {
    const [searchQuery, setSearchQuery] = useState("")

    const tools = [
        {
            id: "summaries",
            title: "AI Summaries",
            description: "Get concise summaries of your documents",
            icon: <FileText className="h-12 w-12 text-primary" />,
            category: "ai",
            features: ["Automatic key point extraction", "Customizable summary length", "Multiple summary styles"],
            href: "/learn/tools/summaries",
        },
        {
            id: "flashcards",
            title: "Flashcards",
            description: "Create and study with interactive flashcards",
            icon: <Layers className="h-12 w-12 text-primary" />,
            category: "study",
            features: ["AI-generated flashcards", "Spaced repetition system", "Progress tracking"],
            href: "/learn/tools/flashcards",
        },
        {
            id: "quizzes",
            title: "Quizzes",
            description: "Test your knowledge with AI-generated quizzes",
            icon: <FlaskConical className="h-12 w-12 text-primary" />,
            category: "assessment",
            features: ["Adaptive questioning", "Multiple question types", "Instant feedback"],
            href: "/learn/tools/quizzes",
        },
        {
            id: "notes",
            title: "Study Notes",
            description: "AI-generated structured study notes",
            icon: <BookOpen className="h-12 w-12 text-primary" />,
            category: "ai",
            features: ["Smart note organization", "Multiple note formats", "Collaborative editing"],
            href: "/learn/tools/notes",
        },
        {
            id: "mindmaps",
            title: "Mind Maps",
            description: "Visualize concepts and connections",
            icon: <Network className="h-12 w-12 text-primary" />,
            category: "visual",
            features: ["AI-powered concept mapping", "Interactive visualization", "Export options"],
            href: "/learn/tools/mindmaps",
        },
        {
            id: "chat",
            title: "AI Tutor",
            description: "Chat with an AI tutor about your documents",
            icon: <MessageSquare className="h-12 w-12 text-primary" />,
            category: "ai",
            features: ["Context-aware responses", "Multiple teaching styles", "24/7 availability"],
            href: "/learn/tools/chat",
        },
        {
            id: "tts",
            title: "Text to Speech",
            description: "Listen to your documents and notes",
            icon: <Headphones className="h-12 w-12 text-primary" />,
            category: "accessibility",
            features: ["Natural voice synthesis", "Multiple voices", "Speed control"],
            href: "/learn/tools/tts",
        },
        {
            id: "questions",
            title: "Question Generator",
            description: "Generate practice questions from your content",
            icon: <Lightbulb className="h-12 w-12 text-primary" />,
            category: "assessment",
            features: ["Multiple question types", "Difficulty levels", "Answer explanations"],
            href: "/learn/tools/questions",
        },
    ]

    const filteredTools = tools.filter(
        (tool) =>
            tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

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
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tools..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Tools</TabsTrigger>
                    <TabsTrigger value="ai">AI Tools</TabsTrigger>
                    <TabsTrigger value="study">Study</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="visual">Visual</TabsTrigger>
                    <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {filteredTools.map((tool) => (
                            <motion.div key={tool.id} variants={item}>
                                <Link href={tool.href}>
                                    <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/50">
                                        <CardHeader>
                                            <div className="mb-4">{tool.icon}</div>
                                            <CardTitle className="flex items-center gap-2">
                                                {tool.title}
                                                {tool.category === "ai" && <Sparkles className="h-4 w-4 text-primary" />}
                                            </CardTitle>
                                            <CardDescription>{tool.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                {tool.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>

                {["ai", "study", "assessment", "visual", "accessibility"].map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                        <motion.div
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {filteredTools
                                .filter((tool) => tool.category === category)
                                .map((tool) => (
                                    <motion.div key={tool.id} variants={item}>
                                        <Link href={tool.href}>
                                            <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/50">
                                                <CardHeader>
                                                    <div className="mb-4">{tool.icon}</div>
                                                    <CardTitle className="flex items-center gap-2">
                                                        {tool.title}
                                                        {tool.category === "ai" && <Sparkles className="h-4 w-4 text-primary" />}
                                                    </CardTitle>
                                                    <CardDescription>{tool.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                                        {tool.features.map((feature, index) => (
                                                            <li key={index} className="flex items-center gap-2">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

