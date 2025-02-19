"use client";
import { mockUser } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'
import { useQuery } from 'convex/react';
import { api } from '~/_generated/api';


export default function DashboardLayout(props: {
    admin: React.ReactNode
    student: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    // GET THE USER USING THE QUERY CONVEX OPTION
    const user = useQuery(api.queries.user.currentUser);

    // for the subjects route, all the roles have that route
    return (
        <RoleProtected allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']}>
            {user?.role === "ADMIN" && props.admin}
            {user?.role === "STUDENT" && props.student}
            {user?.role === "TEACHER" && props.teacher}
        </RoleProtected>
    )
}

