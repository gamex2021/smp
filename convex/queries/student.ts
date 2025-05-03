import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// get the student by pagination,
export const getStudentsWithPagination = query({
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
    const { search, domain } = args;

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
            q.eq(q.field("role"), "STUDENT"),
          ),
        );
    } else {
      queryWithFilters = tableQuery
        .filter((q) =>
          q.and(
            q.eq(q.field("schoolId"), school._id),
            q.eq(q.field("role"), "STUDENT"),
          ),
        )
        .order("desc");
    }

    // the pagination
    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    // Resolve image URLs
    const studentsWithImages = await Promise.all(
      paginationResult.page.map(async (student) => {
        // fetch classes the student is assigned to
        const classes = await ctx.db
          .query("classStudent")
          .withIndex("by_student", (q) => q.eq("studentId", student?._id))
          .order("desc")
          .collect();

        // resolve class details before returning

        const resolvedClasses = await Promise.all(
          classes
            .map((sub) => (sub.classId ? ctx.db.get(sub.classId) : undefined))
            .filter(Boolean),
        );

        let currentClass;
        if (student.currentClass) {
          currentClass = await ctx.db.get(student.currentClass);
        }

        return {
          ...student,
          assignedClasses: resolvedClasses,
          currentClass: currentClass,
          image: student.image
            ? await ctx.storage.getUrl(student.image)
            : undefined,
        };
      }),
    );

    return {
      ...paginationResult,
      page: studentsWithImages,
    };
  },
});

// get student by id
export const getStudentById = query({
  args: {
    studentId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    const { studentId, schoolId } = args;

    // get the student by id
    const student = await ctx.db.get(studentId);
    if (!student || student.schoolId !== schoolId || student.role !== "STUDENT")
      throw new ConvexError("Student not found.");

    const studentsWithImages = async () => {
      // fetch classes the student is assigned to
      const classes = await ctx.db
        .query("classStudent")
        .withIndex("by_student", (q) => q.eq("studentId", student?._id))
        .order("desc")
        .collect();

      // resolve class details before returning

      const resolvedClasses = await Promise.all(
        classes
          .map((sub) => (sub.classId ? ctx.db.get(sub.classId) : undefined))
          .filter(Boolean),
      );

      let currentClass;
      if (student.currentClass) {
        currentClass = await ctx.db.get(student.currentClass);
      }

      return {
        ...student,
        assignedClasses: resolvedClasses,
        currentClass: currentClass,
        image: student.image
          ? await ctx.storage.getUrl(student.image)
          : undefined,
      };
    };

    return await studentsWithImages();
  },
});

// get student current class
export const getStudentCurrentClass = query({
  args: {
    studentId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    const { studentId, schoolId } = args;

    // get the current class of the student
    const student = await ctx.db.get(studentId);
    if (!student || student.schoolId !== schoolId)
      throw new ConvexError("Student not found.");

    // get the classes the student is assigned to
    const classes = await ctx.db
      .query("classStudent")
      .withIndex("by_student", (q) => q.eq("studentId", studentId))
      .order("desc")
      .take(1);

    // resolve class details before returning

    const resolvedClasses = await Promise.all(
      classes.map(async (sub) => {
        let classId;
        if (classId) {
          classId = await ctx.db.get(sub.classId);
        }
        return {
          ...sub,
          classId,
        };
      }),
    );

    return resolvedClasses[0];
  },
});
