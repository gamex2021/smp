"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, BrainCircuit, Sparkles, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AIChatTutor() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi there! I'm your AI study assistant. How can I help you with your learning today?",
        },
    ])
    const [input, setInput] = useState("")
    const [isExpanded, setIsExpanded] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const handleMaximize = () => {
        if (isExpanded) {
            setIsExpanded(false)
        } else {
            setIsExpanded(true)
        }
    }

    const handleSendMessage = () => {
        if (!input.trim()) return

        // Add user message
        setMessages([...messages, { role: "user", content: input }])
        setInput("")

        // Simulate AI typing
        setIsTyping(true)

        // Simulate AI response after a delay
        setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I'd be happy to help with that! What specific topic or document would you like me to explain?",
                },
            ])
        }, 1500)
    }

    return (
        <Card className={isExpanded ? "fixed inset-4 z-50 flex flex-col" : ""}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BrainCircuit className="h-5 w-5 text-primary" />
                        <CardTitle>AI Tutor</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleMaximize} className="h-8 w-8">
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className={`space-y-4 ${isExpanded ? "flex-1 overflow-auto" : "h-[300px] overflow-y-auto"}`}>
                <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
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
                                    {message.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
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
            </CardContent>
            <div className="p-4 pt-0">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                    }}
                    className="flex space-x-2"
                >
                    <Input
                        placeholder="Ask about your documents..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </Card>
    )
}

