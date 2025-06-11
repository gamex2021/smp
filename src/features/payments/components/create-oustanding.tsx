/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CardLayout from "@/components/card-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDomain } from "@/context/DomainContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "~/_generated/api";
import { type Id } from "~/_generated/dataModel";

// The schema for the form validation
const outstandingFormSchema = z.object({
  studentId: z.custom<Id<"users">>(),
  classId: z.custom<Id<"classes">>(),
  academicYear: z.string(),
  termId: z.string(),
  feeId: z.string(),
  feeName: z.string(),
  amount: z.number().min(0, "Amount must be a positive number"),
  remainingAmount: z
    .number()
    .min(0, "Remaining amount must be a positive number"),
  dueDate: z.string(),
  isCompulsory: z.boolean(),
});

interface EnhancedCreateOutstandingFormProps {
  onClose: () => void;
}
const CreateOutstandingForm = ({
  onClose,
}: EnhancedCreateOutstandingFormProps) => {
  const form = useForm<z.infer<typeof outstandingFormSchema>>({
    resolver: zodResolver(outstandingFormSchema),
    defaultValues: {
      academicYear: "",
      termId: "",
      feeId: "",
      feeName: "",
      amount: 0,
      remainingAmount: 0,
    },
  });
  const { school, domain } = useDomain();
  const [loader, setLoader] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<Id<"academicConfig">>();

  // *MUTTAION FOR THE OUTSTANDING PAYMENT
  const createOutstandingMutation = useMutation(
    api.mutations.fees.createOutstandingPaymentForStudent,
  );
  //   * GET THE STUDENT DETAILS WITH PAGINATION , THEY SHOULD ALSO BE ABLE TO SEARCH FOR THE STUDENT
  const [studentSearch, setStudentSearch] = useState("");
  const {
    results: students,
    status: studentStatus,
    loadMore: loadMoreStudents,
  } = usePaginatedQuery(
    api.queries.student.getStudentsWithPagination,
    domain ? { domain, search: studentSearch } : "skip",
    { initialNumItems: 12 },
  );

  //*GET THE LIST OF CLASSES FOR THE SCHOOL, IT SHOUOLD ALSO BE PAGINATED AND SEARCHABLE
  const [classesSearch, setClassesSearch] = useState("");
  const {
    results: classes,
    status: classesStatus,
    loadMore: loadMoreClasses,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search: classesSearch } : "skip",
    {
      initialNumItems: 12,
    },
  );

  // *GET THE CURRENT ACADEMIC YEAR
  const currentYear = useQuery(
    api.queries.school.getCurrentAcademicYear,
    school?._id
      ? {
          schoolId: school?._id,
        }
      : "skip",
  );

  // * GET THE LIST OF ALL ACADEMIC YEARS FOR THE SCHOOL
  const academicYears = useQuery(
    api.queries.school.getAllAcademicYears,
    school?._id
      ? {
          schoolId: school?._id,
        }
      : "skip",
  );

  //* WHEN AN ACADEMIC YEAR IS SELECTED, GET THE TERMS FOR THAT ACADEMIC YEAR
  const currentSelectedAcademicYear = useQuery(
    api.queries.school.getAcademicConfigById,
    selectedAcademicYear && school?._id
      ? {
          academicConfigId: selectedAcademicYear,
          schoolId: school?._id,
        }
      : "skip",
  );

  // *THIS IS THE CLASS FEE STRUCTURE , TO GET THE CURRENT SELECTED CLASS FEE STRUCTURE
  const classFeeStructureQuery = useQuery(
    api.queries.fees.getClassFeeStructure,
    form.getValues("classId") &&
      form.getValues("academicYear") &&
      Number.parseInt(form.getValues("termId"))
      ? {
          classId: form.getValues("classId"),
          academicYear: form.getValues("academicYear"),
          termId: Number.parseInt(form.getValues("termId")),
        }
      : "skip",
  );

  //   console.log(
  //     "Class Fee Structure Query: ",
  //     form.getValues("classId"),
  //     form.getValues("academicYear"),
  //     Number.parseInt(form.getValues("termId")),
  //     form.getValues("termId"),
  //     classFeeStructureQuery,
  //   );

  //   console.log("form", form, form.getValues());

  useEffect(() => {
    if (form.getValues("classId")) {
      setSelectedClass(classFeeStructureQuery);
    } else {
      setSelectedClass(null);
    }
  }, [
    form.getValues("classId"),
    form.getValues("academicYear"),
    form.getValues("termId"),
    classFeeStructureQuery,
  ]);

  //   *FUNCTION TO CREATE THE OUTSTANDING FOR THE STUDENT
  async function onSubmit(values: z.infer<typeof outstandingFormSchema>) {
    if (!school?._id) {
      toast.error("Could not get school info.");
      return;
    }

    setLoader(true);

    try {
      await createOutstandingMutation({
        ...values,
        schoolId: school._id,
        termId: Number.parseInt(values.termId),
      });
      toast.success(
        `Successfully created outstanding payment for ${values.feeName}`,
      );
      setLoader(false);
      onClose();
      form.reset();
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
          {/* //* CHOOSE A STUDENT, CLASS AND ACADEMIC YEAR */}

          <Card>
            <CardHeader>
              <CardTitle>Fundamentals</CardTitle>
              <CardDescription>
                Enter the student, class and academic year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* //* CHOOSE A STUDENT */}
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      {/* SEARCH FOR THE STUDENT */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          value={studentSearch}
                          placeholder="Search for a student......"
                          className="w-full pl-9"
                          onChange={(e) => {
                            setStudentSearch(e.target.value);
                          }}
                        />
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a student" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {students?.map((student) => (
                            <SelectItem key={student._id} value={student._id}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {/* LOAD MORE STUDENTS */}
                        {studentStatus === "CanLoadMore" && (
                          <div className="mt-8 flex justify-center">
                            <Button
                              role="button"
                              aria-label="Load more students"
                              onClick={() => loadMoreStudents(12)}
                              variant="outline"
                              className="px-8"
                            >
                              Load More
                            </Button>
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* //* CHOOSE A CLASS */}
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      {/* SEARCH FOR A CLASS */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          value={classesSearch}
                          placeholder="Search for a class......"
                          className="w-full pl-9"
                          onChange={(e) => {
                            setClassesSearch(e.target.value);
                          }}
                        />
                      </div>
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
                        {/* LOAD MORE ClASSES */}
                        {classesStatus === "CanLoadMore" && (
                          <div className="mt-8 flex justify-center">
                            <Button
                              role="button"
                              aria-label="Load more classes"
                              onClick={() => loadMoreClasses(12)}
                              variant="outline"
                              className="px-8"
                            >
                              Load More
                            </Button>
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* //* SELECT THE ACADEMIC YEAR AND TERM FOR THE PAYMENT */}
          <CardLayout
            title="Academic Year and Term"
            description="Select the academic year and term for the outstanding payment"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* //* ACADEMIC YEAR */}
              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);

                        const selectedYear = academicYears?.find(
                          (year) => year.academicYear === value,
                        );
                        setSelectedAcademicYear(selectedYear?._id);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicYears?.map((year) => (
                          <SelectItem key={year._id} value={year.academicYear}>
                            {year.academicYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the academic year</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* //* TERM */}
              <FormField
                control={form.control}
                name="termId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentSelectedAcademicYear?.terms?.map((term) => (
                          <SelectItem
                            key={term.termNumber}
                            value={term.termNumber.toString()}
                          >
                            {term.termNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the term</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardLayout>

          {/* //* FEE TYPE AND AMOUNT, AMOUNT ENTERED WILL BE ADDED TO THE REMAINING AMOUNT */}
          <CardLayout
            title="Fee Type and Amount"
            description="Enter the fee type and amount for the outstanding payment"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* //* FEE TYPE */}
              <FormField
                control={form.control}
                name="feeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (!form.getValues("studentId")) {
                          toast.error("Please select a student first");
                          return;
                        }
                        field.onChange(value);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                        const fee = selectedClass?.fees.find(
                          (f: { id: string }) => f.id === value,
                        );
                        if (fee) {
                          form.setValue("feeName", fee?.name);
                          form.setValue("amount", fee?.amount);
                          form.setValue("dueDate", fee?.dueDate);
                          form.setValue("isCompulsory", fee?.isCompulsory);
                          form.setValue("remainingAmount", fee?.amount);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fee type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedClass?.fees.map(
                          (fee: {
                            id: React.Key | null | undefined;
                            name:
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | Promise<React.AwaitedReactNode>
                              | null
                              | undefined;
                            amount: {
                              toLocaleString: () =>
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                    any,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | Promise<React.AwaitedReactNode>
                                | null
                                | undefined;
                            };
                          }) => (
                            <SelectItem key={fee.id} value={String(fee.id)}>
                              {fee.name} - ₦
                              {Number(fee.amount).toLocaleString()}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the fee type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* //* FEE REMAINING AMOUNT */}
              {/* //TODO: The remaining amount cannot be more than the amount selected */}
              <FormField
                control={form.control}
                name="remainingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Amount</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter fee amount"
                      {...field}
                      disabled={
                        !form.getValues("feeId") || !form.getValues("studentId")
                      }
                      onChange={(e) => {
                        field.onChange(Number.parseFloat(e.target.value) || 0);
                      }}
                    />
                    <FormDescription>
                      Enter the fee amount for the outstanding payment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardLayout>

          <Button type="submit" className="w-full" disabled={loader}>
            {loader ? "Creating Outstanding..." : "Create Outstanding"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateOutstandingForm;
