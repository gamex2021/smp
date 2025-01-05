import { RoleProtected } from "@/components/providers/role-protected";

const dummyUser = {
    role: "student", //example current role of the user
};
export default function DashboardLayout(props: {
    admin: React.ReactNode;
    student: React.ReactNode;
    teacher: React.ReactNode;
    children: React.ReactNode;
}) {
    const role = dummyUser.role;
    return (
        <RoleProtected allowedRoles={["admin", "teacher", "student"]}>
            {role === "admin" && props.admin}
            {role === "student" && props.student}
            {role === "teacher" && props.teacher}
        </RoleProtected>
    );
}
