import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";

// get the teacher by pagination,
export const getTeachersWithPagination = query({
  args: {
    search: v.optional(v.string()),
    domain: v.string(),
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { cursor, numItems, domain } = args;

    const school = await getSchoolByDomain(ctx, domain);

    if (!school) throw new ConvexError("School not found.");

    let query = ctx.db
      .query("users")
      .withIndex("by_school", (q) =>
        q.eq("schoolId", school._id).eq("role", "TEACHER"),
      );

    if (args.search) {
      query = query.filter((q) =>
        q.or(
          q.eq(q.field("name"), args.search),
          q.eq(q.field("email"), args.search!),
        ),
      );
    }

    // Get paginated results
    const teachers = await query
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems });

    // Resolve image URLs
    const teachersWithImages = await Promise.all(
      teachers.page.map(async (teacher) => {
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
          classes.map((sub) => ctx.db.get(sub.classId)),
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

    return {
      teachers: teachersWithImages,
      continueCursor: teachers.continueCursor,
    };
  },
});
