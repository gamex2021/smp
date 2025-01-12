import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createAddress = mutation({
  args: {
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    country: v.string(),
    state: v.string(),
    postal_code: v.string(),
  },
  handler: async (ctx, args) => {
    const newAddressId = await ctx.db.insert("addresses", args);

    return {
      id: newAddressId,
    };
  },
});
