import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { getSchoolByDomain } from "./helpers";

export const getClassesData = query({
  args: {
    domain: v.string(),
  },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) throw new ConvexError("School not found.");

    const classes = await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("school"), school._id))
      .collect();

    return classes;
  },
});
