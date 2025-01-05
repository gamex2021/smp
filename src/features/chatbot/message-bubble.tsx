import { cn } from "@/lib/utils"
import { type ChatMessage } from "./types/chat"


interface MessageBubbleProps {
    message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user'

    return (
        <div className={cn(
            "flex w-full",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] px-4 py-2 text-sm",
                isUser ? "bg-[#B4D5C3] text-[#11321F] rounded-t-[12px] rounded-bl-[12px]" : "bg-[#2E8B57] text-white rounded-t-[12px] rounded-br-[12px]"
            )}>
                {message.content}
            </div>
        </div>
    )
}

