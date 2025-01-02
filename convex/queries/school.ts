import { query } from "../_generated/server";
import { v } from "convex/values";

export const findSchool = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await ctx.db.query("schools").
      withIndex("by_domain", q => q.eq("domain", args.domain))
      .first()

    if (!school) {
      return null;
    }

    return {
      domain: school.domain
    }
  }
})
