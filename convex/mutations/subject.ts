import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
// create a subject
export const createSubject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    categoryId: v.id("subjectCategories"),
    schoolId: v.id("schools"),
    classes: v.optional(v.array(v.id("classes"))),
    isCore: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Verify the category belongs to the school
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.schoolId !== args.schoolId) {
      throw new Error("Invalid category");
    }

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
      categoryId: args.categoryId,
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
