import { query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getSchoolByDomain } from "./helpers";

type User = {
  name: string | undefined;
  role: "ADMIN" | "STUDENT" | "TEACHER" | "ACCOUNTANT" | undefined;
};

export const fetchSchoolMatrics = query({
  args: {
    domain: v.string(),
  },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      throw new ConvexError("School not found");
    }
    const entities = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("schoolId"), school._id))
      .collect()
      .then((res) => res.map((item) => ({ name: item.name, role: item.role })));

    const { students, teachers } = entities.reduce<{
      students: User[];
      teachers: User[];
    }>(
      (acc, user) => {
        if (user.role === "STUDENT") acc.students.push(user);
        if (user.role === "TEACHER") acc.teachers.push(user);
        return acc;
      },
      { students: [], teachers: [] },
    );
    return {
      students,
      teachers,
    };
  },
});
