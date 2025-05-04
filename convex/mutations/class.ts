import { v } from "convex/values";
import { action, internalMutation, mutation } from "../_generated/server";
import { checkAdmin } from "./helpers";
import { api, internal } from "../_generated/api";
import { type Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createClass = mutation({
  args: {
    title: v.string(),
    schoolId: v.id("schools"),
    teacherIds: v.optional(v.array(v.id("users"))),
  },

  handler: async (ctx, args) => {
    const { teacherIds, ...rest } = args;
    await checkAdmin(ctx);

    // * create the class with the argument
    const classId = await ctx.db.insert("classes", {
      ...rest,
      searchableText: `${args.title.toLowerCase()}`,
    });

    // add the class teachers to the class
    if (teacherIds && teacherIds?.length > 0) {
      await Promise.all(
        teacherIds?.map(async (teacherId: Id<"users">) => {
          await ctx.runMutation(internal.mutations.teacher.addClassTeacher, {
            classId,
            teacherId,
            schoolId: args.schoolId,
          });
        }),
      );
    }
    // return true on successful classes creation
    return { success: true };
  },
});

// update a class
export const updateClass = mutation({
  args: {
    classId: v.id("classes"),
    title: v.string(),
    schoolId: v.id("schools"),
    teacherIds: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    await checkAdmin(ctx);

    // * make sure the class to be updated exists in the school designation
    const classDetails = await ctx.db.get(args.classId);
    if (!classDetails || classDetails.schoolId !== args.schoolId) {
      throw new Error("Subject not found");
    }

    await ctx.db.patch(args.classId, {
      title: args.title,
      searchableText: `${args.title.toLowerCase()}`,
    });

    /*  
        ? We need to find a way in this function to know if the user...
        ? ...has made an edit to the class teachers or not
    */
    // this one is for if there is an update on the teacherIds
    if (args.teacherIds && args.teacherIds.length > 0) {
      // First, remove existing class teacher assignments
      const existingAssignments = await ctx.runQuery(
        internal.queries.class.getClassTeacher,
        {
          classId: args.classId,
        },
      );

      if (existingAssignments && existingAssignments.length > 0) {
        await Promise.all(
          existingAssignments.map(
            async (assignment: { _id: Id<"classTeacher"> }) => {
              await ctx.runMutation(
                internal.mutations.teacher.removeClassTeacher,
                {
                  id: assignment._id,
                },
              );
            },
          ),
        );
      }

      // Then, add new class teacher assignments
      await Promise.all(
        args.teacherIds.map(async (teacherId) => {
          await ctx.runMutation(internal.mutations.teacher.addClassTeacher, {
            classId: args.classId,
            teacherId,
            schoolId: args.schoolId,
          });
        }),
      );
    } else {
      // If the class teacher assignment is empty , then delete every class teacher assignment
      const existingAssignments = await ctx.runQuery(
        internal.queries.teacher.getClassesTeacher,
        {
          classId: args.classId,
        },
      );

      if (existingAssignments && existingAssignments.length > 0) {
        await Promise.all(
          existingAssignments.map(async (assignment) => {
            await ctx.runMutation(
              internal.mutations.teacher.removeClassTeacher,
              {
                id: assignment._id,
              },
            );
          }),
        );
      }
    }

    return { success: true };
  },
});

// delete a class

export const deleteClass = action({
  args: {
    classId: v.id("classes"),
  },
  handler: async (ctx, { classId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify that the teacher exists
    const classDetails = await ctx.runQuery(api.queries.class.getClassById, {
       classId
    });

    if (!classDetails) {
      throw new Error("Teacher not found");
    }

    // Remove class teacher assignments
    const classAssignments = await ctx.runQuery(
      internal.queries.teacher.getClassesTeacher,
      {
        classId,
      },
    );

    if (classAssignments && classAssignments.length > 0) {
      await Promise.all(
        classAssignments.map(async (assignment) => {
          await ctx.runMutation(internal.mutations.teacher.removeClassTeacher, {
            id: assignment._id,
          });
        }),
      );
    }



    // Delete the teacher account
    await ctx.runMutation(internal.mutations.class.deleteClassById, {
      id: classId,
    });

    return { success: true };
  },
});


export const deleteClassById = internalMutation({
  args : {
    id : v.id("classes")
  }, handler : async(ctx, {id}) => {
     // verifying that the person making the request is an admin and is logged in
     await checkAdmin(ctx);

     await ctx.db.delete(id)

     return {success : true}
  }
})