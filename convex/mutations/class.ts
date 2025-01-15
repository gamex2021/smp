import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { checkAdmin } from "./helpers";

export const createClass = mutation({
  args: {
    title: v.string(),
    school: v.optional(v.id("schools")),
  },

  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.insert("classes", args);
  },
});
