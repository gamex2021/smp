import { type Id } from "~/_generated/dataModel";

export interface Subject {
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
}
