import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { type QueryCtx, type MutationCtx } from "../_generated/server";

export async function checkAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId == null) throw new ConvexError("Unauthorized");

  const isAdmin = await ctx.db.get(userId).then((res) => res?.role === "ADMIN");
  if (!isAdmin) throw new ConvexError("Unauthorized");
}
