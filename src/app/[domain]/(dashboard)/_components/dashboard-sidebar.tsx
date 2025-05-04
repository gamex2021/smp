'use client'

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
import {
    BarChart,
    BookOpen,
    GraduationCap,
    Presentation,
    LogOut,
    MessageSquare,
    School,
    Users,
    MenuIcon,
    Rss,
    Banknote,
    Settings,
    BookAIcon,
    IdCardIcon
} from 'lucide-react'
import { RxDashboard } from 'react-icons/rx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '~/_generated/api'
import { useAuthActions } from '@convex-dev/auth/react'
import { toast } from 'sonner'

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
    Settings,
    BookAIcon,
    IdCardIcon
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const user = useQuery(api.queries.user.currentUser)
    const { signOut } = useAuthActions()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await signOut()
            toast.success('Logged out successfully')
            router.push('/sign-in')
        } catch (error) {
            console.error('Logout error:', error)
            toast.error('Failed to log out. Please try again.')
        }
    }

    return (
        <SidebarProvider className="w-fit" defaultOpen>
            <Sidebar
                role="complementary"
                aria-label="Application sidebar"
                id="dashboard-sidebar"
            >
                <SidebarHeader className="border-b px-6">
                    <div className="flex h-[60px] items-center">
                        <span className="text-lg font-bold text-white">
                            {user?.schoolName ?? 'TSX'}
                        </span>
                        {/* if this toggles sidebar, wrap in button */}
                        <button
                            aria-label="Toggle sidebar"
                            aria-controls="dashboard-sidebar"
                            aria-expanded="true"
                            className="ml-auto"
                        >
                            <MenuIcon
                                className="h-6 w-6 cursor-pointer text-white"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <nav
                        role="navigation"
                        aria-label="Primary"
                        className="grid gap-1 px-2 mt-[50px]"
                    >
                        {mockNavItems.map((item) => {
                            const Icon = icons[item.icon as keyof typeof icons]
                            const isActive = pathname === item.href

                            if (!user?.role || !item.roles.includes(user.role)) return null

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                                        'hover:bg-[#2E8B5766]',
                                        'text-[#ffffffd7]',
                                        isActive && 'bg-[#2E8B5766] text-white'
                                    )}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {Icon ? (
                                        <Icon
                                            className={cn('h-4 w-4', isActive && 'text-white')}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span>Invalid icon</span>
                                    )}
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </SidebarContent>

                <SidebarFooter className="p-2">
                    <div className="grid gap-1 text-[#ffffffd7]">
                        <Button
                            onClick={handleLogout}
                            type="button"
                            variant="ghost"
                            className="w-full justify-start gap-3 px-3 hover:bg-[#2E8B5766] hover:text-[#ffffffd7]"
                            aria-label="Log out"
                        >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Log out
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
}
