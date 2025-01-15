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

  classes: defineTable({
    title: v.string(),
    school: v.optional(v.id("schools")),
  }).index("by_schoolId", ["school"]),

  group: defineTable({
    title: v.string(),
    class: v.optional(v.id("classes")),
    school: v.optional(v.id("schools")),
  }).index("by_classId", ["class"]),

  schools: defineTable({
    domain: v.string(),
    name: v.string(),
    logo: v.string(),
    type: v.string(),
    verified: v.boolean(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.optional(v.id("users")),
  }).index("by_domain", ["domain"]),

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    role: v.optional(
      v.union(
        v.literal("ADMIN"),
        v.literal("STUDENT"),
        v.literal("TEACHER"),
        v.literal("ACCOUNTANT"),
      ),
    ),
    schoolId: v.optional(v.id("schools")),
  })
    .index("email", ["email"])
    .index("by_email_schoolId", ["email", "schoolId"]),
});
