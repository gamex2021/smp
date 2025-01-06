import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
    message: {
        content: string
        sender: {
            name: string
            avatar: string
        }
    }
    isOwn: boolean
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
    return (
        <div className={cn(
            "flex gap-3",
            isOwn && "flex-row-reverse"
        )}>
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    width={32}
                    height={32}
                    className="object-cover"
                />
            </div>
            <div className={cn(
                "max-w-[70%] px-4 py-2",
                isOwn ? "bg-[#2E8B57] text-white rounded-b-[12px] rounded-tl-[12px] " : "bg-[#cbecda] rounded-b-[12px] rounded-tr-[12px]"
            )}>
                {!isOwn && (
                    <p className="text-sm font-medium text-emerald-600 mb-1">
                        {message.sender.name}
                    </p>
                )}
                <p className="text-sm">{message.content}</p>
            </div>
        </div>
    )
}

