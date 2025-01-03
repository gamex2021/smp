import { notFound } from 'next/navigation'


const dummyUser = {
    role: 'admin' //example current role of the user
}

export function RoleProtected({
    children,
    allowedRoles
}: {
    children: React.ReactNode
    allowedRoles: string[]
}) {

    // check if the allowed roles include the current user role
    const hasRole = allowedRoles.includes(dummyUser.role)

    if (!hasRole) {
        notFound()
    }

    return <>{children}</>
}
