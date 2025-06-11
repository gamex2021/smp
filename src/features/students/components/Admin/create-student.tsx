/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState, useCallback } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDomain } from "@/context/DomainContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAction,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { useForm } from "react-hook-form";
import { TbLoader3 } from "react-icons/tb";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "~/_generated/api";
import type { Id } from "~/_generated/dataModel";
import { OutstandingPaymentSelector } from "./shared/outstanding-payment-selector";

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
    message: "Address must be at least 10 characters.",
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

interface SelectedPayment {
  termId: number;
  termName: string;
  feeId: string;
  feeName: string;
  originalAmount: number;
  proratedAmount: number;
  dueDate: string;
  isCompulsory: boolean;
}

interface EnhancedCreateStudentFormProps {
  onClose: () => void;
}

export function CreateStudentForm({ onClose }: EnhancedCreateStudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      guardianPhone: "",
      guardianName: "",
      bio: "",
      gender: "prefer_not_to_say",
    },
  });

  const [loader, setLoader] = useState<boolean>(false);
  const [addOutstandingPayments, setAddOutstandingPayments] =
    useState<boolean>(false);
  const [selectedPayments, setSelectedPayments] = useState<SelectedPayment[]>(
    [],
  );
  const [classesSearch, setClassesSearch] = useState("");

  // Hooks
  const { domain, school } = useDomain();
  const { signIn } = useAuthActions();

  // Mutations and Actions
  const createStudent = useAction(api.mutations.student.createStudent);
  const generateUploadUrl = useMutation(api.mutations.user.generateUploadUrl);
  const createOutstandingPaymentForStudent = useMutation(
    api.mutations.fees.createOutstandingPaymentForStudent,
  );

  // Queries
  const schoolInfo = useQuery(api.queries.school.findSchool, {
    domain,
  });

  const currentAcademicConfig = useQuery(
    api.queries.academic.getCurrentTerm,
    school?._id ? { schoolId: school._id } : "skip",
  );

  // *Get the list of classes for the school, it should also be paginated and searchable
  const {
    results: classes,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search: classesSearch } : "skip",
    {
      initialNumItems: 12,
    },
  );

  // Watch the selected class to enable/disable outstanding payments
  const selectedClassId = form.watch("currentClass");

  const handlePaymentsChange = useCallback((payments: SelectedPayment[]) => {
    setSelectedPayments(payments);
  }, []);

  // FUNCTION TO CREATE STUDENT
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!schoolInfo?.id) {
      toast.error("Could not get school info.");
      return;
    }

    setLoader(true);
    let newValues = { ...values };
    delete newValues.profilePicture;

    try {
      // Handle profile picture upload
      if (values?.profilePicture?.type) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": values.profilePicture.type },
          body: values.profilePicture,
        });
        const { storageId } = await result.json();
        const storage: Id<"_storage"> = storageId;
        newValues = {
          ...newValues,
          image: storage,
        };
      }

      // Create student account
      const fd = new FormData();
      fd.append("email", newValues.email);

      await signIn("resend-otp", fd).then(async () => {
        // Create the student
        const result = await createStudent({
          ...newValues,
          schoolId: schoolInfo?.id,
        });

        // Create outstanding payments if selected
        if (
          addOutstandingPayments &&
          selectedPayments.length > 0 &&
          currentAcademicConfig?.year &&
          result?.studentId
        ) {
          const paymentPromises = selectedPayments.map((payment) =>
            createOutstandingPaymentForStudent({
              schoolId: schoolInfo.id,
              studentId: result.studentId,
              classId: newValues.currentClass,
              academicYear: currentAcademicConfig?.year ?? "",
              termId: payment.termId ?? "",
              feeId: payment.feeId,
              feeName: payment.feeName,
              amount: payment.proratedAmount,
              dueDate: payment.dueDate,
              isCompulsory: payment.isCompulsory,
            }),
          );

          await Promise.all(paymentPromises);

          toast.success(
            `Successfully created student with ${selectedPayments.length} outstanding payment(s)`,
          );
        } else {
          toast.success("Successfully created student");
        }
      });

      setLoader(false);
      onClose();
      form.reset();
      setSelectedPayments([]);
      setAddOutstandingPayments(false);
    } catch (error) {
      console.error("There was an error", error);
      toast.error(
        `${error instanceof Error ? error.message : "Something went wrong"}`,
      );
      setLoader(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the student&apos;s personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
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

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="If there is any student's information, please write here..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
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
            </CardContent>
          </Card>

          {/* Class Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Class Assignment</CardTitle>
              <CardDescription>Assign the student to a class</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="currentClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Class of the student</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                      Select class you want to assign to the student
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Outstanding Payments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Payments</CardTitle>
              <CardDescription>
                Optionally add outstanding payments for this student
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-outstanding-payments"
                  checked={addOutstandingPayments}
                  onCheckedChange={(checked) =>
                    setAddOutstandingPayments(checked === true)
                  }
                />
                <label
                  htmlFor="add-outstanding-payments"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add outstanding payments for this student
                </label>
              </div>

              {addOutstandingPayments && (
                <div className="mt-4">
                  <OutstandingPaymentSelector
                    classId={selectedClassId}
                    schoolId={school?._id}
                    academicYear={currentAcademicConfig?.year}
                    terms={currentAcademicConfig?.terms ?? []}
                    onPaymentsChange={handlePaymentsChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose} disabled={loader}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#11321f]/80 hover:bg-[#11321f]/50"
              disabled={loader}
            >
              {loader ? (
                <TbLoader3 className="h-7 w-7 animate-spin text-white" />
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateStudentForm;
