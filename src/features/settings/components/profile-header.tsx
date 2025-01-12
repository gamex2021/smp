import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface ProfileHeaderProps {
    name: string
    email: string
    role: string
}

export function ProfileHeader({ name, email, role }: ProfileHeaderProps) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-[#71B08D]">
                    <AvatarImage src="/images/dummy-user.png" alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 " >
                    <Image src="/images/edit.png" width={100} height={100} alt="edit icon" className="h-5 w-5" />
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-[#11321F]">{name}</h1>

                </div>
                <p className="text-sm text-[#11321F99]">{email}</p>
                <Badge variant="secondary" className="bg-gray-100 text-[#11321F] capitalize">
                    {role}
                </Badge>
            </div>
        </div>
    )
}

