import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getSchoolByDomain } from "../queries/helpers";

export const createSchool = mutation({
  args: {
    domain: v.string(),
    type: v.string(),
    name: v.string(),
    logo: v.string(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const schoolExist = await getSchoolByDomain(ctx, args.domain);

    if (schoolExist) {
      throw new ConvexError("School domain already taken.");
    }

    // create the school
    const newSchoolId = await ctx.db.insert("schools", {
      ...args,
      verified: false,
    });

    return {
      id: newSchoolId,
    };
  },
});

export const setSchoolOwner = mutation({
  args: {
    schoolId: v.id("schools"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first()
      .then((res) => ({ id: res?._id, role: res?.role }));

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (user.role !== "ADMIN") {
      throw new ConvexError("Permission denied");
    }
    await ctx.db.patch(args.schoolId, { user: user.id });
  },
});
