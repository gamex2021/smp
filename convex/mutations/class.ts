import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { checkAdmin } from "./helpers";

export const createClass = mutation({
  args: {
    title: v.string(),
    schoolId: v.id("schools"),
  },

  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.insert("classes", args);
  },
});

export const createGroup = mutation({
  args: {
    title: v.string(),
    school: v.id("schools"),
    class: v.id("classes"),
  },

  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.insert("groups", args);
  },
});
