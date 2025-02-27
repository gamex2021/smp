import { type Id } from "~/_generated/dataModel";

export interface Student {
  _id: Id<"users">;
  name?: string;
  currentClass:
    | {
        _id: Id<"classes">;
        _creationTime: number;
        description?: string;
        isActive?: boolean;
        capacity?: number;
        schoolId: Id<"schools">;
        title: string;
      }
    | undefined
    | null;
  email: string;
  gender?: string;
  phone?: string;
  address?: string;
  guardianPhone?: string;
  guardianName?: string;
  dob?: string;
  image?: string | null;
}
