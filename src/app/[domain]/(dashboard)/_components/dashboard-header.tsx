import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'
import Image from 'next/image'

interface DashboardHeaderProps {
    user: {
        name: string
        role: string
        avatar: string
    }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 min-h-[75px] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className=" flex h-16 items-center gap-4 px-4">
                <div className="flex items-center justify-end gap-4 w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-8 w-8"
                        aria-label="Notifications"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full flex"
                            >
                                <Image
                                    src={"/images/emma.png"}
                                    alt={user.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            </Button>
                        </DropdownMenuTrigger>

                        <Image
                            src={"/images/emma.png"}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        {/* the name and role */}
                        <div className='item-start flex flex-col'>
                            <h1 className='font-medium text-[14px] text-start leading-[21.84px] text-[#11321F]'>Emmanuel A</h1>
                            <h1 className="font-medium text-[14px] text-start leading-[21.84px] text-[#11321F99]">Role</h1>
                        </div>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

