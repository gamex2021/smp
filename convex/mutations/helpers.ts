import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { type QueryCtx, type MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { getSchool } from "../queries/school";

export async function checkAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId == null) throw new ConvexError("Unauthorized");

  const isAdmin = await ctx.db.get(userId).then((res) => res?.role === "ADMIN");
  if (!isAdmin) throw new ConvexError("Unauthorized");
}

export async function checkSchoolAccess(
  ctx: MutationCtx | QueryCtx,
  schoolId: Id<"schools">,
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
  const getSchool = await ctx.db.get(userId);

  if (getSchool?.schoolId !== schoolId) {
    throw new Error("Access denied to this school");
  }

  return getSchool?.role;
}
