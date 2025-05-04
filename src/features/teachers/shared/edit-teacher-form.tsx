"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useDomain } from "@/context/DomainContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TbLoader3 } from "react-icons/tb";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "~/_generated/api";
import type { Id } from "~/_generated/dataModel";
import type { Teacher } from "../types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  qualifications: z.string().min(1, {
    message: "Please enter qualifications.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (file) {
        return file.size <= 5000000; // 5MB
      }
      return true;
    }, `Max file size is 5MB.`),
  image: z.custom<Id<"_storage">>().optional(),
  isClassTeacher: z.boolean(),
  subjects: z
    .array(
      z.object({
        subject: z.custom<Id<"subjects">>(),
        classes: z.custom<Id<"classes">>(),
      }),
    )
    .optional(),
  classAssigned: z.array(z.custom<Id<"classes">>()),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
});

interface EditTeacherFormProps {
  teacher: Teacher;
  onClose: () => void;
}

export default function EditTeacherForm({
  teacher,
  onClose,
}: EditTeacherFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { domain } = useDomain();

  // Get school info
  const schoolInfo = useQuery(api.queries.school.findSchool, { domain });

  // Get subjects and classes
  const subjectsQuery = useQuery(api.queries.subject.getSTC, { domain });
 // TODO: to search for a class, this should be done later , in the form
   const [classesSearch, setClassesSearch] = useState("");
   // get the classes in the school
   const {
     results: classes,
     status,
     loadMore,
   } = usePaginatedQuery(
     api.queries.class.getClassesData,
     domain ? { domain, search: classesSearch } : "skip",
     { initialNumItems: 12 },
   );

  // For image upload
  const generateUploadUrl = useMutation(api.mutations.user.generateUploadUrl);

  // Update teacher mutation
  const updateTeacher = useAction(api.mutations.teacher.updateTeacher);

  // Check if teacher is a class teacher
  const isClassTeacher =
    teacher.assignedClasses && teacher.assignedClasses.length > 0;

  // Prepare subject values from teacher data
  const teacherSubjects =
    teacher.subjects
      ?.map((subject) => {
        // Find matching class for this subject
        const classForSubject = subjectsQuery?.find(
          (s) => s.currentSubject?._id === subject?._id,
        )?.currentClass;

        if (classForSubject) {
          return {
            subject: subject?._id,
            classes: classForSubject._id,
          };
        }
        return null;
      })
      .filter(Boolean) || [];

  // Get class IDs assigned to the teacher
  const classAssigned = teacher.assignedClasses?.map((c) => c?._id) || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: teacher.name ?? "",
      email: teacher.email ?? "",
      phone: teacher.phone ?? "",
      qualifications: teacher.qualifications ?? "",
      bio: teacher.bio ?? "",
      gender:
        (teacher.gender as "male" | "female" | "other" | "prefer_not_to_say") ||
        "prefer_not_to_say",
      isClassTeacher: isClassTeacher,
      image: teacher.image ?? undefined,
      subjects: teacherSubjects as {
        subject: Id<"subjects">;
        classes: Id<"classes">;
      }[],
      classAssigned: classAssigned,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!schoolInfo?.id) {
      toast.error("Could not get school info.");
      return;
    }

    setLoading(true);

    try {
      let newValues = { ...values };
      delete newValues.profilePicture; // Remove profilePicture initially

      // Handle file upload if there's a new profile picture
      if (values?.profilePicture?.type) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": values.profilePicture.type },
          body: values.profilePicture,
        });
        const jsonResponse = (await result.json()) as {
          storageId: Id<"_storage">;
        };
        const { storageId } = jsonResponse;
        newValues = {
          ...newValues,
          image: storageId,
        };
      } else {
        delete newValues.image; // Remove image if not uploading a new one
      }

      // Update the teacher
      await updateTeacher({
        teacherId: teacher._id,
        ...newValues,
        schoolId: schoolInfo?.id,
      });

      toast.success("Teacher updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error(
        `${error instanceof Error ? error.message : "Something went wrong"}`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Teacher's name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teacher's email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@example.com"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormDescription>Email cannot be changed</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="prefer_not_to_say" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Prefer not to say
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subjects */}
        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects</FormLabel>
              <FormControl>
                <MultiSelect
                  options={
                    subjectsQuery?.map((c) => ({
                      label: `${c?.currentClass?.title} ${c?.currentSubject?.name}`,
                      value: JSON.stringify({
                        subject: c?.currentSubject?._id,
                        classes: c?.currentClass?._id,
                      }),
                    })) ?? []
                  }
                  selected={
                    field?.value?.map((item) => JSON.stringify(item)) ?? []
                  }
                  onChange={(values) => {
                    const parsedValues = values.map(
                      (value: string) =>
                        JSON.parse(value) as {
                          subject: Id<"subjects">;
                          classes: Id<"classes">;
                        },
                    );
                    field.onChange(parsedValues);
                  }}
                  placeholder="Select subjects and classes"
                />
              </FormControl>
              <FormDescription>
                Subjects Assigned to the teacher
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Qualifications */}
        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications</FormLabel>
              <FormControl>
                <Input placeholder="B.Sc., M.Sc., Ph.D." {...field} />
              </FormControl>
              <FormDescription>
                Enter qualifications separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about the teacher's experience and expertise..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Picture */}
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <div className="mb-2 flex items-center space-x-4">
                {teacher.image && (
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    <img
                      src={teacher.image || "/placeholder.svg"}
                      alt={teacher.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <FormDescription>
                  Current profile picture. Upload a new one to replace it.
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Upload a profile picture (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Class Teacher */}
        <FormField
          control={form.control}
          name="isClassTeacher"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Class Teacher</FormLabel>
                <FormDescription>
                  Is this teacher assigned as a class teacher?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Class Assignment (if class teacher) */}
        {form.watch("isClassTeacher") && (
          <FormField
            control={form.control}
            name="classAssigned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classes</FormLabel>
                <FormControl>
                  <MultiSelect
                    selected={field.value}
                    options={
                      classes?.map((c) => ({
                        label: c.title,
                        value: c._id,
                      })) ?? []
                    }
                    onChange={(values) => field.onChange(values)}
                    placeholder="Select classes"
                  />
                </FormControl>
                <FormDescription>
                  Select classes you want to assign to the teacher
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#11321f]/80 hover:bg-[#11321f]/50"
            disabled={loading}
          >
            {loading ? (
              <TbLoader3 className="h-7 w-7 animate-spin text-white" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
