import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
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
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    role: v.union(
      v.literal("ADMIN"),
      v.literal("STUDENT"),
      v.literal("TEACHER"),
      v.literal("ACCOUNTANT"),
    ),
  }).index("by_email", ["email"]),
});
