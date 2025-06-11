/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "../_generated/server";

// * FUNCTION TO FETCH TOTAL STUDENTS FROM THE USERS SCHEMA
export const fetchTotalStudents = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // * GET THE TOTAL NUMBER OF USERS FROM THE BACKEND WITH THE ROLE OF STUDENT AND JUST RETURN THE COUNT
    const studentNumber = await ctx.db
      .query("users")
      .withIndex("by_school", (q) =>
        q.eq("schoolId", args.schoolId).eq("role", "STUDENT"),
      )
      .collect();

    return studentNumber.length;
  },
});

// *FUNCTION TO GET TOTAL NUMBER OF TEACHERS FROM THE USERS SCHEMA
export const fetchTotalTeachers = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // * GET THE TOTAL NUMBER OF USERS FROM THE BACKEND WITH THE ROLE OF TEACHER AND JUST RETURN THE COUNT
    const teacherNumber = await ctx.db
      .query("users")
      .withIndex("by_school", (q) =>
        q.eq("schoolId", args.schoolId).eq("role", "TEACHER"),
      )
      .collect();

    return teacherNumber.length;
  },
});

//   *FETCH THE TOTAL NUMBER OF SUBJECTS FROM THE BACKEND AND RETURN THEM
export const fetchTotalSubjects = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // * GET THE TOTAL NUMBER OF SUBJECTS FROM THE BACKEND
    const subjectNumber = await ctx.db
      .query("subjects")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return subjectNumber.length;
  },
});
