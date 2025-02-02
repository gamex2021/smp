/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";

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

// get class subject and class relations, which is essentially just getting the class, subject and teacher relation
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

// get school subject with pagination and search
export const getSchoolSubjectsWithPagination = query({
  args: {
    search: v.optional(v.string()),
    // categoryId: v.optional(v.id('subjectCategories')),
    schoolId: v.optional(v.id("schools")),
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { cursor, numItems, schoolId } = args;

    let newCursor: string | null;

    if (!schoolId) {
      return { subjects: [], cursor: null };
    }

    if (!cursor) {
      newCursor = null;
    } else {
      newCursor = cursor;
    }

    let query = ctx.db
      .query("subjects")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId));

    // Apply category filter if provided
    // if (args.categoryId) {
    //   query = query.filter((q) => q.eq(q.field('categoryId'), args.categoryId));
    // }

    // Apply search filter if provided
    if (args.search) {
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("name"), args.search!),
          q.eq(q.field("description"), args.search!),
        ),
      );
    }

    // Get paginated results
    const subjects = await query
      .order("desc")
      .paginate({ cursor: newCursor, numItems });

    return {
      subjects: subjects.page.map((subject) => ({
        ...subject,
      })),
      continueCursor: subjects.continueCursor,
    };
  },
});
