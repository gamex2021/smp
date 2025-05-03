"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Send, Sparkles, Copy, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type Id } from "~/_generated/dataModel"
import { useQueries, useQuery } from "convex/react"
import { api } from "~/_generated/api"
import { z } from "zod"
import { toast } from "sonner"
import { useChat, type Message } from "ai/react"
import { generateDocumentChat } from "@/app/[domain]/actions/generate-chat"

interface ChatToolProps {
  workspaceId?: Id<"workspace">
}


type Chunk = {
  id: Id<"documentChunk">;
  title: string | undefined;
  content: string | undefined;
  page: number | undefined;
}

export default function ChatTool({ workspaceId }: ChatToolProps) {

  // get the workspace
  const workspace = useQuery(api.queries.workspace.getWorkspaceById, workspaceId ? {
    workspaceId
  } : "skip")

  // get and initialise the document

  const documents = useQuery(api.queries.workspace.getDocmentList, workspace?._id ? {
    workspaceId: workspace?._id
  } : "skip")

  const [isTyping, setIsTyping] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Id<"document"> | null>(null)
  const [relevantArtifacts, setRelevantArtifacts] = useState<Chunk[]>([])
  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hi! I'm your AI study assistant. I can help you understand your study materials and answer any questions you have. What would you like to learn about?",
      },
    ],
    onFinish: (message) => {
      setIsTyping(false);
      console.log("this s the message", message)
    },
  })


  // handle sending the message
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!input.trim()) return

    // Add user message
    setIsTyping(true);
    if (selectedDocument) {
      try {
        const context = await generateDocumentChat(input, selectedDocument)

        handleSubmit(e, {
          body: {
            context: context,
          },
        });
      } catch (error) {
        console.error("Error generating document chat:", error)
        toast.error("Failed to generate document chat")
        setIsTyping(false)
      }
    }

  }

  return (
    <div className="w-full mx-auto">
      <Card className="h-[calc(100vh-12rem)]">
        <div className="flex h-full">
          <div className="w-64 border-r p-4 flex flex-col">
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chat Settings</DialogTitle>
                    <DialogDescription>Customize your chat experience</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI Personality</label>
                      <Select defaultValue="tutor">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tutor">Tutor</SelectItem>
                          <SelectItem value="expert">Subject Expert</SelectItem>
                          <SelectItem value="socratic">Socratic Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Response Style</label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* this is the documents uploaded to the workspace */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Study Materials</label>
                <Select value={selectedDocument ?? undefined} onValueChange={(e: Id<"document">) => setSelectedDocument(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      documents?.map((document) => (
                        <SelectItem key={document?._id} value={document?._id}>{document?.title}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Suggested Topics</h3>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Cell Structure
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  DNA Replication
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Protein Synthesis
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className={message.role === "assistant" ? "bg-primary/10 text-primary" : ""}>
                        {message.role === "assistant" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              <Sparkles className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback>You</AvatarFallback>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                      >
                        <div className="prose dark:prose-invert">{message.content}</div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Copy className="h-4 w-4" />
                            </Button>
                            {selectedDocument && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="h-3 w-3" />
                                Reference: Cell Biology Chapter 1
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="bg-primary/10 text-primary">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-4 bg-muted flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t">
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!selectedDocument) {
                    toast.error("Please select a document")
                  } else {
                    await handleSendMessage(e)
                  }
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask anything about your study materials..."
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

