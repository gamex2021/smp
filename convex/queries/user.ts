import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getSchoolById, getUserByEmailAndSchoolId } from "./helpers";

export const findUserByEmailAndSchoolId = query({
  args: { schoolId: v.id("schools"), userEmail: v.string() },
  handler: async (ctx, args) => {
    const data = await getUserByEmailAndSchoolId(ctx, { ...args });

    if (!data) {
      // handle error properly
      return null;
    }

    return {
      id: data._id,
      name: data.name,
    };
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});
