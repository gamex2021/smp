"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    MessageSquare,
    StickyNote,
    BookOpen,
    Lightbulb,
    Layers,
    ChevronRight,
    ChevronLeft,
    Plus,
    Send,
    Sparkles,
    MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DocumentSidebarProps {
    document: {
        id: string
        title: string
        annotations: Array<{
            id: string
            text: string
            page: number
            position: { x: number; y: number }
            color: string
        }>
    }
}

export default function DocumentSidebar({ document }: DocumentSidebarProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [activeTab, setActiveTab] = useState("chat")
    const [chatInput, setChatInput] = useState("")
    const [noteInput, setNoteInput] = useState("")

    const [chatMessages, setChatMessages] = useState([
        {
            role: "assistant",
            content: `Hi there! I'm your AI study assistant for "${document.title}". How can I help you understand this document?`,
        },
    ])

    const [isTyping, setIsTyping] = useState(false)

    const handleSendMessage = () => {
        if (!chatInput.trim()) return

        // Add user message
        setChatMessages([...chatMessages, { role: "user", content: chatInput }])
        setChatInput("")

        // Simulate AI typing
        setIsTyping(true)

        // Simulate AI response after a delay
        setTimeout(() => {
            setIsTyping(false)
            setChatMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I'd be happy to explain concepts from this document. What specific part would you like me to clarify?",
                },
            ])
        }, 1500)
    }

    const handleAddNote = () => {
        if (!noteInput.trim()) return

        // In a real app, you would save the note to the backend here
        setNoteInput("")
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className={`absolute right-0 top-1/2 z-10 h-12 w-6 -translate-y-1/2 rounded-l-md rounded-r-none border border-r-0 bg-background ${isOpen ? "hidden" : "flex"
                    }`}
                onClick={() => setIsOpen(true)}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 380, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-l bg-background h-full relative"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-1/2 z-10 h-12 w-6 -translate-y-1/2 rounded-r-md rounded-l-none border border-l-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="h-full flex flex-col">
                            <Tabs defaultValue={activeTab} className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-4 p-0 h-12 rounded-none border-b">
                                    <TabsTrigger
                                        value="chat"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="notes"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        <StickyNote className="h-5 w-5" />
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="summary"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        <BookOpen className="h-5 w-5" />
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="flashcards"
                                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        <Layers className="h-5 w-5" />
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                                    <div className="p-3 border-b">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-primary" />
                                            AI Chat Assistant
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Ask questions about this document</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4 space-y-4">
                                        <AnimatePresence initial={false}>
                                            {chatMessages.map((message, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                                    >
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
                                                            {message.content}
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
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                handleSendMessage()
                                            }}
                                            className="flex space-x-2"
                                        >
                                            <Input
                                                placeholder="Ask about this document..."
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button type="submit" size="icon" disabled={!chatInput.trim()}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </TabsContent>

                                <TabsContent value="notes" className="flex-1 flex flex-col p-0 m-0">
                                    <div className="p-3 border-b">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <StickyNote className="h-4 w-4 text-primary" />
                                            Notes & Annotations
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Add notes and highlights to this document</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4">
                                        {document.annotations.length > 0 ? (
                                            <div className="space-y-4">
                                                {document.annotations.map((annotation) => (
                                                    <div
                                                        key={annotation.id}
                                                        className="p-3 rounded-md"
                                                        style={{
                                                            backgroundColor: `${annotation.color}20`,
                                                            borderLeft: `3px solid ${annotation.color}`,
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-medium">Page {annotation.page}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                                <MoreHorizontal className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm">{annotation.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                                <StickyNote className="h-12 w-12 text-muted-foreground mb-2" />
                                                <h3 className="font-medium">No notes yet</h3>
                                                <p className="text-sm text-muted-foreground">Add your first note to this document</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                handleAddNote()
                                            }}
                                            className="space-y-2"
                                        >
                                            <Textarea
                                                placeholder="Add a note..."
                                                value={noteInput}
                                                onChange={(e) => setNoteInput(e.target.value)}
                                                className="resize-none"
                                                rows={3}
                                            />
                                            <div className="flex justify-between">
                                                <div className="flex gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        style={{ backgroundColor: "#ffeb3b20", color: "#ffeb3b" }}
                                                    >
                                                        <div className="h-4 w-4 rounded-full bg-yellow-400" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        style={{ backgroundColor: "#4caf5020", color: "#4caf50" }}
                                                    >
                                                        <div className="h-4 w-4 rounded-full bg-green-500" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        style={{ backgroundColor: "#2196f320", color: "#2196f3" }}
                                                    >
                                                        <div className="h-4 w-4 rounded-full bg-blue-500" />
                                                    </Button>
                                                </div>
                                                <Button type="submit" size="sm" disabled={!noteInput.trim()}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Note
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </TabsContent>

                                <TabsContent value="summary" className="flex-1 flex flex-col p-0 m-0">
                                    <div className="p-3 border-b">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            AI Summary
                                        </h3>
                                        <p className="text-xs text-muted-foreground">AI-generated summary of this document</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles className="h-5 w-5 text-primary" />
                                                <h3 className="font-medium">Key Concepts</h3>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="p-3 rounded-md bg-muted">
                                                    <h4 className="font-medium text-sm">Cell Structure</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        The basic unit of life with various organelles performing specific functions.
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-md bg-muted">
                                                    <h4 className="font-medium text-sm">Cell Membrane</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        A semipermeable barrier that regulates what enters and exits the cell.
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded-md bg-muted">
                                                    <h4 className="font-medium text-sm">Mitochondria</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        The powerhouse of the cell, responsible for cellular respiration and energy production.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-4 mt-6">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <h3 className="font-medium">Document Summary</h3>
                                            </div>

                                            <p className="text-sm">
                                                This document provides a comprehensive overview of cell structure and function, focusing on the
                                                various organelles found within eukaryotic cells and their specific roles. It begins with an
                                                introduction to cell theory and the basic properties of cells, then delves into detailed
                                                descriptions of each organelle including the cell membrane, nucleus, mitochondria, endoplasmic
                                                reticulum, Golgi apparatus, lysosomes, and more.
                                            </p>

                                            <p className="text-sm">
                                                The document also covers cellular processes such as transport mechanisms across the cell
                                                membrane, cellular respiration, and protein synthesis. It concludes with a discussion on cell
                                                specialization and how different cell types are adapted to perform specific functions within
                                                multicellular organisms.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t">
                                        <Button className="w-full">
                                            <Lightbulb className="h-4 w-4 mr-2" />
                                            Generate Study Notes
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="flashcards" className="flex-1 flex flex-col p-0 m-0">
                                    <div className="p-3 border-b">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-primary" />
                                            Flashcards
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Study with AI-generated flashcards</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-4">
                                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                            <Layers className="h-12 w-12 text-muted-foreground mb-2" />
                                            <h3 className="font-medium">No flashcards yet</h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Generate flashcards to help you study this document
                                            </p>
                                            <Button>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Generate Flashcards
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

