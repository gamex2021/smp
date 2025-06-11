/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalQuery, mutation, query } from "../_generated/server";
import { checkAdmin, checkSchoolAccess } from "./helpers";

export const createGradingConfig = mutation({
  args: {
    schoolId: v.id("schools"),
    classIds: v.array(v.id("classes")),
    subjectIds: v.optional(v.array(v.id("subjects"))),
    name: v.string(),
    description: v.optional(v.string()),
    components: v.array(
      v.object({
        key: v.string(),
        name: v.string(),
        active: v.boolean(),
        maxPercentage: v.number(),
        order: v.optional(v.number()),
      }),
    ),
    gradeScale: v.array(
      v.object({
        grade: v.string(),
        minScore: v.number(),
        maxScore: v.number(),
      }),
    ),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await checkSchoolAccess(ctx, args.schoolId);

    // Validate grading structure
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validation = await ctx.runQuery(
      internal.mutations.grading.validateGradingStructure,
      {
        components: args.components,
        gradeScale: args.gradeScale,
      },
    );

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    // Check for existing default if this is being set as default
    if (args.isDefault) {
      const existingDefault = await ctx.db
        .query("grading")
        .withIndex("by_school_and_default", (q) =>
          q.eq("schoolId", args.schoolId).eq("isDefault", true),
        )
        .first();

      if (existingDefault) {
        await ctx.db.patch(existingDefault._id, { isDefault: false });
      }
    }

    const now = new Date().toISOString();

    return await ctx.db.insert("grading", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    components: v.optional(
      v.array(
        v.object({
          key: v.string(),
          name: v.string(),
          active: v.boolean(),
          maxPercentage: v.number(),
          order: v.optional(v.number()),
        }),
      ),
    ),
    gradeScale: v.optional(
      v.array(
        v.object({
          grade: v.string(),
          minScore: v.number(),
          maxScore: v.number(),
        }),
      ),
    ),
    classIds: v.optional(v.array(v.id("classes"))),
    subjectIds: v.optional(v.array(v.id("subjects"))),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    if (config.status === "archived") {
      throw new Error("Cannot update archived grading configuration");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    // Validate if components or gradeScale are being updated
    if (args.components || args.gradeScale) {
      const validation = await ctx.runQuery(
        internal.mutations.grading.validateGradingStructure,
        {
          components: args.components ?? config.components,
          gradeScale: args.gradeScale ?? config.gradeScale,
        },
      );

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.description !== undefined)
      updateData.description = args.description;
    if (args.components !== undefined) updateData.components = args.components;
    if (args.gradeScale !== undefined) updateData.gradeScale = args.gradeScale;
    if (args.classIds !== undefined) updateData.classIds = args.classIds;
    if (args.subjectIds !== undefined) updateData.subjectIds = args.subjectIds;

    return await ctx.db.patch(args.configId, updateData);
  },
});

export const archiveGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    return await ctx.db.patch(args.configId, {
      status: "archived",
      updatedAt: new Date().toISOString(),
    });
  },
});

