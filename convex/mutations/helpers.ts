import { ConvexError } from "convex/values";
import { type QueryCtx, type MutationCtx } from "../_generated/server";

export async function checkAdmin(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) throw new ConvexError("Unauthorized");

  const isAdmin = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email ?? ""))
    .first()
    .then((res) => res?.role === "ADMIN");

  if (!isAdmin) throw new ConvexError("Unauthorized");
}
