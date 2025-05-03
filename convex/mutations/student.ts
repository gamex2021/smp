/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";
import { action, internalMutation } from "../_generated/server";
import { Resend as ResendAPI } from "resend";
import { getAuthUserId } from "@convex-dev/auth/server";

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

// ADD THE CLASS STUDENT, to the class student schema which is just a junction table that joins the student with a class or vice versa tbh
export const addClassStudent = internalMutation({
  args: {
    classId: v.id("classes"),
    studentId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, { classId, studentId, schoolId }) => {
    const classDoc = await ctx.db.get(classId);
    if (!classDoc || classDoc.schoolId !== schoolId) {
      throw new Error("Invalid class");
    }
    return await ctx.db.insert("classStudent", {
      classId: classId,
      studentId: studentId,
      schoolId: schoolId,
    });
  },
});

export const createStudent = action({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    currentClass: v.optional(v.id("classes")),
    gender: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    guardianName: v.string(),
    guardianPhone: v.string(),
    address: v.string(),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }
    // get the password for the teacher
    const password = generatePassword();

    const hashedPassword: string = await bcrypt.hash(password, 10);

    // create the student in the database using this.(this returns the username)
    const studentId = await ctx.runMutation(
      internal.mutations.user.createEntity,
      {
        name: args.name,
        email: args.email,
        password: hashedPassword,
        role: "STUDENT",
        schoolId: args.schoolId,
        phone: args.phone,
        bio: args.bio,
        gender: args.gender,
        image: args.image,
        currentClass: args.currentClass,
      },
    );

    // Update student to the class
    if (args.currentClass) {
      await ctx.runMutation(internal.mutations.student.addClassStudent, {
        classId: args.currentClass,
        studentId,
        schoolId: args.schoolId,
      });
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

// remove a student from a class, this will be used to remove a student from a class
export const removeClassStudent = internalMutation({
  args: {
    id: v.id("classStudent"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

// update the student informatiion, this will be used to update the student information
export const updateStudent = action({
  args: {
    studentId: v.id("users"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    currentClass: v.optional(v.id("classes")),
    gender: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    guardianName: v.string(),
    guardianPhone: v.string(),
    address: v.string(),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { studentId, schoolId, currentClass } = args;

    // verifying that the student exists and is in the same school as the user
    const studentDoc = await ctx.runQuery(internal.queries.user.getUser, {
      userId: studentId,
    });
    if (!studentDoc || studentDoc.schoolId !== schoolId) {
      throw new Error("Invalid student");
    }

    await ctx.runMutation(internal.mutations.user.updateEntity, {
      id: studentId,
      name: args.name,
      email: args.email,
      schoolId: args.schoolId,
      phone: args.phone,
      bio: args.bio,
      gender: args.gender,
      currentClass: currentClass,
      image: args.image,
    });

    if (args.currentClass) {
      // get the current class of the student
      const classStudent = await ctx.runQuery(
        api.queries.student.getStudentCurrentClass,
        {
          studentId: studentId,
          schoolId: schoolId,
        },
      );

      // remove the student from the class
      await ctx.runMutation(internal.mutations.student.removeClassStudent, {
        id: classStudent._id,
      });
      // add the student to the new class
      await ctx.runMutation(internal.mutations.student.addClassStudent, {
        classId: args.currentClass,
        studentId,
        schoolId: args.schoolId,
      });
    }

    return { success: true };
  },
});

// delete the student, this will be used to delete the student
export const deleteStudent = action({
  args: {
    studentId: v.id("users"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, { studentId, schoolId }) => {
    // verifying that the person making the request is an admin and is logged in
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // verifying that the student exists and is in the same school as the user
    const studentDoc = await ctx.runQuery(internal.queries.user.getUser, {
      userId: studentId,
    });
    if (!studentDoc || studentDoc.schoolId !== schoolId) {
      throw new Error("Invalid student");
    }

    //delete the current class of the student from memory too
    const classStudent = await ctx.runQuery(
      api.queries.student.getStudentCurrentClass,
      {
        studentId: studentId,
        schoolId: schoolId,
      },
    );

    if (classStudent) {
      await ctx.runMutation(internal.mutations.student.removeClassStudent, {
        id: classStudent._id,
      });
    }

    // delete the student from the database
    await ctx.runMutation(internal.mutations.user.deleteEntity, {
      id: studentId,
    });

    return { success: true };
  },
});
