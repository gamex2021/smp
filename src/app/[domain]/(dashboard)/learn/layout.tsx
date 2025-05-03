"use client";
import { RoleProtected } from "@/components/providers/role-protected";

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {

    return (
        <RoleProtected allowedRoles={["STUDENT"]} >
            <div className="px-2 py-2">
                {children}
            </div>
        </RoleProtected>
    );
}
