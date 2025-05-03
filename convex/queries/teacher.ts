import { ConvexError, v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// get the teacher by pagination,
export const getTeachersWithPagination = query({
  args: {
    search: v.optional(v.string()),
    domain: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const { domain, search } = args;

    const school = await getSchoolByDomain(ctx, domain);

    if (!school) throw new ConvexError("School not found.");

    // Stage 1: Initialize the query
    const tableQuery = ctx.db.query("users");

    // Stage 2: Apply appropriate query approach based on available filters
    let queryWithFilters;

    if (search && search.length > 0) {
      queryWithFilters = tableQuery
        .withSearchIndex("search_user", (q) =>
          q
            .search("searchableText", args.search ?? "")
            .eq("schoolId", school._id),
        )
        .filter((q) =>
          q.and(
            q.eq(q.field("schoolId"), school._id),
            q.eq(q.field("role"), "TEACHER"),
          ),
        );
    } else {
      queryWithFilters = tableQuery
        .filter((q) =>
          q.and(
            q.eq(q.field("schoolId"), school._id),
            q.eq(q.field("role"), "TEACHER"),
          ),
        )
        .order("desc");
    }

    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    // Resolve image URLs
    const teachersWithImages = await Promise.all(
      paginationResult.page.map(async (teacher) => {
        // Fetch subjects the teacher is teaching
        const subject = await ctx.db
          .query("subjectTeachers")
          .withIndex("by_teacher", (q) => q.eq("teacherId", teacher?._id))
          .order("desc")
          .collect();

        // fetch classes the teacher is assigned to
        const classes = await ctx.db
          .query("classTeacher")
          .withIndex("by_teacher", (q) => q.eq("teacherId", teacher?._id))
          .order("desc")
          .collect();

        // Resolve subject details before returning
        const resolvedSubjects = await Promise.all(
          subject.map((sub) => ctx.db.get(sub.subjectId)),
        );

        // resolve class details before returning
        const resolvedClasses = await Promise.all(
          classes
            .map((sub) => (sub.classId ? ctx.db.get(sub.classId) : undefined))
            .filter(Boolean),
        );

        return {
          ...teacher,
          subjects: resolvedSubjects,
          assignedClasses: resolvedClasses,
          image: teacher.image
            ? await ctx.storage.getUrl(teacher.image)
            : undefined,
        };
      }),
    );

    // Return the complete pagination result structure
    return {
      ...paginationResult,
      page: teachersWithImages,
    };
  },
});

// get a teacher by id
export const getTeacherById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const teacher = await ctx.db.get(id);

    if (!teacher) {
      throw new ConvexError("Teacher not found.");
    }

    if (teacher.role !== "TEACHER") {
      throw new ConvexError("User is not a teacher.");
    }

    // if the teacher schoolId is not the same as the logged in user's schoolId, throw an error
    const user = await ctx.db.get(userId);
    if (user?.schoolId !== teacher.schoolId) {
      throw new ConvexError("You are not authorized to view this teacher.");
    }

    const teachersWithImages = async () => {
      // Fetch subjects the teacher is teaching
      const subject = await ctx.db
        .query("subjectTeachers")
        .withIndex("by_teacher", (q) => q.eq("teacherId", teacher?._id))
        .order("desc")
        .collect();

      // fetch classes the teacher is assigned to
      const classes = await ctx.db
        .query("classTeacher")
        .withIndex("by_teacher", (q) => q.eq("teacherId", teacher?._id))
        .order("desc")
        .collect();

      // Resolve subject details before returning
      const resolvedSubjects = await Promise.all(
        subject.map((sub) => ctx.db.get(sub.subjectId)),
      );

      // resolve class details before returning
      const resolvedClasses = await Promise.all(
        classes
          .map((sub) => (sub.classId ? ctx.db.get(sub.classId) : undefined))
          .filter(Boolean),
      );

      return {
        ...teacher,
        subjects: resolvedSubjects,
        assignedClasses: resolvedClasses,
        image: teacher.image
          ? await ctx.storage.getUrl(teacher.image)
          : undefined,
      };
    };

    return await teachersWithImages();
  },
});

// Get teacher's class assignments
export const getTeacherClasses = internalQuery({
  args: {
    teacherId: v.id("users"),
  },
  handler: async (ctx, { teacherId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("classTeacher")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacherId))
      .collect();
  },
});

// get all teacher subjects
export const getTeacherSubjects = internalQuery({
  args: {
    teacherId: v.id("users"),
  },
  handler: async (ctx, { teacherId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("subjectTeachers")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacherId))
      .collect();
  },
});
