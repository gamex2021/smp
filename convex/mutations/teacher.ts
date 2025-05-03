/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action, internalMutation } from "../_generated/server";
import { Resend as ResendAPI } from "resend";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

const resend_api = process.env.AUTH_RESEND_KEY;

// Function to generate random password
function generatePassword() {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// ADD THE CLASS TEACHER, to the class teacher schema which is just a junction table that joins the teacher with a class or vice versa tbh
export const addClassTeacher = internalMutation({
  args: {
    classId: v.id("classes"),
    teacherId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, { classId, teacherId, schoolId }) => {
    const classDoc = await ctx.db.get(classId);
    if (!classDoc || classDoc.schoolId !== schoolId) {
      throw new Error("Invalid class");
    }
    return await ctx.db.insert("classTeacher", {
      classId: classId,
      teacherId: teacherId,
      schoolId: schoolId,
    });
  },
});

// add the subject teacher,to the subjectTeachers schema which is just a junction table that joins the teacher, with the subject and classes. this table is also used to join a subject with a class or vice versa
export const UpdateteacherSubjectClass = internalMutation({
  args: {
    teacherId: v.id("users"),
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
  },
  handler: async (ctx, args) => {
    const { teacherId, subjectId, classId } = args;

    // Check if the relationship already exists
    const existingRelation = await ctx.db
      .query("subjectTeachers")
      .withIndex("by_subject_and_class", (q) =>
        q.eq("subjectId", subjectId).eq("classId", classId),
      )
      .first();

    if (!existingRelation) {
      return null;
    }

    // Create new relationship
    return await ctx.db.patch(existingRelation._id, {
      teacherId,
    });
  },
});

export const updateteachersubject = internalMutation({
  args: {
    assignmentId: v.id("subjectTeachers"),
  },
  handler: async (ctx, args) => {
    const { assignmentId } = args;

    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.patch(assignmentId, {
      teacherId: undefined, // Set to undefined or use another appropriate default value
    });
  },
});

export const createTeacher = action({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    qualifications: v.optional(v.string()),
    classAssigned: v.optional(v.array(v.id("classes"))),
    gender: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    isClassTeacher: v.optional(v.boolean()),
    subjects: v.optional(
      v.array(
        v.object({
          subject: v.id("subjects"),
          classes: v.id("classes"),
        }),
      ),
    ),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    // get the password for the teacher
    const password = generatePassword();

    const hashedPassword: string = await bcrypt.hash(password, 10);

    // create the teacher in the database using this.(this returns the username)
    const teacherId = await ctx.runMutation(
      internal.mutations.user.createEntity,
      {
        name: args.name,
        email: args.email,
        password: hashedPassword,
        role: "TEACHER",
        schoolId: args.schoolId,
        phone: args.phone,
        bio: args.bio,
        gender: args.gender,
        qualifications: args.qualifications,
        image: args.image,
      },
    );

    // Assign subjects and classes to the teacher
    if (args.subjects) {
      await Promise.all(
        args.subjects.map(async (subject) => {
          await ctx.runMutation(
            internal.mutations.teacher.UpdateteacherSubjectClass,
            {
              teacherId,
              classId: subject?.classes,
              subjectId: subject?.subject,
            },
          );
        }),
      );
    }

    // Update classes teacher relation if the teacher is a class teacher
    if (args.isClassTeacher && args.classAssigned) {
      await Promise.all(
        args.classAssigned.map(async (classId) => {
          await ctx.runMutation(internal.mutations.teacher.addClassTeacher, {
            classId,
            teacherId,
            schoolId: args.schoolId,
          });
        }),
      );
    }

    /*    then find a way to send the user, and the password to the teacher, also we will need a functionality so that as soon as they log in the first time
     we will essentially force them to change their password. 
     */
    try {
      const resend = new ResendAPI(resend_api);
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_SERVER_FROM!,
        to: [args.email],
        subject: `Your Credentials`,
        text: `Find attached your password to sign into your school portal, you will be prompted to change your password immediately after authorization, Password : ${password} `,
      });

      if (error) {
        console.error(
          "An error occured while sending the credentials :",
          error,
        );
      }
    } catch (error) {
      console.error("This is the error", error);
    }

    return { success: true };
  },
});

