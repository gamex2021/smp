import { mockUser } from '@/app/config/siteConfig';
import { RoleProtected } from '@/components/providers/role-protected'


export default function DashboardLayout(props: {
    admin: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    const role = mockUser.role;

    // for the students route, only the admin and teacher has that route
    return (
        <RoleProtected allowedRoles={['admin', 'teacher']}>
            {role === "admin" && props.admin}
            {role === "teacher" && props.teacher}
        </RoleProtected>
    )
}

