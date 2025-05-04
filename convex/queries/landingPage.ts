import { v } from "convex/values";
import { query } from "../_generated/server";


// Get landing page configuration and sections for a domain
export const getLandingPageConfig = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await ctx.db
      .query("schools")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (!school) {
      return { school: null, config: null };
    }

    // get the school address
    const schoolAddress = await ctx.db.get(school?.address)

    const config = await ctx.db
      .query("landingPageConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", school._id))
      .first();

    const newSchool = {
        ...school,
        address : schoolAddress
    }

    return { school : newSchool, config };
  },
});

// Get landing page sections
export const getLandingPageSections = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await ctx.db
      .query("schools")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (!school) {
      return null;
    }

    const sections = await ctx.db
      .query("landingPageSections")
      .withIndex("by_school", (q) => q.eq("schoolId", school._id))
      .collect();

    return { sections };
  },
});

// Get testimonials
export const getTestimonials = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await ctx.db
      .query("schools")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (!school) {
      return [];
    }

    return await ctx.db
      .query("testimonials")
      .withIndex("by_school", (q) => q.eq("schoolId", school._id))
      .collect();
  },
});

// Get FAQ items
export const getFaqItems = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await ctx.db
      .query("schools")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (!school) {
      return [];
    }

    return await ctx.db
      .query("faqItems")
      .withIndex("by_school", (q) => q.eq("schoolId", school._id))
      .collect();
  },
});


// Check if landing page has been initialized
export const checkLandingPageInitialized = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const { schoolId } = args

    // Check if any sections exist
    const sections = await ctx.db
      .query("landingPageSections")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .collect()

    return { initialized: sections.length > 0 }
  },
})


export const getAdminLandingPageData = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const { schoolId } = args

    // Get landing page config
    const config = await ctx.db
      .query("landingPageConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .first()

    // Get landing page sections
    const sections = await ctx.db
      .query("landingPageSections")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .collect()

    // Get section media and CTA buttons
    const sectionsWithData = await Promise.all(
      sections.map(async (section) => {
    
        return {
          ...section,
        }
      })
    )

    // Get testimonials
    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .collect()

    // Get FAQ items
    const faqItems = await ctx.db
      .query("faqItems")
      .withIndex("by_school", (q) => q.eq("schoolId", schoolId))
      .collect()

    return {
      config,
      sections: sectionsWithData,
      testimonials,
      faqItems
    }
  },
})