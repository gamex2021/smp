import { RoleProtected } from '@/components/providers/role-protected'

const dummyUser = {
    role: 'admin' //example current role of the user
}
export default function DashboardLayout(props: {
    admin: React.ReactNode
    student: React.ReactNode
    teacher: React.ReactNode
    children: React.ReactNode
}) {
    const role = dummyUser.role

    // for the subjects route, all the roles have that route
    return (
        <RoleProtected allowedRoles={['admin', 'teacher', 'student']}>
            {role === "admin" && props.admin}
            {role === "student" && props.student}
            {role === "teacher" && props.teacher}
        </RoleProtected>
    )
}

