"use client";
import { RoleProtected } from '@/components/providers/role-protected';
import { useQuery } from 'convex/react';
import { usePathname } from 'next/navigation';
import { api } from '~/_generated/api';


export default function DashboardLayout({
    admin,
    teacher,
    children,
}: {
    admin: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    // GET THE USER USING THE QUERY CONVEX OPTION
    const user = useQuery(api.queries.user.currentUser);
    const pathname = usePathname();

    // 👀 detect if we’re on a dynamic sub-route like /dashboard/123
    const isDetailRoute = pathname?.split("/").length > 2;
    // for the students route, only the admin and teacher has that route
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER']}>
            {isDetailRoute ? (
                children
            ) : user?.role === "ADMIN" ? (
                admin
            ) : user?.role === "TEACHER" && (
                teacher
            )}
        </RoleProtected>
    )
}

