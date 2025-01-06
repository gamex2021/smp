"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";

export const registerSchool = action({
  args: {
    school: v.object({
      name: v.string(),
      logo: v.string(),
      registeration_doc: v.string(),
      type: v.string(),
      domain: v.string(),
      address: v.object({
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        country: v.string(),
        state: v.string(),
        postal_code: v.string(),
      }),
    }),
    admin: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      role: v.literal("ADMIN"),
    }),
  },

  handler: async (ctx, args) => {
    // this can get expensive
    // rewrite so ctx.runMutation is called once
    const address = await ctx.runMutation(
      api.mutations.address.createAddress,
      args.school.address,
    );
    const school = await ctx.runMutation(api.mutations.school.createSchool, {
      ...args.school,
      address: address.id,
    });
    const newAdmin = await ctx.runMutation(api.mutations.user.createAdmin, {
      ...args.admin,
      schoolId: school.id,
    });

    // update the user field on the freshly created school to the new user
    await ctx.runMutation(internal.mutations.school.setSchoolOwner, {
      schoolId: school.id,
      userId: newAdmin.id,
    });

    return { data: "success", error: null };
  },
});