// Update teacher information
export const updateTeacher = action({
  args: {
    teacherId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    qualifications: v.optional(v.string()),
    classAssigned: v.optional(v.array(v.id("classes"))),
    gender: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    isClassTeacher: v.optional(v.boolean()),
    subjects: v.optional(
      v.array(
        v.object({
          subject: v.id("subjects"),
          classes: v.id("classes"),
        }),
      ),
    ),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const { teacherId, schoolId, isClassTeacher, classAssigned, subjects } =
      args;

    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify that the teacher exists
    const teacher = await ctx.runQuery(internal.queries.user.getUser, {
      userId: teacherId,
    });

    if (!teacher || teacher.schoolId !== schoolId) {
      throw new Error("Teacher not found");
    }

    // Update teacher basic information
    await ctx.runMutation(internal.mutations.user.updateEntity, {
      id: teacherId,
      name: args.name,
      email: args.email,
      schoolId: args.schoolId,
      phone: args.phone,
      bio: args.bio,
      gender: args.gender,
      qualifications: args.qualifications,
      image: args.image,
    });

    // Handle class teacher assignments
    if (isClassTeacher && classAssigned && classAssigned.length > 0) {
      // First, remove existing class teacher assignments
      const existingAssignments = await ctx.runQuery(
        internal.queries.teacher.getTeacherClasses,
        {
          teacherId,
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
        classAssigned.map(async (classId) => {
          await ctx.runMutation(internal.mutations.teacher.addClassTeacher, {
            classId,
            teacherId,
            schoolId,
          });
        }),
      );
    } else if (!isClassTeacher) {
      // If not a class teacher anymore, remove all class assignments
      const existingAssignments = await ctx.runQuery(
        internal.queries.teacher.getTeacherClasses,
        {
          teacherId,
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

    // Handle subject assignments
    if (subjects && subjects.length > 0) {
      // Update subject assignments
      await Promise.all(
        subjects.map(async (subject) => {
          await ctx.runMutation(
            internal.mutations.teacher.UpdateteacherSubjectClass,
            {
              teacherId,
              classId: subject.classes,
              subjectId: subject.subject,
            },
          );
        }),
      );
    }

    return { success: true };
  },
});

// Remove a class teacher assignment
export const removeClassTeacher = internalMutation({
  args: {
    id: v.id("classTeacher"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

// Get teacher's class assignments
export const getTeacherClasses = internalMutation({
  args: {
    teacherId: v.id("users"),
  },
  handler: async (ctx, { teacherId }) => {
    return await ctx.db
      .query("classTeacher")
      .withIndex("by_teacher", (q) => q.eq("teacherId", teacherId))
      .collect();
  },
});

// Delete a teacher
export const deleteTeacher = action({
  args: {
    teacherId: v.id("users"),
  },
  handler: async (ctx, { teacherId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify that the teacher exists
    const teacher = await ctx.runQuery(internal.queries.user.getUser, {
      userId: teacherId,
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Remove class teacher assignments
    const classAssignments = await ctx.runQuery(
      internal.queries.teacher.getTeacherClasses,
      {
        teacherId,
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

    // Remove subject teacher assignments
    const subjectAssignments = await ctx.runQuery(
      internal.queries.teacher.getTeacherSubjects,
      {
        teacherId,
      },
    );

    if (subjectAssignments && subjectAssignments.length > 0) {
      await Promise.all(
        subjectAssignments.map(async (assignment) => {
          // Either remove the teacher from the subject or delete the relationship
          await ctx.runMutation(
            internal.mutations.teacher.updateteachersubject,
            {
              assignmentId: assignment._id,
            },
          );
        }),
      );
    }

    // Delete the teacher account
    await ctx.runMutation(internal.mutations.user.deleteEntity, {
      id: teacherId,
    });

    return { success: true };
  },
});
