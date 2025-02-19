"use client";
import { useQuery } from 'convex/react';
import { notFound } from 'next/navigation';
import { api } from '~/_generated/api';


export function RoleProtected({
    children,
    allowedRoles
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {

    // GET THE USER USING THE QUERY CONVEX OPTION
    const user = useQuery(api.queries.user.currentUser);
    // check if the allowed roles include the current user role
    const hasRole = user?.role ? allowedRoles.includes(user.role) : false

    if (user && !hasRole) {
        notFound();
        return null;
    }

    if (!user) {
        return null; // or a loading indicator
    }

    return <>{children}</>
}
