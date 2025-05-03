"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  FileText,
  FlaskConical,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Layers,
  Headphones,
  Network,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LearningTools() {
  const [activeTab, setActiveTab] = useState("all")

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

  const tools = [
    {
      id: "summaries",
      title: "AI Summaries",
      description: "Get concise summaries of your documents",
      icon: <FileText className="h-10 w-10 text-primary" />,
      category: "ai",
      href: "/learn/tools/summaries",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Create and study with interactive flashcards",
      icon: <Layers className="h-10 w-10 text-primary" />,
      category: "study",
      href: "/learn/tools/flashcards",
    },
    {
      id: "quizzes",
      title: "Quizzes",
      description: "Test your knowledge with AI-generated quizzes",
      icon: <FlaskConical className="h-10 w-10 text-primary" />,
      category: "assessment",
      href: "/learn/tools/quizzes",
    },
    {
      id: "notes",
      title: "Study Notes",
      description: "AI-generated structured study notes",
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      category: "ai",
      href: "/learn/tools/notes",
    },
    {
      id: "mindmaps",
      title: "Mind Maps",
      description: "Visualize concepts and connections",
      icon: <Network className="h-10 w-10 text-primary" />,
      category: "visual",
      href: "/learn/tools/mindmaps",
    },
    {
      id: "chat",
      title: "AI Tutor",
      description: "Chat with an AI tutor about your documents",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      category: "ai",
      href: "/learn/tools/chat",
    },
    {
      id: "tts",
      title: "Text to Speech",
      description: "Listen to your documents and notes",
      icon: <Headphones className="h-10 w-10 text-primary" />,
      category: "accessibility",
      href: "/learn/tools/tts",
    },
    {
      id: "questions",
      title: "Question Generator",
      description: "Generate practice questions from your content",
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      category: "assessment",
      href: "/learn/tools/questions",
    },
  ]

  const filteredTools = activeTab === "all" ? tools : tools.filter((tool) => tool.category === activeTab)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Learning Tools</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/learn/tools">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore All
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ai">AI Tools</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
          key={activeTab}
        >
          {filteredTools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <Link href={tool.href} key={tool.id}>
                <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
                  <CardHeader className="p-4 pb-2">
                    <div className="mb-2">{tool.icon}</div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                      Open Tool
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Tabs>
    </section>
  )
}

