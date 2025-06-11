import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { getSchoolByDomain } from "../queries/helpers";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkAdmin } from "./helpers";

export const createSchool = mutation({
  args: {
    domain: v.string(),
    type: v.string(),
    name: v.string(),
    logo: v.string(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const schoolExist = await getSchoolByDomain(ctx, args.domain);

    if (schoolExist) {
      throw new ConvexError("School domain already taken.");
    }

    // create the school
    const newSchoolId = await ctx.db.insert("schools", {
      ...args,
      verified: false,
    });

    return {
      id: newSchoolId,
    };
  },
});

export const setSchoolOwner = mutation({
  args: {
    schoolId: v.id("schools"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first()
      .then((res) => ({ id: res?._id, role: res?.role }));

    if (!user) {
      throw new ConvexError("User not found");
    }
    if (user.role !== "ADMIN") {
      throw new ConvexError("Permission denied");
    }
    await ctx.db.patch(args.schoolId, { user: user.id });
  },
});

// Update school profile
export const updateSchoolProfile = mutation({
  args: {
    schoolId: v.id("schools"),
    name: v.string(),
    motto: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    type: v.union(
      v.literal("primary"),
      v.literal("secondary"),
      v.literal("both"),
    ),
    category: v.union(
      v.literal("private"),
      v.literal("public"),
      v.literal("international"),
    ),
    yearFounded: v.number(),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // CHECK IF THE REQUESTING USER IS AN ADMIN
    await checkAdmin(ctx);
    const school = await ctx.db.get(args.schoolId);
    if (!school) {
      throw new ConvexError("School not found");
    }

    // Update school profile
    await ctx.db.patch(args.schoolId, {
      name: args.name,
      motto: args.motto,
      email: args.email,
      phone: args.phone,
      type: args.type,
      category: args.category,
      yearFounded: args.yearFounded,
      ...(args.logo && { logo: args.logo }),
    });

    return { success: true };
  },
});

// update autotermprogession in academic config schema
export const updateAcademicConfig = mutation({
  args: {
    academicConfigId: v.id("academicConfig"),
    autotermprogession: v.boolean(),
  },
  handler: async (ctx, args) => {
    const academicConfig = await ctx.db.get(args.academicConfigId);
    if (!academicConfig) {
      throw new ConvexError("Academic config not found");
    }
    // Update academic config
    await ctx.db.patch(args.academicConfigId, {
      autoTermProgression: args.autotermprogession,
      autoYearProgression: args.autotermprogession,
    });
    return { success: true };
  },
});

// Configure academic year
export const configureAcademicYear = mutation({
  args: {
    schoolId: v.id("schools"),
    academicYear: v.string(),
    numberOfTerms: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    isActive: v.boolean(),
    autoYearProgression: v.boolean(),
    autoTermProgression: v.boolean(),
    terms: v.array(
      v.object({
        termNumber: v.number(),
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
          v.literal("upcoming"),
          v.literal("active"),
          v.literal("completed"),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Check if academic year already exists
    const existingYear = await ctx.db
      .query("academicConfig")
      .withIndex("by_school_year", (q) =>
        q.eq("schoolId", args.schoolId).eq("academicYear", args.academicYear),
      )
      .first();

    if (existingYear) {
      throw new ConvexError("Academic year already configured");
    }

    // Create new academic year configuration
    const userId = await getAuthUserId(ctx); // Ensure the user is authenticated

    if (!userId) {
      throw new ConvexError("User does not exist");
    }

    const configId = await ctx.db.insert("academicConfig", {
      schoolId: args.schoolId,
      academicYear: args.academicYear,
      numberOfTerms: args.numberOfTerms,
      startDate: args.startDate,
      endDate: args.endDate,
      isActive: args.isActive,
      autoYearProgression: args.autoYearProgression,
      autoTermProgression: args.autoTermProgression,
      terms: args.terms, // Will be populated by configureTerm mutation
      currentTerm: {
        name: "Term 1",
        status: "upcoming",
        startDate: args.startDate,
        endDate: args.endDate,
        termNumber: 1,
      }, // Default value for currentTerm
      status: "upcoming", // Default status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    });

    return { configId };
  },
});

// Configure term
export const configureTerm = mutation({
  args: {
    academicConfigId: v.id("academicConfig"),
    termNumber: v.number(),
    name: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    feeStructure: v.array(
      v.object({
        feeType: v.string(),
        amount: v.number(),
        dueDate: v.string(),
        isCompulsory: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const academicConfig = await ctx.db.get(args.academicConfigId);
    if (!academicConfig) {
      throw new ConvexError("Academic configuration not found");
    }

    // Get existing terms
    const terms = academicConfig.terms || [];

    // Check if term number already exists
    const termExists = terms.some(
      (term) => term.termNumber === args.termNumber,
    );
    if (termExists) {
      throw new ConvexError("Term already configured");
    }

    // Add new term
    const updatedTerms = [
      ...terms,
      {
        termNumber: args.termNumber,
        name: args.name,
        startDate: args.startDate,
        endDate: args.endDate,
        feeStructure: args.feeStructure,
        status: "upcoming" as "upcoming" | "active" | "completed", // or another default status
      },
    ];

    // Update academic config with new term
    await ctx.db.patch(args.academicConfigId, {
      ...academicConfig,
      terms: updatedTerms,
    });

    return { success: true };
  },
});

// Update term settings
export const updateTermSettings = mutation({
  args: {
    academicConfigId: v.id("academicConfig"),
    termNumber: v.number(),
    updates: v.object({
      name: v.optional(v.string()),
      startDate: v.optional(v.string()),
      endDate: v.optional(v.string()),
      feeStructure: v.optional(
        v.array(
          v.object({
            feeType: v.string(),
            amount: v.number(),
            dueDate: v.string(),
            isCompulsory: v.boolean(),
          }),
        ),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const academicConfig = await ctx.db.get(args.academicConfigId);
    if (!academicConfig) {
      throw new ConvexError("Academic configuration not found");
    }

    const terms = academicConfig.terms || [];
    const termIndex = terms.findIndex(
      (term) => term.termNumber === args.termNumber,
    );

    if (termIndex === -1) {
      throw new ConvexError("Term not found");
    }

    // Update term with new settings
    const updatedTerms = [...terms];
    updatedTerms[termIndex] = {
      ...updatedTerms[termIndex],
      ...args.updates,
    };

    await ctx.db.patch(args.academicConfigId, {
      terms: updatedTerms,
    });

    return { success: true };
  },
});

// Delete term
export const deleteTerm = mutation({
  args: {
    academicConfigId: v.id("academicConfig"),
    termNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const academicConfig = await ctx.db.get(args.academicConfigId);
    if (!academicConfig) {
      throw new ConvexError("Academic configuration not found");
    }

    const terms = academicConfig.terms || [];
    const updatedTerms = terms.filter(
      (term) => term.termNumber !== args.termNumber,
    );

    await ctx.db.patch(args.academicConfigId, {
      terms: updatedTerms,
    });

    return { success: true };
  },
});

export const updateSchoolLogo = mutation({
  args: {
    schoolId: v.id("schools"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { schoolId, storageId } = args;

    // Update the school's logo
    await ctx.db.patch(schoolId, {
      logo: storageId,
    });

    return { success: true };
  },
});

export const updateSchoolAddress = mutation({
  args: {
    schoolId: v.id("schools"),
    address: v.object({
      line1: v.string(),
      line2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      postal_code: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { schoolId, address } = args;

    // Create new address
    const addressId = await ctx.db.insert("addresses", address);

    // Update school with new address
    await ctx.db.patch(schoolId, {
      address: addressId,
    });

    return { success: true };
  },
});
