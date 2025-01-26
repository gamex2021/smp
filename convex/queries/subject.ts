/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getCategories = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("subjectCategories")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return categories;
  },
});

// Get all subjects for a school
export const getSchoolSubjects = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("subjectCategories")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    const result = await Promise.all(
      categories.map(async (category) => {
        const subjects = await ctx.db
          .query("subjects")
          .withIndex("by_school_and_category", (q) =>
            q.eq("schoolId", args.schoolId).eq("categoryId", category._id),
          )
          .collect();

        return {
          category,
          subjects,
        };
      }),
    );

    return result;
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

    // Get categories for the subjects
    const categoryIds = [...new Set(subjects.page.map((s) => s.categoryId))];
    const categories = await Promise.all(
      categoryIds.map((id) => ctx.db.get(id)),
    );
    const categoryMap = Object.fromEntries(categories.map((c) => [c?._id, c]));

    return {
      subjects: subjects.page.map((subject) => ({
        ...subject,
        category: categoryMap[subject.categoryId],
      })),
      continueCursor: subjects.continueCursor,
    };
  },
});
