import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  schools: defineTable({
    domain: v.string(),
    name: v.string(),
    logo: v.string(),
    verified: v.boolean(),
    registeration_doc: v.string(),
    address: v.id("addresses")
  }).index("by_domain", ["domain"]),

  addresses: defineTable({
    line1: v.string(),
    line2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    postal_code: v.string(),
    country: v.string(),
  })
});
