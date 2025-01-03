import Link from 'next/link'
import { cn } from '@/lib/utils'
import { BarChart, BookOpen, GraduationCap, Home, LayoutDashboard, LogOut, MessageSquare, School, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
} from '@/components/ui/sidebar'
import { mockNavItems } from '@/app/config/siteConfig'


interface DashboardSidebarProps {
    user: {
        role: string
    }
    school: {
        name: string
    }
}

const icons = {
    Home,
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    School,
    BarChart,
    MessageSquare,
}

export function DashboardSidebar({ user, school }: DashboardSidebarProps) {
    return (
        <SidebarProvider className='w-fit' defaultOpen>
            <Sidebar >
                <SidebarHeader className="border-b px-6">
                    <div className="flex h-[60px] items-center">
                        <span className="text-lg font-bold text-white">{school.name}</span>
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

