import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";
import { auth } from "../auth";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getStudentWorkspace = query({
  args: {
    studentId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    //get the workspace members
    const members = await ctx.db
      .query("workspaceMember")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.studentId).eq("schoolId", args.schoolId),
      )
      .collect();

    //   map through members and fetch workspace for each and return the other member object field with it
    const workspaces = await Promise.all(
      members.map(async (member) => {
        const workspace = await ctx.db.get(member.workspaceId);
        return {
          ...member,
          workspace,
        };
      }),
    );

    return workspaces;
  },
});

export const getWorkspaceById = query({

  
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const workspace = await ctx.db.get(args.workspaceId);

    if (!userId) return;

    if (!workspace) {
      throw new ConvexError("Workspace does not exist");
    }

    const members = await ctx.db
      .query("workspaceMember")
      .filter((q) => q.eq(q.field("workspaceId"), workspace._id))
      .collect();

    const findMembers = members.find((member) => member?.userId === userId);

    if (!findMembers) return;

    const newMembers = await Promise.all(
      members?.map(async (member) => {
        const user = await ctx.db.get(member?.userId);
        return {
          id: member?._id,
          role: member?.role,
          user,
          name: user?.name,
          avatar: user?.image
            ? await ctx.storage.getUrl(user.image)
            : "/images/placeholder.svg",
        };
      }),
    );

    return {
      ...workspace,
      id: workspace._id,
      title: workspace.name,
      documentCount: workspace.documents?.length,
      thumbnail: "/images/placeholder.svg",
      members: newMembers,
    };
  },
});

// function to get the documents
export const getDocmentList = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const workspace = await ctx.db.get(args.workspaceId);

    if (!userId) return;

    if (!workspace) {
      throw new ConvexError("Workspace does not exist");
    }

    const documents = await ctx.db
      .query("document")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const refinedDocuments = documents?.map((document) => {
      return {
        ...document,
        id: document?._id,
      };
    });

    return refinedDocuments;
  },
});

// function to get the recent activities
export const getRecentWorkspaceActivities = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const workspace = await ctx.db.get(args.workspaceId);

    if (!userId) return;

    if (!workspace) {
      throw new ConvexError("Workspace does not exist");
    }

    return await ctx.db
      .query("recentActivity")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});
