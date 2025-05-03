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

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/_generated/api";
import { showErrorToast } from "@/lib/handle-error";
import { useParams } from "next/navigation";
import { Icons } from "@/components/icons";
import { type Id } from "~/_generated/dataModel";

export function CreateClassGroup({ classId }: { classId: string }) {
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
          <DialogTitle>Add a group</DialogTitle>
          <DialogDescription>
            Create a group. You add students and assign teachers to groups, not
            classes.
          </DialogDescription>
        </DialogHeader>
        <AddClassForm classId={classId} />
      </DialogContent>
    </Dialog>
  );
}

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
});

export function AddClassForm({ classId }: { classId: string }) {
  const [loading, setLoading] = React.useState(false);
  const params = useParams<{ domain: string }>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  const createGroupAction = useMutation(api.mutations.class.createGroup);
  const schoolInfo = useQuery(api.queries.school.findSchool, {
    domain: params.domain,
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!schoolInfo || !schoolInfo.id) {
      toast.error("Could not get school info.");
      return;
    }
    setLoading(true);
    try {
      await createGroupAction({
        title: data.title,
        school: schoolInfo.id,
        class: classId as Id<"classes">,
      });
      toast.success("Group created.");
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group name/title</FormLabel>
              <FormControl>
                <Input placeholder="Ex. Science, Gold" {...field} />
              </FormControl>
              <FormDescription>
                Each class is broken down into groups, to better manage teachers
                and students.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {" "}
          {loading && (
            <Icons.spinner className="ml-2 size-4 animate-spin" />
          )}{" "}
          Submit{" "}
        </Button>
      </form>
    </Form>
  );
}
