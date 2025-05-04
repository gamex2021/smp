import { ConvexError, v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";


// get classes by its id
export const getClassById = query({
  args : {
    classId : v.id("classes")
  }, handler : async (ctx, {classId}) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.get(classId)
  }
})
export const getClassesData = query({
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
    const tableQuery = ctx.db.query("classes");

    // Stage 2: Apply appropriate query approach based on available filters
    let queryWithFilters;

    if (search && search.length > 0) {
      queryWithFilters = tableQuery
        .withSearchIndex("search_user", (q) =>
          q
            .search("searchableText", args.search ?? "")
            .eq("schoolId", school._id),
        )
        .filter((q) => q.eq(q.field("schoolId"), school._id));
    } else {
      queryWithFilters = tableQuery
        .filter((q) => q.eq(q.field("schoolId"), school._id))
        .order("desc");
    }

    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    return paginationResult;
  },
});


// Get class's teacher assignments
export const getClassTeacher= internalQuery({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, {  classId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("classTeacher")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();
  },
});


export const getClassTeach= query({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, {  classId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db
      .query("classTeacher")
      .withIndex("by_class", (q) => q.eq("classId", classId))
      .collect();
  },
});

// get all the teachers of a class by the class id
export const getClassesTeachers = query({
  args: {
    search: v.optional(v.string()),
    domain: v.string(),
    classId: v.id("classes"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // * verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { domain, search, classId } = args;

    const school = await getSchoolByDomain(ctx, domain);

    if (!school) throw new ConvexError("School not found.");

    // Stage 1: Initialize the query
    const tableQuery = ctx.db.query("classTeacher");

    // stage 2: Apply Appropriate query approach based on the available filters
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
            q.eq(q.field("classId"), classId),
          ),
        );
    } else {
      queryWithFilters = tableQuery
        .filter((q) =>
          q.and(
            q.eq(q.field("schoolId"), school._id),
            q.eq(q.field("classId"), classId),
          ),
        )
        .order("desc");
    }

    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    // resolve the teachers from the result
    const classTeacherDetails = await Promise.all(
      paginationResult.page.map(async (teacher) => {
        const teacherDetails = await ctx.db.get(teacher.teacherId);
        return {
          ...teacher,
          teacherDetails,
        };
      }),
    );

    // return the complete pagination result structure
    return {
      ...paginationResult,
      page: classTeacherDetails,
    };
  },
});

// get all the students of a class by the class id
export const getClassesStudents = query({
  args: {
    search: v.optional(v.string()),
    domain: v.string(),
    classId: v.id("classes"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // * verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { domain, search, classId } = args;

    const school = await getSchoolByDomain(ctx, domain);

    if (!school) throw new ConvexError("School not found.");

    // Stage 1: Initialize the query
    const tableQuery = ctx.db.query("classStudent");

    // stage 2: Apply Appropriate query approach based on the available filters
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
            q.eq(q.field("classId"), classId),
          ),
        );
    } else {
      queryWithFilters = tableQuery
        .filter((q) =>
          q.and(
            q.eq(q.field("schoolId"), school._id),
            q.eq(q.field("classId"), classId),
          ),
        )
        .order("desc");
    }

    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    // resolve the students from the result
    const classStudentDetails = await Promise.all(
      paginationResult.page.map(async (student) => {
        const studentDetails = await ctx.db.get(student.studentId);
        return {
          ...student,
          studentDetails,
        };
      }),
    );

    // return the complete pagination result structure
    return {
      ...paginationResult,
      page: classStudentDetails,
    };
  },
});
