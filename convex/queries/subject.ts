/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all subjects for a school
export const getSchoolSubjects = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const subjects = await ctx.db
      .query("subjects")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return {
      subjects,
    };
  },
});

//GET THE CLASS AND SUBJECT A TEACHER IS TEACHING BY THEIR TEACHERID

// get class, subject and teachers relations, which is essentially just getting the class, subject and teacher relation
export const getSTC = query({
  args: {
    domain: v.string(),
  },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      return null;
    }
    //  verify the classId belongs to the school
    const subjectClasses = await ctx.db
      .query("subjectTeachers")
      .withIndex("by_school", (q) => q.eq("schoolId", school._id))
      .collect();

    const subjects = await Promise.all(
      subjectClasses?.map(async (subject) => {
        const currentSubject = await ctx.db.get(subject?.subjectId);
        const currentClass = await ctx.db.get(subject.classId);

        return {
          currentClass,
          currentSubject,
        };
      }),
    );

    return subjects;
  },
});

// get the stc by its id
export const getSTCById = query({
  args: {
    subjectTeacherId: v.id("subjectTeachers"),
    domain: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    // this domain is essentially just for safety in this function, if the domain is not found then the subjectteachers schema cannot be queried
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      return null;
    }

    //  verify the classId belongs to the school
    const subjectClasses = await ctx.db.get(args.subjectTeacherId);

    let subjectInfo = null;

    if (subjectClasses) {
      const [currentSubject, currentClass, currentTeacher] = await Promise.all([
        ctx.db.get(subjectClasses.subjectId),
        ctx.db.get(subjectClasses.classId),
        subjectClasses.teacherId
          ? ctx.db.get(subjectClasses.teacherId)
          : Promise.resolve(null),
      ]);

      subjectInfo = {
        currentSubject,
        currentClass,
        currentTeacher,
      };
    }

    return subjectInfo;
  },
});

// get the class, subject and teachers relation via the subjectId
export const getSTCBySubjectId = query({
  args: {
    subjectId: v.id("subjects"),
    domain: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    // this domain is essentially just for safety in this function, if the domain is not found then the subjectteachers schema cannot be queried
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      return null;
    }

    //  verify the classId belongs to the school
    const subjectClasses = await ctx.db
      .query("subjectTeachers")
      .withIndex("by_subject", (q) => q.eq("subjectId", args.subjectId))
      .collect();

    const subjects = await Promise.all(
      subjectClasses?.map(async (subject) => {
        const currentSubject = await ctx.db.get(subject?.subjectId);
        const currentClass = await ctx.db.get(subject.classId);
        const currentTeacher = subject.teacherId
          ? await ctx.db.get(subject.teacherId)
          : null;
        return {
          currentClass,
          currentSubject,
          currentTeacher,
        };
      }),
    );

    return subjects;
  },
});

// get school subject with pagination and search
export const getSchoolSubjectsWithPagination = query({
  args: {
    search: v.optional(v.string()),
    // categoryId: v.optional(v.id('subjectCategories')),
    schoolId: v.id("schools"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const { search, schoolId } = args;

    // Stage 1: Initialize the query
    const tableQuery = ctx.db.query("subjects");

    // Stage 2: Apply appropriate query approach based on available filters
    let queryWithFilters;

    if (search && search.length > 0) {
      queryWithFilters = tableQuery
        .withSearchIndex("search_user", (q) =>
          q
            .search("searchableText", args.search ?? "")
            .eq("schoolId", schoolId),
        )
        .filter((q) => q.eq(q.field("schoolId"), schoolId));
    } else {
      queryWithFilters = tableQuery
        .filter((q) => q.eq(q.field("schoolId"), schoolId))
        .order("desc");
    }

    const paginationResult = await queryWithFilters.paginate(
      args.paginationOpts,
    );

    return {
      ...paginationResult,
    };
  },
});

// The subject list for a teacher ,
export const subjectListForCurrentTeacher = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    // 1. Get the authenticated user's ID
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    // 2. Paginate subjectTeachers by teacherId
    const results = await ctx.db
      .query("subjectTeachers")
      .withIndex("by_teacher", (q) => q.eq("teacherId", userId)) // Use the correct field for user ID
      .paginate(args.paginationOpts);

    // 3. Populate related class and subject documents
    const classIds = results.page.map((st) => st.classId);
    const subjectIds = results.page.map((st) => st.subjectId);

    // Fetch all related classes and subjects in parallel
    const [classes, subjects] = await Promise.all([
      Promise.all(classIds.map((id) => ctx.db.get(id))),
      Promise.all(subjectIds.map((id) => ctx.db.get(id))),
    ]);

    // 4. Attach populated data to each result
    const page = results.page.map((st, i) => ({
      ...st,
      class: classes[i],
      subject: subjects[i],
    }));

    return { ...results, page };
  },
});

// get the subject by Id
export const getSubjectById = query({
  args: {
    subjectId: v.id("subjects"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const subject = await ctx.db.get(args.subjectId);

    // the subjectId must belong to the schoolId
    if (!subject || subject.schoolId !== args.schoolId) {
      throw new Error("Subject not found");
    }

    return subject;
  },
});
