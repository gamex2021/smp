import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";

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

    if (!user || !user.id) {
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
    const username = generateUsername(args.name);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new ConvexError("User already exists");
    }

    return await ctx.db.insert("users", {
      ...args,
      username,
    });

   
  },
});
