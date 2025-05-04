/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
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

import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/_generated/api";
import { showErrorToast } from "@/lib/handle-error";
import { useParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { type Id } from "~/_generated/dataModel";
import { MultiSelect } from "@/components/ui/multi-select";

export function CreateClassCard() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex min-h-[160px] w-full flex-col items-center justify-center rounded-lg bg-gray-200 p-4 transition-colors hover:bg-gray-300">
          <div className="mb-2 rounded-full bg-white p-3">
            <Plus className="h-6 w-6 text-gray-600" />
          </div>
          <span className="text-gray-600">More</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a class</DialogTitle>
          <DialogDescription>
            Create a class and group within that class.
          </DialogDescription>
        </DialogHeader>
        <AddClassForm />
      </DialogContent>
    </Dialog>
  );
}

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  teacherIds: z.array(z.custom<Id<"users">>()),
});

export function AddClassForm() {
  const [loading, setLoading] = React.useState(false);
  const params = useParams<{ domain: string }>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      teacherIds: [],
    },
  });

  const createClassAction = useMutation(api.mutations.class.createClass);
  const schoolInfo = useQuery(api.queries.school.findSchool, {
    domain: params.domain,
  });

  // ? to search for the teacher ? is this really needed tho ?
  const [teacherSearch, setTeacherSearch] = React.useState("");

  // Get the teachers and paginate them
  const {
    results: teachers,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.teacher.getTeachersWithPagination,
    params.domain ? { domain: params.domain, search: teacherSearch } : "skip",
    { initialNumItems: 12 },
  );

  // * This is the submit function to create the class
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!schoolInfo || !schoolInfo.id) {
      toast.error("Could not get school info.");
      return;
    }
    setLoading(true);
    try {
      await createClassAction({
        title: data.title,
        schoolId: schoolInfo.id,
        teacherIds: data.teacherIds,
      });
      toast.success("Class created.");
      form.reset();
      // do a redirect to that class or something
    } catch (err) {
      showErrorToast(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* for the class title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class title</FormLabel>
              <FormControl>
                <Input placeholder="JSS1 or SS3" {...field} />
              </FormControl>
              <FormDescription>
                This is shold be the name of a class in your school, you can
                also create groups within a class too.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* to assign teachers to a class
                   remember that many teachers can actually be the class teachers of a particular class
                */}

        <FormField
          control={form.control}
          name="teacherIds"
          render={({ field }) => (
            <FormItem>
              {/* search for a teacher using this search bar, this will be good for the user experience */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search for a teacher......"
                  className="w-full pl-9"
                  onChange={(e) => setTeacherSearch(e.target.value)}
                />
              </div>
              <FormLabel>Assign class teacher(s)</FormLabel>
              <FormControl>
                <MultiSelect
                  selected={field.value}
                  options={
                    teachers?.map((c) => ({
                      label: c.name ?? c.email,
                      value: c._id,
                    })) ?? []
                  }
                  onChange={(values) => field.onChange(values)}
                  placeholder="Select teacher(s)"
                />
              </FormControl>
              <FormDescription>
                {status === "CanLoadMore" && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      role="button"
                      aria-label="Load more teachers"
                      onClick={() => loadMore(12)}
                      variant="outline"
                      className="px-8"
                    >
                      Load More
                    </Button>
                  </div>
                )}
                Select a class teacher for this class, you can choose multiple
                teachers if needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {/* TODO: we need to create a button for a cancel modal functionality
          here, and since we are using dialog, there should be a way around */}
          
          {/* <Button variant="outline" onClick={onclose}>
            Cancel
          </Button> */}
          <Button disabled={loading} type="submit">
            {loading && <Icons.spinner className="ml-2 size-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
