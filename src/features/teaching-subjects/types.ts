import { type Id } from "~/_generated/dataModel";

export interface ClassroomOverviewProps {
  subject: {
    _id: Id<"subjects">;
    _creationTime: number;
    searchableText?: string | undefined;
    name: string;
    schoolId: Id<"schools">;
    category: string;
    description: string;
    isActive: boolean;
    originalName: string;
    isCore: boolean;
  };
  classData: {
    _id: Id<"classes">;
    _creationTime: number;
    searchableText?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    capacity?: number | undefined;
    title: string;
    schoolId: Id<"schools">;
  };
  subjectTeacherId: Id<"subjectTeachers">;
}