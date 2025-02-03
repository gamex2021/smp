import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";

export const getClassGroupsData = query({
  args: {
    domain: v.string(),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) throw new ConvexError("School not found.");

    const groups = await ctx.db
      .query("groups")
      .filter((q) =>
        q.and(
          q.eq(q.field("school"), school._id),
          q.eq(q.field("class"), args.classId),
        ),
      )
      .collect();

    return groups;
  },
});
