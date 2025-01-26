import { ConvexError, v } from "convex/values";
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

export const completeAdminAndSetSchool = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    schoolId: v.id("schools"),
    role: v.literal("ADMIN"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first()
      .then((res) => ({ id: res?._id }));

    if (!user || !user.id) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user.id, {
      name: args.name,
      phone: args.phone,
      schoolId: args.schoolId,
      role: args.role,
    });
    await ctx.db.patch(args.schoolId, { user: user.id });
  },
});
