"use client";
import { useDomain } from '@/context/DomainContext';


export function ComponentProtector({
    children,
    allowedRoles
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {

    // GET THE USER USING THE QUERY CONVEX OPTION
    const { user } = useDomain()
    // check if the allowed roles include the current user role
    const hasRole = user?.role ? allowedRoles.includes(user.role) : false

    if (user && !hasRole) {
        return null;
    }

    if (!user) {
        return null; // or a loading indicator
    }

    return <>{children}</>
}
