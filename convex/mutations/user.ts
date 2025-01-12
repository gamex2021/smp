import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    schoolId: v.id("schools"),
    role: v.literal("ADMIN"),
  },
  handler: async (ctx, args) => {
    const newAdminId = await ctx.db.insert("users", args);

    return {
      id: newAdminId,
    };
  },
});
