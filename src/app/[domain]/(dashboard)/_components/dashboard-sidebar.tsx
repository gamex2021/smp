/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { mockNavItems } from '@/app/config/siteConfig'
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { BarChart, BookOpen, GraduationCap, Presentation, LogOut, MessageSquare, School, Users, MenuIcon, Rss, Banknote, Settings } from 'lucide-react'
import { RxDashboard } from "react-icons/rx";
import Link from 'next/link'


interface DashboardSidebarProps {
    user: {
        role: string
    }
    school: {
        name: string
    }
}

const icons = {
    RxDashboard,
    Presentation,
    BookOpen,
    GraduationCap,
    Users,
    School,
    BarChart,
    MessageSquare,
    Rss,
    Banknote,
    Settings
}

export function DashboardSidebar({ user, school }: DashboardSidebarProps) {
    return (
        <SidebarProvider className='w-fit' defaultOpen>
            <Sidebar >
                <SidebarHeader className="border-b px-6">
                    <div className="flex h-[60px] items-center">
                        <span className="text-lg font-bold text-white">{school.name}</span>

                        <MenuIcon className="h-6 w-6 ml-auto cursor-pointer text-white" />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <nav className="grid gap-1 px-2 mt-[50px]">
                        {mockNavItems.map((item) => {
                            const Icon = icons[item.icon as keyof typeof icons]
                            return item.roles.includes(user.role) ? (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#2E8B5766]',
                                        'text-[#ffffffd7]'
                                    )}
                                >
                                    {icons[item.icon as keyof typeof icons] ? (
                                        <Icon className="h-4 w-4" />
                                    ) : (
                                        <span>Invalid icon</span>
                                    )}
                                    {item.title}
                                </Link>
                            ) : null
                        })}
                    </nav>
                </SidebarContent>
                <SidebarFooter className="p-2 ">
                    <div className="grid gap-1 text-[#ffffffd7]">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 px-3 hover:bg-[#2E8B5766] hover:text-[#ffffffd7]"
                        >
                            <LogOut className="h-4 w-4 " />
                            Log out
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
}

