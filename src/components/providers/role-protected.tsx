import { mockUser } from '@/app/config/siteConfig';
import { notFound } from 'next/navigation'


export function RoleProtected({
    children,
    allowedRoles
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {

    // check if the allowed roles include the current user role
    const hasRole = allowedRoles.includes(mockUser.role)

    if (!hasRole) {
        notFound()
    }

    return <>{children}</>
}
