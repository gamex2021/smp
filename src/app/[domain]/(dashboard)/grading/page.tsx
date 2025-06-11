import { RoleProtected } from "@/components/providers/role-protected";
import { Grading } from "@/features/grading";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "My Grades | Student Portal",
  description: "View your academic performance and grades",
};

export default function GradingPage() {
  return (
    <RoleProtected allowedRoles={["ADMIN"]}>
      <Grading />
    </RoleProtected>
  );
}
