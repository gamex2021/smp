/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "../_generated/api";

export const createAdmin = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    schoolId: v.id("schools"),
    role: v.literal("ADMIN"),
  },
  handler: async (ctx, args) => {
    const newAdminId = await ctx.db.insert("users", args);

    return {
      id: newAdminId,
    };
  },
});

export const completeAdminAndSetSchool = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    schoolId: v.id("schools"),
    role: v.literal("ADMIN"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first()
      .then((res) => ({ id: res?._id }));

    if (!user?.id) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user.id, {
      name: args.name,
      phone: args.phone,
      schoolId: args.schoolId,
      role: args.role,
    });
    await ctx.db.patch(args.schoolId, { user: user.id });
  },
});

// mutation to generateuploadurl for files
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// to generate a random username
function generateUsername(name: string) {
  const baseName = name.toLowerCase().replace(/\s+/g, ".");
  const randomNum = Math.floor(Math.random() * 1000);
  return `${baseName}${randomNum}`;
}

// this is a mutation that will be used to create a teacher and also a student, made it an internalMutation
export const createEntity = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("TEACHER"), v.literal("STUDENT")),
    qualifications: v.optional(v.string()),
    schoolId: v.id("schools"), // Changed to allow empty string for new schools
    image: v.optional(v.id("_storage")),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    currentClass: v.optional(v.id("classes")),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    dob: v.optional(v.string()), // Date of birth
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first()
      .then((res) => ({ id: res?._id }));

    if (!user || !user.id) {
      throw new ConvexError("User not found");
    }

    const username = generateUsername(args.name);

    await ctx.db.patch(user.id, {
      ...args,
      searchableText: `${args.name} ${args.email} ${args.phone} ${args.guardianName} ${args.guardianPhone} ${args.address} ${args.dob} ${args.qualifications} ${args.bio} `,
      username,
    });
    await ctx.db.patch(args.schoolId, { user: user.id });
    return user.id;
  },
});

// function to update the user profile
export const updateEntity = internalMutation({
  args: {
    id: v.id("users"),
    name: v.string(),
    email: v.string(),
    qualifications: v.optional(v.string()),
    schoolId: v.id("schools"), // Changed to allow empty string for new schools
    image: v.optional(v.id("_storage")),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    currentClass: v.optional(v.id("classes")),
    guardianName: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    address: v.optional(v.string()),
    dob: v.optional(v.string()), // Date of birth
  },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // get the teacher's profile
    const { id, ...rest } = args;

    const user = await ctx.runQuery(internal.queries.user.getUser, {
      userId: id,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      ...rest,
      searchableText: `${args.name} ${args.email} ${args.phone} ${args.guardianName} ${args.guardianPhone} ${args.address} ${args.dob} ${args.qualifications} ${args.bio} `,
    });

    return { success: true };
  },
});

// function to delete an entity
export const deleteEntity = internalMutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first()
      .then((res) => ({ id: res?._id }));

    if (!user || !user.id) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user.id);
  },
});
