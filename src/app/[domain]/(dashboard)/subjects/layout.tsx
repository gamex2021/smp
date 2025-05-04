"use client";
import { mockUser } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { useQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { api } from '~/_generated/api';


export default function DashboardLayout({
    admin,
    student,
    teacher,
    children,
}: {
    admin: React.ReactNode
    student: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    // GET THE USER USING THE QUERY CONVEX OPTION
    const user = useQuery(api.queries.user.currentUser);
    const pathname = usePathname();

    // 👀 detect if we’re on a dynamic sub-route like /dashboard/123
    const isDetailRoute = pathname?.split("/").length > 2;

    console.log("is it", isDetailRoute)

    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            {isDetailRoute ? (
                children
            ) : user?.role === "ADMIN" ? (
                admin
            ) : user?.role === "TEACHER" ? (
                teacher
            ) : user?.role === "STUDENT" && (
                student
            )}
        </RoleProtected>
    )
}

