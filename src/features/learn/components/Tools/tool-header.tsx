"use client"

import Link from "next/link"
import {
  ChevronLeft,
  Layers,
  FileText,
  FlaskConical,
  BookOpen,
  MessageSquare,
  Network,
  Headphones,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToolHeaderProps {
  title: string
  description: string
  icon: string
  workspaceId?: string
}

export default function ToolHeader({ title, description, icon, workspaceId }: ToolHeaderProps) {
  const getIcon = () => {
    switch (icon) {
      case "summaries":
        return <FileText className="h-6 w-6 text-primary" />
      case "flashcards":
        return <Layers className="h-6 w-6 text-primary" />
      case "quizzes":
        return <FlaskConical className="h-6 w-6 text-primary" />
      case "notes":
        return <BookOpen className="h-6 w-6 text-primary" />
      case "mindmaps":
        return <Network className="h-6 w-6 text-primary" />
      case "chat":
        return <MessageSquare className="h-6 w-6 text-primary" />
      case "tts":
        return <Headphones className="h-6 w-6 text-primary" />
      case "questions":
        return <Lightbulb className="h-6 w-6 text-primary" />
      default:
        return <FileText className="h-6 w-6 text-primary" />
    }
  }

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 ">
        <div className="flex items-center ">
          <Button variant="ghost" size="icon" asChild>
            <Link href={workspaceId ? `/learn/workspace/${workspaceId}` : "/learn"}>
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
              {workspaceId && (
                <>
                  <li className="mx-2">/</li>
                  <li>
                    <Link href={`/learn/workspace/${workspaceId}`} className="hover:text-foreground">
                      Workspace
                    </Link>
                  </li>
                </>
              )}
              <li className="mx-2">/</li>
              <li className="text-foreground font-medium">{title}</li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

