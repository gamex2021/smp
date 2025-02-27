import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";

// get the student by pagination,
export const getStudentsWithPagination = query({
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

    const query = ctx.db
      .query("users")
      .withIndex("by_school", (q) =>
        q.eq("schoolId", school._id).eq("role", "STUDENT"),
      )
      .filter((q) => {
        if (args.search) {
          console.log("here", args.search);
          return q.or(
            q.eq(q.field("name"), args.search),
            q.eq(q.field("email"), args.search),
          );
        }
        return q.eq(q.field("_id"), q.field("_id")); // This is always true, effectively no filter when no search
      });
    // Get paginated results
    const students = await query
      .order("desc")
      .paginate({ cursor: cursor ?? null, numItems });

    // Resolve image URLs
    const studentsWithImages = await Promise.all(
      students.page.map(async (student) => {
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
      students: studentsWithImages,
      continueCursor: students.continueCursor,
    };
  },
});
