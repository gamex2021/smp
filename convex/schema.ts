import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  addresses: defineTable({
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postal_code: v.string(),
    country: v.string(),
  }),

  schools: defineTable({
    domain: v.string(),
    name: v.string(),
    logo: v.string(),
    verified: v.boolean(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.id("users"),
  }).index("by_domain", ["domain"]),

  users: defineTable({
    firstname: v.string(),
    lastname: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.union(
      v.literal("ADMIN"),
      v.literal("STUDENT"),
      v.literal("TEACHER"),
      v.literal("ACCOUNTANT"),
    ),
  }),
});
