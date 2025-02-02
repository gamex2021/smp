/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import bcrypt from "bcryptjs";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action, internalMutation } from "../_generated/server";

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

    return { success: true };
  },
});
