"use client";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Student } from "../../../types";

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
  address: z.string().min(4, {
    message: "Address must be at least 4 characters.",
  }),
  guardianPhone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  guardianName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image: z.custom<Id<"_storage">>().optional(),
  currentClass: z.custom<Id<"classes">>(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
});

interface EditStudentFormProps {
  student: Student;
  onClose: () => void;
}

export default function EditStudentForm({
  student,
  onClose,
}: EditStudentFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { domain } = useDomain();

  // Get school info
  const schoolInfo = useQuery(api.queries.school.findSchool, { domain });

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

  // Update student mutation
  const updateStudent = useAction(api.mutations.student.updateStudent);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: student.name ?? "",
      email: student.email ?? "",
      phone: student.phone ?? "",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      bio: student?.bio ?? "",
      gender:
        (student.gender as "male" | "female" | "other" | "prefer_not_to_say") ??
        "prefer_not_to_say",
      address: student.address ?? "",
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone ?? "",
      image: student.image ?? undefined,
      currentClass: student.currentClass?._id ?? "",
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { storageId } = await result.json();
        newValues = {
          ...newValues,
          image: storageId as Id<"_storage">,
        };
      } else {
        delete newValues.image; // Remove image if not uploading a new one
      }

      // Update the student
      await updateStudent({
        studentId: student._id,
        ...newValues,
        schoolId: schoolInfo?.id,
      });

      toast.success("Student updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
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
          {/* Student's name */}
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

          {/* Student's email */}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Guardian Name */}
          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Name</FormLabel>
                <FormControl>
                  <Input placeholder="Guardian Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Guardian Phone */}
          <FormField
            control={form.control}
            name="guardianPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guardian Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Student's address" {...field} />
              </FormControl>
              <FormDescription>Enter Student Address</FormDescription>
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
                  placeholder="Student information..."
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
                {student.image && (
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    <img
                      src={student.image ?? "/placeholder.svg"}
                      alt={student.name}
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

        {/* Class Assignment */}
        <FormField
          control={form.control}
          name="currentClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes?.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the student&apos;s current class
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4B6CB7] hover:bg-[#4B6CB7]/80"
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
