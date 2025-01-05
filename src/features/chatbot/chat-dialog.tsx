'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Smile } from 'lucide-react'

import Image from 'next/image'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { MessageBubble } from './message-bubble'
import { type ChatMessage } from './types/chat'

interface ChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            content: 'Hello, How can I help you today?\nLet me know.',
            role: 'assistant',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')

        // TODO: Add AI response logic here
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden bg-[#E8F4F0]">
                <DialogHeader className="bg-[#2E8B57] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-white text-xl font-medium">ChatBot</DialogTitle>
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-emerald-600"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-10 w-10" />
                        </Button> */}
                    </div>
                </DialogHeader>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-[400px] max-h-[600px]">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                    onSubmit={handleSend}
                    className="border-t bg-[#11321F33] m-4 rounded-full p-2 flex items-center gap-2"
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-emerald-600"
                    >
                        <Smile className="h-[30px] w-[32px]" />
                    </Button>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Send a message......"
                        className="flex-1 border-0 focus-visible:ring-0  placeholder:text-[#11321F99] focus-visible:ring-offset-0"
                    />
                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-emerald-600 hover:text-emerald-700"
                        disabled={!input.trim()}
                    >
                        <Image src="/images/sticker.png" alt="sticker" className="h-7 w-7" width={200} height={200} />
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

