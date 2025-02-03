import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
// create a subject
export const createSubject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    schoolId: v.id("schools"),
    classes: v.optional(v.array(v.id("classes"))),
    isCore: v.boolean(),
  },
  handler: async (ctx, args) => {
    // check if the name exist, subject names must be unique
    const findSubject = await ctx.db
      .query("subjects")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect();

    if (findSubject?.length > 0) {
      throw new Error("Subject already exist");
    }

    const subjectId = await ctx.db.insert("subjects", {
      name: args.name,
      originalName: args.name, // Same as name for custom subjects
      description: args.description,
      category: args.category,
      schoolId: args.schoolId,
      isCore: args.isCore,
      isActive: true,
    });

    if (args?.classes && args?.classes.length > 0) {
      await Promise.all(
        args.classes.map(async (assignedClass) => {
          return await ctx.runMutation(internal.mutations.subject.createSTC, {
            classId: assignedClass,
            subjectId: subjectId,
            schoolId: args.schoolId,
          });
        }),
      );
    }

    return subjectId;
  },
});

// Update a subject
export const updateSubject = mutation({
  args: {
    subjectId: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const subject = await ctx.db.get(args.subjectId);
    if (!subject) {
      throw new Error("Subject not found");
    }

    await ctx.db.patch(args.subjectId, {
      name: args.name,
      ...(args.description && { description: args.description }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
    });
  },
});

// add to subject class and teacher conjunction
export const createSTC = internalMutation({
  args: {
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    //  verify the classId belongs to the school
    const schoolclass = await ctx.db.get(args.classId);
    if (!schoolclass || schoolclass.schoolId !== args.schoolId) {
      throw new Error("Invalid class");
    }

    return await ctx.db.insert("subjectTeachers", {
      classId: args.classId,
      subjectId: args.subjectId,
      schoolId: args.schoolId,
    });
  },
});

// assign a teacher to a subject in the class
export const UpdateSubjectClassTeachers = mutation({
  args: {
    teacherId: v.id("users"),
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
  },
  handler: async (ctx, args) => {
    const { teacherId, subjectId, classId } = args;

    // Check if the relationship already exists
    const existingRelation = await ctx.db
      .query("subjectTeachers")
      .withIndex("by_subject_and_class", (q) =>
        q.eq("subjectId", subjectId).eq("classId", classId),
      )
      .first();

    if (!existingRelation) {
      return null;
    }

    // Create new relationship
    return await ctx.db.patch(existingRelation._id, {
      teacherId,
    });
  },
});
