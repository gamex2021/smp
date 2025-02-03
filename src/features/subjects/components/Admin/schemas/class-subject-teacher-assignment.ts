import { z } from "zod";
import type { Id } from "~/_generated/dataModel";

export const teacherAssignmentSchema = z.object({
  search: z.string().optional(),
  selectedClassId: z.string().min(1, "Please select a class"),
  selectedTeacherId: z.string().min(1, "Please select a teacher"),
});

export type TeacherAssignmentValues = z.infer<typeof teacherAssignmentSchema>;

export interface TeacherType {
  _id: Id<"users">;
  name: string;
  email: string;
  image: string;
  bio: string;
  qualifications: string;
}

export interface ClassType {
  _id: Id<"classes">;
  title: string;
  schoolId: string;
}
