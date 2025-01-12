import { mockUser } from '@/app/config/siteConfig'
import { RoleProtected } from '@/components/providers/role-protected'


export default function DashboardLayout(props: {
    admin: React.ReactNode
    student: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    const role = mockUser.role;

    // for the subjects route, all the roles have that route
    return (
        <RoleProtected allowedRoles={['admin', 'teacher', 'student']}>
            {role === "admin" && props.admin}
            {role === "student" && props.student}
            {role === "teacher" && props.teacher}
        </RoleProtected>
    )
}

