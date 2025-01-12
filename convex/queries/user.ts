import { query } from "../_generated/server";
import { v } from "convex/values";
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
