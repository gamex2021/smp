import { type Id } from "~/_generated/dataModel";

export interface Teacher {
  _id: Id<"users">;
  name?: string;
  assignedClasses: (
    | {
        _id: Id<"classes">;
        _creationTime: number;
        description?: string;
        isActive?: boolean;
        capacity?: number;
        schoolId: Id<"schools">;
        title: string;
      }
    | null
    | undefined
  )[];
  subjects: ({
    _id: Id<"subjects">;
    _creationTime: number;
    name: string;
    schoolId: Id<"schools">;
    description: string;
    isActive: boolean;
    originalName: string;
    category: string;
    isCore: boolean;
  } | null)[];
  email: string;
  qualifications? : string;
  bio? : string;
  phone? : string;
  gender?: string;
  image?: string | null;
}
