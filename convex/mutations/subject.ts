import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkAdmin } from "./helpers";
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
    await checkAdmin(ctx);
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
      searchableText: `${args.name} ${args.description} ${args.category}`,
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
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isCore: v.boolean(),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const subject = await ctx.db.get(args.subjectId);
    if (!subject || subject.schoolId !== args.schoolId) {
      throw new Error("Subject not found");
    }

    await ctx.db.patch(args.subjectId, {
      category: args.category,
      isCore: args.isCore,
      searchableText: `${args.name} ${args.description} ${args.category}`,
      name: args.name,
      ...(args.description && { description: args.description }),
      ...(args.isActive !== undefined && { isActive: args.isActive }),
    });
  },
});

// delete subject teachers
export const deleteSubjectTeachers = mutation({
  args: {
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const subject = await ctx.db.get(args.subjectId);
    if (!subject || subject.schoolId !== args.schoolId) {
      throw new Error("Subject not found");
    }

    // delete all relations of the subject
    const relations = await ctx.db
      .query("subjectTeachers")
      .filter((q) => q.eq(q.field("subjectId"), args.subjectId))
      .collect();

    return await Promise.all(
      relations.map(async (relation) => {
        return await ctx.db.delete(relation._id);
      }),
    );
  },
});

// delete a subject and all its relations
export const deleteSubject = mutation({
  args: {
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const subject = await ctx.db.get(args.subjectId);
    if (!subject || subject.schoolId !== args.schoolId) {
      throw new Error("Subject not found");
    }

    await ctx.db.delete(args.subjectId);

    // Start batch deletion process
    await ctx.scheduler.runAfter(
      0,
      api.mutations.subject.deleteSubjectTeachers,
      {
        subjectId: args.subjectId,
        schoolId: args.schoolId,
      },
    );

    return { success: true };
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
    await checkAdmin(ctx);
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

// delete subject class and teacher conjunction
export const deleteSTC = internalMutation({
  args: {
    id: v.id("subjectTeachers"),
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    //  verify the classId belongs to the school
    const schoolclass = await ctx.db.get(args.classId);
    if (!schoolclass || schoolclass.schoolId !== args.schoolId) {
      throw new Error("Invalid class");
    }

    return await ctx.db.delete(args.id);
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
    await checkAdmin(ctx);
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
