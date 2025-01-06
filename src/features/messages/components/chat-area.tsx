/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Smile, Paperclip, Mic } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatHeader } from './chat-header'
import { ChatMessage } from './chat-message'


interface ChatAreaProps {
    messages: any[]
    currentUser: {
        name: string
        avatar: string
    }
    conversation: {
        name: string
        isTyping: boolean
    }
}

export function ChatArea({ messages, currentUser, conversation }: ChatAreaProps) {
    const [newMessage, setNewMessage] = useState('')

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return
        // Add message sending logic here
        setNewMessage('')
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <ChatHeader conversation={conversation} />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                    const previousMessage = messages[index - 1]
                    const showGroup = !previousMessage || previousMessage.group !== message.group

                    return (
                        <div key={message.id}>
                            {showGroup && (
                                <div className="text-center my-4">
                                    <span className="px-3 py-2 text-sm bg-[#11321F33] text-[#11321F] rounded-[12px]">
                                        {message.group}
                                    </span>
                                </div>
                            )}
                            <ChatMessage
                                message={message}
                                isOwn={message.sender.name === 'You'}
                            />
                        </div>
                    )
                })}
            </div>

            <form onSubmit={handleSend} className="p-2 bg-[#11321F33] m-4 rounded-[20px] border-t">
                <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon">
                        <Smile className="h-5 w-5 text-gray-500" />
                    </Button>
                    <div className="flex-1 rounded-md flex items-center">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Send a message"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Button type="button" variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon">
                        <Mic className="h-5 w-5 text-gray-500" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

