import { Id } from "../_generated/dataModel";
import { QueryCtx, MutationCtx } from "../_generated/server";

export async function getSchoolByDomain(
  ctx: QueryCtx | MutationCtx,
  domain: string,
) {
  const data = await ctx.db
    .query("schools")
    .withIndex("by_domain", (q) => q.eq("domain", domain))
    .first();

  return data ?? null;
}

export async function getSchoolById(
  ctx: QueryCtx | MutationCtx,
  id: Id<"schools">,
) {
  const data = await ctx.db.get(id);

  return data ?? null;
}

export async function getUserByEmailAndSchoolId(
  ctx: QueryCtx | MutationCtx,
  { userEmail, schoolId }: { schoolId: Id<"schools">; userEmail: string },
) {
  const data = await ctx.db
    .query("users")
    .withIndex("by_email_schoolId", (q) =>
      q.eq("email", userEmail).eq("schoolId", schoolId),
    )
    .first();

  if (!data) {
    return null;
  }

  return data;
}
