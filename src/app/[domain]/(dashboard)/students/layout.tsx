"use client";
import { mockUser } from '@/app/config/siteConfig';
import { RoleProtected } from '@/components/providers/role-protected'
import { useQuery } from 'convex/react';
import { api } from '~/_generated/api';


export default function DashboardLayout(props: {
    admin: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    // GET THE USER USING THE QUERY CONVEX OPTION
    const user = useQuery(api.queries.user.currentUser);

    // for the students route, only the admin and teacher has that route
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER']}>
            {user?.role === "ADMIN" && props.admin}
            {user?.role === "TEACHER" && props.teacher}
        </RoleProtected>
    )
}

