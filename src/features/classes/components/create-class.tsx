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
import { api } from "convex/_generated/api";
import { showErrorToast } from "@/lib/handle-error";
import { useParams } from "next/navigation";
import { Icons } from "@/components/icons";

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
});

export function AddClassForm() {
    const [loading, setLoading] = React.useState(false);
    const params = useParams<{ domain: string }>();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    });

    const createClassAction = useMutation(api.mutations.class.createClass);
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
            await createClassAction({
                title: data.title,
                school: schoolInfo.id,
            });
            toast.success("Class created.");
            form.reset()
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
                <Button disabled={loading} type="submit">
                    {loading && <Icons.spinner className="ml-2 size-4 animate-spin" />}
                    Submit
                </Button>
            </form>
        </Form>
    );
}
