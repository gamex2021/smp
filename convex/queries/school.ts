import { query } from "../_generated/server";
import { v } from "convex/values";
import { getSchoolByDomain } from "./helpers";

export const findSchool = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      return null;
    }

    return {
      id: school._id,
      domain: school.domain,
    };
  },
});
