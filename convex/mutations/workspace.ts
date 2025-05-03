import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";

// create a new workspace
export const createWorkspace = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    schoolId: v.id("schools"),
    creatorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // find the user and make sure they are a student
    const user = await ctx.db
      .query("users")
      .withIndex("by_school", (q) =>
        q.eq("schoolId", args.schoolId).eq("role", "STUDENT"),
      )
      .first();

    //   if user does not exist then we throw an error
    if (!user) {
      throw new ConvexError("Only students can create workspace");
    }

    // create a new workspace
    const workspace = await ctx.db.insert("workspace", {
      name: args.name,
      description: args.description,
      schoolId: args.schoolId,
    });

    // create workspaceMember
    await ctx.db.insert("workspaceMember", {
      userId: args.creatorId,
      workspaceId: workspace,
      schoolId: args.schoolId,
      role: "creator",
    });

    return workspace;
  },
});