export const setDefaultGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    if (config.status === "archived") {
      throw new Error("Cannot set archived configuration as default");
    }

    // Unset existing default
    const existingDefault = await ctx.db
      .query("grading")
      .withIndex("by_school_and_default", (q) =>
        q.eq("schoolId", config.schoolId).eq("isDefault", true),
      )
      .first();

    if (existingDefault && existingDefault._id !== args.configId) {
      await ctx.db.patch(existingDefault._id, { isDefault: false });
    }

    return await ctx.db.patch(args.configId, {
      isDefault: true,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const assignGradingConfigToClasses = mutation({
  args: {
    configId: v.id("grading"),
    classIds: v.array(v.id("classes")),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    // Verify all classes belong to the same school
    for (const classId of args.classIds) {
      const classDoc = await ctx.db.get(classId);
      if (!classDoc || classDoc.schoolId !== config.schoolId) {
        throw new Error(
          `Class ${classId} not found or doesn't belong to this school`,
        );
      }
    }

    return await ctx.db.patch(args.configId, {
      classIds: args.classIds,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const assignGradingConfigToSubjects = mutation({
  args: {
    configId: v.id("grading"),
    subjectIds: v.array(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    // Verify all subjects belong to the same school
    for (const subjectId of args.subjectIds) {
      const subject = await ctx.db.get(subjectId);
      if (!subject || subject.schoolId !== config.schoolId) {
        throw new Error(
          `Subject ${subjectId} not found or doesn't belong to this school`,
        );
      }
    }

    return await ctx.db.patch(args.configId, {
      subjectIds: args.subjectIds,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const duplicateGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
    newName: v.string(),
    classIds: v.optional(v.array(v.id("classes"))),
    subjectIds: v.optional(v.array(v.id("subjects"))),
  },
  handler: async (ctx, args) => {
    const originalConfig = await ctx.db.get(args.configId);
    if (!originalConfig) {
      throw new Error("Original grading configuration not found");
    }

    await checkSchoolAccess(ctx, originalConfig.schoolId);

    const now = new Date().toISOString();

    return await ctx.db.insert("grading", {
      schoolId: originalConfig.schoolId,
      classIds: args.classIds ?? originalConfig.classIds,
      subjectIds: args.subjectIds ?? originalConfig.subjectIds,
      name: args.newName,
      description: originalConfig.description,
      components: originalConfig.components,
      gradeScale: originalConfig.gradeScale,
      isDefault: false,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const activateGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    return await ctx.db.patch(args.configId, {
      status: "active",
      updatedAt: new Date().toISOString(),
    });
  },
});

export const draftGradingConfig = mutation({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);

    return await ctx.db.patch(args.configId, {
      status: "draft",
      updatedAt: new Date().toISOString(),
    });
  },
});

// QUERIES

export const getGradingConfigByClassAndSubject = query({
  args: {
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    subjectId: v.optional(v.id("subjects")),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    // First try to find a specific config for this class and subject
    if (args.subjectId) {
      const configs = await ctx.db
        .query("grading")
        .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
        .filter((q: any) => q.eq(q.field("status"), "active"))
        .collect();

      const specificConfig = configs.find(
        (config) =>
          config.classIds.includes(args.classId) &&
          config.subjectIds &&
          args.subjectId &&
          config.subjectIds.includes(args.subjectId),
      );

      if (specificConfig) return specificConfig;
    }

    // Then try to find a config for this class (without subject restriction)
    const configs = await ctx.db
      .query("grading")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .collect();

    const classConfig = configs.find(
      (config) =>
        config.classIds.includes(args.classId) &&
        (!config.subjectIds || config.subjectIds.length === 0),
    );

    if (classConfig) return classConfig;

    // Finally, return the default config
    return await ctx.db
      .query("grading")
      .withIndex("by_school_and_default", (q) =>
        q.eq("schoolId", args.schoolId).eq("isDefault", true),
      )
      .filter((q: any) => q.eq(q.field("status"), "active"))
      .first();
  },
});

export const getGradingConfigsBySchool = query({
  args: {
    schoolId: v.id("schools"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    let query = ctx.db
      .query("grading")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId));

    if (args.status) {
      query = query.filter((q: any) => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  },
});

export const getGradingConfigById = query({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new Error("Grading configuration not found");
    }

    await checkSchoolAccess(ctx, config.schoolId);
    return config;
  },
});

export const getDefaultGradingConfig = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    return await ctx.db
      .query("grading")
      .withIndex("by_school_and_default", (q) =>
        q.eq("schoolId", args.schoolId).eq("isDefault", true),
      )
      .first();
  },
});

export const getGradingConfigsForClass = query({
  args: {
    schoolId: v.id("schools"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    const configs = await ctx.db
      .query("grading")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return configs.filter((config) => config.classIds.includes(args.classId));
  },
});

export const getGradingConfigsForSubject = query({
  args: {
    schoolId: v.id("schools"),
    subjectId: v.id("subjects"),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    const configs = await ctx.db
      .query("grading")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return configs.filter((config) =>
      config.subjectIds?.includes(args.subjectId),
    );
  },
});

// INTERNAL QUERIES AND HELPERS

export const validateGradingStructure = internalQuery({
  args: {
    components: v.array(
      v.object({
        key: v.string(),
        name: v.string(),
        active: v.boolean(),
        maxPercentage: v.number(),
        order: v.optional(v.number()),
      }),
    ),
    gradeScale: v.array(
      v.object({
        grade: v.string(),
        minScore: v.number(),
        maxScore: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const errors: string[] = [];

    // Validate components
    const activeComponents = args.components.filter((c) => c.active);
    const totalPercentage = activeComponents.reduce(
      (sum, c) => sum + c.maxPercentage,
      0,
    );

    if (totalPercentage !== 100) {
      errors.push(
        `Total percentage of active components must equal 100, got ${totalPercentage}`,
      );
    }

    // Check for duplicate component keys
    const componentKeys = args.components.map((c) => c.key);
    const uniqueKeys = new Set(componentKeys);
    if (componentKeys.length !== uniqueKeys.size) {
      errors.push("Component keys must be unique");
    }

    // Validate component percentages
    args.components.forEach((component) => {
      if (component.maxPercentage < 0 || component.maxPercentage > 100) {
        errors.push(
          `Component ${component.name} percentage must be between 0 and 100`,
        );
      }
    });

    // Validate grade scale
    if (args.gradeScale.length === 0) {
      errors.push("Grade scale cannot be empty");
    }

    // Check for overlapping grade ranges
    const sortedGrades = [...args.gradeScale].sort(
      (a, b) => a.minScore - b.minScore,
    );
    for (let i = 0; i < sortedGrades.length - 1; i++) {
      if (sortedGrades[i].maxScore >= sortedGrades[i + 1].minScore) {
        errors.push(
          `Grade ranges overlap: ${sortedGrades[i].grade} and ${sortedGrades[i + 1].grade}`,
        );
      }
    }

    // Validate grade score ranges
    args.gradeScale.forEach((grade) => {
      if (grade.minScore < 0 || grade.maxScore > 100) {
        errors.push(`Grade ${grade.grade} scores must be between 0 and 100`);
      }
      if (grade.minScore >= grade.maxScore) {
        errors.push(
          `Grade ${grade.grade} minimum score must be less than maximum score`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
});

export const canEditGradingConfig = query({
  args: {
    configId: v.id("grading"),
  },
  handler: async (ctx, args) => {
    try {
      const config = await ctx.db.get(args.configId);
      if (!config) {
        return { canEdit: false, reason: "Configuration not found" };
      }

      const userRole = await checkSchoolAccess(ctx, config.schoolId);

      // Only admins and teachers with grading permissions can edit
      if (userRole === "ADMIN") {
        return { canEdit: true, reason: "Admin access" };
      }

      if (userRole === "TEACHER") {
        return { canEdit: true, reason: "Teacher with grading permissions" };
      }

      return { canEdit: false, reason: "Insufficient permissions" };
    } catch (error) {
      return { canEdit: false, reason: "Access denied" };
    }
  },
});

export const getGradingStatistics = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkSchoolAccess(ctx, args.schoolId);

    const configs = await ctx.db
      .query("grading")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    const stats = {
      total: configs.length,
      active: configs.filter((c) => c.status === "active").length,
      draft: configs.filter((c) => c.status === "draft").length,
      archived: configs.filter((c) => c.status === "archived").length,
      hasDefault: configs.some((c) => c.isDefault),
    };

    return stats;
  },
});
