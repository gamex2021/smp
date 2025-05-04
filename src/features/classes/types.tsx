import { type Id } from "~/_generated/dataModel";

export interface Classes {
    _id: Id<"classes">;
    _creationTime: number;
    searchableText?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    capacity?: number | undefined;
    schoolId: Id<"schools">
    title: string;
}