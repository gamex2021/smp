import { RoleProtected } from "@/components/providers/role-protected";
import { mockUser } from '@/app/config/siteConfig'

export default function DashboardLayout(props: {
    admin: React.ReactNode;
    student: React.ReactNode;
    teacher: React.ReactNode;
    children: React.ReactNode;
}) {
    const role = mockUser.role;
    return (
        <RoleProtected allowedRoles={["admin", "teacher", "student"]}>
            {role === "admin" && props.admin}
            {role === "student" && props.student}
            {role === "teacher" && props.teacher}
        </RoleProtected>
    );
}
